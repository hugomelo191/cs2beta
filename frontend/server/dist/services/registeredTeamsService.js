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
     */
    async getFilteredLiveMatches() {
        try {
            const registeredTeams = await this.getRegisteredTeams();
            const filteredMatches = [];
            // Buscar matches ao vivo para cada equipa registada
            for (const team of registeredTeams) {
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
            return [];
        }
    }
    /**
     * 🔥 Busca histórico de matches apenas das equipas registadas
     */
    async getFilteredMatchHistory(limit = 20) {
        try {
            const registeredTeams = await this.getRegisteredTeams();
            const filteredMatches = [];
            for (const team of registeredTeams) {
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
            const uniqueMatches = this.removeDuplicateMatches(filteredMatches);
            console.log(`📚 Encontrados ${uniqueMatches.length} matches históricos filtrados`);
            return uniqueMatches;
        }
        catch (error) {
            console.error('Erro ao filtrar histórico de matches:', error);
            return [];
        }
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