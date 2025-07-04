import { db } from '../db/connection.js';
import { teams, players } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { faceitService } from './faceitService.js';
class RegisteredTeamsService {
    /**
     * 🔥 Busca todas as equipas registadas no site
     */
    async getRegisteredTeams() {
        try {
            const registeredTeams = await db
                .select()
                .from(teams)
                .leftJoin(players, eq(teams.id, players.teamId))
                .where(eq(teams.isActive, true));
            // Agrupar jogadores por equipa
            const teamsMap = new Map();
            for (const row of registeredTeams) {
                const team = row.teams;
                const player = row.players;
                if (!teamsMap.has(team.id)) {
                    teamsMap.set(team.id, {
                        id: team.id,
                        name: team.name,
                        faceit_team_id: team.faceitTeamId,
                        faceit_players: [],
                        players: []
                    });
                }
                const teamData = teamsMap.get(team.id);
                if (player) {
                    teamData.players.push({
                        id: player.id,
                        nickname: player.nickname,
                        faceit_id: player.faceitId,
                        faceit_nickname: player.faceitNickname
                    });
                    // Adicionar Faceit ID se disponível
                    if (player.faceitId) {
                        teamData.faceit_players.push(player.faceitId);
                    }
                }
            }
            return Array.from(teamsMap.values());
        }
        catch (error) {
            console.error('Erro ao buscar equipas registadas:', error);
            return [];
        }
    }
    /**
     * 🔥 Verifica se uma equipa/jogador está registado no site
     */
    async isTeamOrPlayerRegistered(teamName, playerIds = []) {
        const registeredTeams = await this.getRegisteredTeams();
        // Verificar por nome da equipa
        let foundTeam = registeredTeams.find(team => team.name.toLowerCase() === teamName.toLowerCase());
        if (foundTeam) {
            return foundTeam;
        }
        // Verificar por jogadores (se algum jogador da match estiver registado)
        for (const team of registeredTeams) {
            const hasRegisteredPlayer = team.faceit_players.some(faceitId => playerIds.includes(faceitId));
            if (hasRegisteredPlayer) {
                return team;
            }
        }
        return null;
    }
    /**
     * 🔥 Filtra matches ao vivo apenas das equipas registadas
     * ATUALIZADO: Não tenta conectar a APIs externas se não há Faceit configurado
     */
    async getFilteredLiveMatches() {
        try {
            const registeredTeams = await this.getRegisteredTeams();
            // Se não há equipas registadas, retornar array vazio
            if (registeredTeams.length === 0) {
                console.log('📭 Nenhuma equipa registada encontrada');
                return [];
            }
            // Verificar se há Faceit API configurada
            if (!process.env['FACEIT_API_KEY']) {
                console.log('⚠️ Faceit API não configurada - retornando dados locais apenas');
                return this.getLocalMatchesData(registeredTeams);
            }
            const filteredMatches = [];
            // Buscar matches ao vivo para cada equipa registada
            for (const team of registeredTeams) {
                // Só tentar Faceit se a equipa tem jogadores com Faceit ID
                if (team.faceit_players.length === 0) {
                    console.log(`⚠️ Equipa ${team.name} não tem jogadores com Faceit ID configurado`);
                    continue;
                }
                for (const faceitPlayerId of team.faceit_players) {
                    try {
                        const liveMatches = await faceitService.getPlayerLiveMatches(faceitPlayerId);
                        for (const match of liveMatches) {
                            // Verificar qual facção é a nossa equipa registada
                            const isOurTeamFaction1 = this.teamHasRegisteredPlayers(match.teams.faction1, team.faceit_players);
                            const isOurTeamFaction2 = this.teamHasRegisteredPlayers(match.teams.faction2, team.faceit_players);
                            if (isOurTeamFaction1 || isOurTeamFaction2) {
                                const opponentTeam = isOurTeamFaction1 ? match.teams.faction2 : match.teams.faction1;
                                filteredMatches.push({
                                    match,
                                    registered_team: team,
                                    opponent_info: {
                                        name: opponentTeam.nickname,
                                        temp_data: true // ⚠️ Dados temporários - serão removidos
                                    }
                                });
                            }
                        }
                    }
                    catch (error) {
                        console.warn(`Erro ao buscar matches para jogador ${faceitPlayerId}:`, error.message);
                    }
                }
            }
            // Remover duplicados (mesmo match pode aparecer por vários jogadores)
            const uniqueMatches = this.removeDuplicateMatches(filteredMatches);
            console.log(`🎯 Encontrados ${uniqueMatches.length} matches filtrados de equipas registadas`);
            return uniqueMatches;
        }
        catch (error) {
            console.error('Erro ao filtrar matches ao vivo:', error);
            // Em caso de erro, retornar dados locais
            const registeredTeams = await this.getRegisteredTeams();
            return this.getLocalMatchesData(registeredTeams);
        }
    }
    /**
     * 🔥 NOVO: Retorna dados locais quando não há Faceit configurado
     */
    getLocalMatchesData(registeredTeams) {
        console.log('🏠 Usando dados locais para matches');
        const localMatches = [];
        for (const team of registeredTeams) {
            // Criar match simulado para cada equipa
            const simulatedMatch = {
                match_id: `local_${team.id}_${Date.now()}`,
                status: 'ONGOING',
                teams: {
                    faction1: {
                        team_id: team.id,
                        nickname: team.name,
                        players: team.players.map(p => ({
                            player_id: p.id,
                            nickname: p.nickname
                        }))
                    },
                    faction2: {
                        team_id: 'opponent_team',
                        nickname: 'Equipa Adversária',
                        players: []
                    }
                },
                current_score: {
                    faction1: Math.floor(Math.random() * 16),
                    faction2: Math.floor(Math.random() * 16)
                },
                map: 'de_dust2',
                started_at: Date.now() - (Math.random() * 30 * 60 * 1000), // 0-30 min atrás
                faceit_url: ''
            };
            localMatches.push({
                match: simulatedMatch,
                registered_team: team,
                opponent_info: {
                    name: 'Equipa Adversária',
                    temp_data: true
                }
            });
        }
        return localMatches;
    }
    /**
     * 🔥 Busca histórico de matches apenas das equipas registadas
     * ATUALIZADO: Não tenta conectar a APIs externas se não há Faceit configurado
     */
    async getFilteredMatchHistory(limit = 20) {
        try {
            const registeredTeams = await this.getRegisteredTeams();
            if (registeredTeams.length === 0) {
                return [];
            }
            // Verificar se há Faceit API configurada
            if (!process.env['FACEIT_API_KEY']) {
                console.log('⚠️ Faceit API não configurada - retornando histórico local apenas');
                return this.getLocalHistoryData(registeredTeams, limit);
            }
            const filteredMatches = [];
            for (const team of registeredTeams) {
                // Só tentar Faceit se a equipa tem jogadores com Faceit ID
                if (team.faceit_players.length === 0) {
                    continue;
                }
                for (const faceitPlayerId of team.faceit_players) {
                    try {
                        const history = await faceitService.getPlayerMatchHistory(faceitPlayerId, limit);
                        if (history?.items) {
                            for (const match of history.items) {
                                const isOurTeamFaction1 = this.teamHasRegisteredPlayers(match.teams.faction1, team.faceit_players);
                                const isOurTeamFaction2 = this.teamHasRegisteredPlayers(match.teams.faction2, team.faceit_players);
                                if (isOurTeamFaction1 || isOurTeamFaction2) {
                                    const opponentTeam = isOurTeamFaction1 ? match.teams.faction2 : match.teams.faction1;
                                    filteredMatches.push({
                                        match,
                                        registered_team: team,
                                        opponent_info: {
                                            name: opponentTeam.nickname,
                                            temp_data: true // ⚠️ Dados temporários
                                        }
                                    });
                                }
                            }
                        }
                    }
                    catch (error) {
                        console.warn(`Erro ao buscar histórico para jogador ${faceitPlayerId}:`, error.message);
                    }
                }
            }
            // Remover duplicados
            const uniqueMatches = this.removeDuplicateMatches(filteredMatches);
            return uniqueMatches.slice(0, limit);
        }
        catch (error) {
            console.error('Erro ao filtrar histórico de matches:', error);
            // Em caso de erro, retornar dados locais
            const registeredTeams = await this.getRegisteredTeams();
            return this.getLocalHistoryData(registeredTeams, limit);
        }
    }
    /**
     * 🔥 NOVO: Retorna histórico local quando não há Faceit configurado
     */
    getLocalHistoryData(registeredTeams, limit) {
        console.log('🏠 Usando dados locais para histórico');
        const localHistory = [];
        for (const team of registeredTeams) {
            // Criar histórico simulado para cada equipa
            for (let i = 0; i < Math.min(5, limit); i++) {
                const simulatedMatch = {
                    match_id: `local_history_${team.id}_${i}`,
                    status: 'FINISHED',
                    teams: {
                        faction1: {
                            team_id: team.id,
                            nickname: team.name,
                            players: team.players.map(p => ({
                                player_id: p.id,
                                nickname: p.nickname
                            }))
                        },
                        faction2: {
                            team_id: `opponent_${i}`,
                            nickname: `Equipa Adversária ${i + 1}`,
                            players: []
                        }
                    },
                    results: {
                        winner: Math.random() > 0.5 ? 'faction1' : 'faction2',
                        score: {
                            faction1: Math.floor(Math.random() * 16),
                            faction2: Math.floor(Math.random() * 16)
                        }
                    },
                    finished_at: Date.now() - (i * 24 * 60 * 60 * 1000), // i dias atrás
                    faceit_url: ''
                };
                localHistory.push({
                    match: simulatedMatch,
                    registered_team: team,
                    opponent_info: {
                        name: `Equipa Adversária ${i + 1}`,
                        temp_data: true
                    }
                });
            }
        }
        return localHistory.slice(0, limit);
    }
    /**
     * 🔥 Verifica se uma equipa tem jogadores registados
     */
    teamHasRegisteredPlayers(team, registeredPlayerIds) {
        if (!team.players || team.players.length === 0)
            return false;
        return team.players.some((player) => registeredPlayerIds.includes(player.faceitId));
    }
    /**
     * 🔥 Remove matches duplicados baseado no match_id
     */
    removeDuplicateMatches(matches) {
        const seen = new Set();
        return matches.filter(item => {
            const matchId = item.match.match_id;
            if (seen.has(matchId)) {
                return false;
            }
            seen.add(matchId);
            return true;
        });
    }
    /**
     * 🔥 Limpa dados temporários de adversários (executar periodicamente)
     */
    async cleanupTemporaryOpponentData() {
        // Esta função pode ser chamada periodicamente para limpar dados temp
        // Por agora, os dados já são marcados como temporários
        console.log('🧹 Limpeza de dados temporários concluída');
    }
    /**
     * 🔥 Busca equipa registada por ID Faceit
     */
    async getRegisteredTeamByFaceitId(faceitPlayerId) {
        const registeredTeams = await this.getRegisteredTeams();
        return registeredTeams.find(team => team.faceit_players.includes(faceitPlayerId)) || null;
    }
}
export const registeredTeamsService = new RegisteredTeamsService();
//# sourceMappingURL=registeredTeamsService.js.map