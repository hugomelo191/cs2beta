import axios from 'axios';
const FACEIT_API_BASE = 'https://open.faceit.com/data/v4';
const FACEIT_API_KEY = process.env['FACEIT_API_KEY']; // Será configurado no .env
class FaceitService {
    apiKey;
    constructor() {
        this.apiKey = FACEIT_API_KEY || '';
        if (!this.apiKey) {
            console.warn('⚠️ FACEIT_API_KEY não configurada. Funcionalidades Faceit desabilitadas.');
        }
    }
    /**
     * Busca dados básicos do jogador pelo nickname
     */
    async getPlayerByNickname(nickname) {
        if (!this.apiKey) {
            console.log('⚠️ Faceit API não configurada - retornando dados simulados');
            return this.getSimulatedPlayerData(nickname);
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/players?nickname=${encodeURIComponent(nickname)}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000, // 10 segundos
            });
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return null; // Jogador não encontrado
            }
            console.error('Erro ao buscar jogador Faceit:', error.message);
            // Em caso de erro, retornar dados simulados
            return this.getSimulatedPlayerData(nickname);
        }
    }
    /**
     * Busca estatísticas detalhadas do jogador
     */
    async getPlayerStats(playerId, gameId = 'cs2') {
        if (!this.apiKey) {
            console.log('⚠️ Faceit API não configurada - retornando stats simulados');
            return this.getSimulatedPlayerStats(playerId);
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/players/${playerId}/stats/${gameId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            if (error.response?.status === 404) {
                return null;
            }
            console.error('Erro ao buscar stats Faceit:', error.message);
            // Em caso de erro, retornar dados simulados
            return this.getSimulatedPlayerStats(playerId);
        }
    }
    /**
     * 🔥 NOVO: Busca histórico de matches do jogador
     */
    async getPlayerMatchHistory(playerId, limit = 20, offset = 0) {
        if (!this.apiKey) {
            console.log('⚠️ Faceit API não configurada - retornando histórico simulado');
            return this.getSimulatedMatchHistory(playerId, limit);
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/players/${playerId}/history?game=cs2&offset=${offset}&limit=${limit}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 15000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar histórico Faceit:', error.message);
            // Em caso de erro, retornar dados simulados
            return this.getSimulatedMatchHistory(playerId, limit);
        }
    }
    /**
     * 🔥 NOVO: Busca detalhes de um match específico
     */
    async getMatchDetails(matchId) {
        if (!this.apiKey) {
            throw new Error('Faceit API key não configurada');
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/matches/${matchId}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar match Faceit:', error.message);
            return null;
        }
    }
    /**
     * 🔥 NOVO: Busca stats detalhadas de um match
     */
    async getMatchStats(matchId) {
        if (!this.apiKey) {
            throw new Error('Faceit API key não configurada');
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/matches/${matchId}/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar stats do match:', error.message);
            return null;
        }
    }
    /**
     * 🔥 NOVO: Busca matches ao vivo do jogador
     */
    async getPlayerLiveMatches(playerId) {
        if (!this.apiKey) {
            console.log('⚠️ Faceit API não configurada - retornando matches simulados');
            return this.getSimulatedLiveMatches(playerId);
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/players/${playerId}/matches?game=cs2&status=ONGOING`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data.items || [];
        }
        catch (error) {
            console.error('Erro ao buscar matches ao vivo Faceit:', error.message);
            // Em caso de erro, retornar dados simulados
            return this.getSimulatedLiveMatches(playerId);
        }
    }
    /**
     * 🔥 NOVO: Busca matches populares ao vivo
     */
    async getPopularLiveMatches() {
        if (!this.apiKey) {
            console.log('⚠️ Faceit API não configurada - retornando matches populares simulados');
            return this.getSimulatedPopularLiveMatches();
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/matches?game=cs2&status=ONGOING&sort=started_at&order=desc&limit=20`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data.items || [];
        }
        catch (error) {
            console.error('Erro ao buscar matches populares Faceit:', error.message);
            // Em caso de erro, retornar dados simulados
            return this.getSimulatedPopularLiveMatches();
        }
    }
    /**
     * 🔥 NOVO: Dados simulados para quando não há API configurada
     */
    getSimulatedPlayerData(nickname) {
        return {
            player_id: `sim_${nickname}_${Date.now()}`,
            nickname: nickname,
            steam_id_64: '76561198000000000',
            steam_nickname: nickname,
            avatar: 'https://via.placeholder.com/150',
            country: 'PT',
            skill_level: Math.floor(Math.random() * 10) + 1,
            faceit_elo: Math.floor(Math.random() * 2000) + 1000,
            faceit_url: `https://faceit.com/pt/players/${nickname}`,
            memberships: [],
            games: {
                cs2: {
                    region: 'EU',
                    game_player_id: `sim_${nickname}`,
                    skill_level: Math.floor(Math.random() * 10) + 1,
                    faceit_elo: Math.floor(Math.random() * 2000) + 1000,
                    game_player_name: nickname,
                    skill_level_label: 'Level 5',
                    regions: {},
                    game_profile_id: `sim_${nickname}`
                }
            }
        };
    }
    getSimulatedPlayerStats(playerId) {
        return {
            player_id: playerId,
            game_id: 'cs2',
            lifetime: {
                'Total Headshots %': '45%',
                'Longest Win Streak': '8',
                'Win Rate %': '65%',
                'Recent Results': ['W', 'W', 'L', 'W', 'W'],
                'K/D Ratio': '1.2',
                'Current Win Streak': '3',
                'Average K/D Ratio': '1.15',
                'Average Headshots %': '42%',
                'Matches': '150',
                'Wins': '98'
            }
        };
    }
    getSimulatedMatchHistory(playerId, limit) {
        const items = [];
        for (let i = 0; i < Math.min(limit, 10); i++) {
            items.push({
                match_id: `sim_match_${playerId}_${i}`,
                version: 1,
                game: 'cs2',
                region: 'EU',
                competition_id: 'sim_comp',
                competition_name: 'Simulated League',
                competition_type: 'league',
                organizer_id: 'sim_org',
                teams: {
                    faction1: {
                        team_id: 'sim_team_1',
                        nickname: 'Simulated Team 1',
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    },
                    faction2: {
                        team_id: 'sim_team_2',
                        nickname: 'Simulated Team 2',
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    }
                },
                voting: {},
                calculate_elo: true,
                configured_at: Date.now() - (i * 24 * 60 * 60 * 1000),
                started_at: Date.now() - (i * 24 * 60 * 60 * 1000),
                finished_at: Date.now() - (i * 24 * 60 * 60 * 1000) + (60 * 60 * 1000),
                demo_url: [],
                chat_room_id: 'sim_chat',
                best_of: 1,
                results: {
                    winner: Math.random() > 0.5 ? 'faction1' : 'faction2',
                    score: {
                        faction1: Math.floor(Math.random() * 16),
                        faction2: Math.floor(Math.random() * 16)
                    }
                },
                status: 'FINISHED',
                faceit_url: 'https://faceit.com/pt/matches/simulated'
            });
        }
        return {
            items,
            start: 0,
            end: items.length
        };
    }
    getSimulatedLiveMatches(playerId) {
        return [{
                match_id: `sim_live_${playerId}_${Date.now()}`,
                status: 'ONGOING',
                teams: {
                    faction1: {
                        team_id: 'sim_team_1',
                        nickname: 'Simulated Team 1',
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    },
                    faction2: {
                        team_id: 'sim_team_2',
                        nickname: 'Simulated Team 2',
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    }
                },
                current_score: {
                    faction1: Math.floor(Math.random() * 16),
                    faction2: Math.floor(Math.random() * 16)
                },
                map: 'de_dust2',
                started_at: Date.now() - (30 * 60 * 1000),
                faceit_url: 'https://faceit.com/pt/matches/simulated_live'
            }];
    }
    getSimulatedPopularLiveMatches() {
        const matches = [];
        for (let i = 0; i < 5; i++) {
            matches.push({
                match_id: `sim_popular_${i}_${Date.now()}`,
                status: 'ONGOING',
                teams: {
                    faction1: {
                        team_id: `sim_pop_team_1_${i}`,
                        nickname: `Popular Team 1 ${i + 1}`,
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    },
                    faction2: {
                        team_id: `sim_pop_team_2_${i}`,
                        nickname: `Popular Team 2 ${i + 1}`,
                        avatar: 'https://via.placeholder.com/150',
                        type: 'team',
                        players: []
                    }
                },
                current_score: {
                    faction1: Math.floor(Math.random() * 16),
                    faction2: Math.floor(Math.random() * 16)
                },
                map: ['de_dust2', 'de_mirage', 'de_inferno', 'de_overpass', 'de_nuke'][i % 5],
                started_at: Date.now() - (Math.random() * 60 * 60 * 1000),
                faceit_url: `https://faceit.com/pt/matches/simulated_popular_${i}`
            });
        }
        return matches;
    }
    /**
     * Verifica se um nickname existe no Faceit
     */
    async validateNickname(nickname) {
        try {
            const player = await this.getPlayerByNickname(nickname);
            return player !== null;
        }
        catch (error) {
            return false;
        }
    }
    /**
     * Converte dados do Faceit para formato interno
     */
    convertFaceitToPlayerStats(faceitData, faceitStats) {
        const cs2Data = faceitData.games.cs2;
        return {
            // Dados básicos
            faceit_id: faceitData.player_id,
            faceit_nickname: faceitData.nickname,
            faceit_elo: cs2Data?.faceit_elo || 0,
            faceit_level: cs2Data?.skill_level || 0,
            steam_id: faceitData.steam_id_64,
            // Avatar do Faceit se não tiver outro
            avatar: faceitData.avatar,
            // País do Faceit se não especificado
            country: faceitData.country.toLowerCase(),
            // Stats do jogo
            stats: {
                kd: faceitStats?.lifetime['K/D Ratio'] ? parseFloat(faceitStats.lifetime['K/D Ratio']) : 0,
                avg_kd: faceitStats?.lifetime['Average K/D Ratio'] ? parseFloat(faceitStats.lifetime['Average K/D Ratio']) : 0,
                headshot_percentage: faceitStats?.lifetime['Total Headshots %'] ? parseFloat(faceitStats.lifetime['Total Headshots %']) : 0,
                win_rate: faceitStats?.lifetime['Win Rate %'] ? parseFloat(faceitStats.lifetime['Win Rate %']) : 0,
                matches_played: faceitStats?.lifetime['Matches'] ? parseInt(faceitStats.lifetime['Matches']) : 0,
                wins: faceitStats?.lifetime['Wins'] ? parseInt(faceitStats.lifetime['Wins']) : 0,
                current_win_streak: faceitStats?.lifetime['Current Win Streak'] ? parseInt(faceitStats.lifetime['Current Win Streak']) : 0,
                longest_win_streak: faceitStats?.lifetime['Longest Win Streak'] ? parseInt(faceitStats.lifetime['Longest Win Streak']) : 0,
            },
            // URLs úteis
            faceit_url: faceitData.faceit_url,
            steam_url: `https://steamcommunity.com/profiles/${faceitData.steam_id_64}`,
        };
    }
    /**
     * Busca dados completos do jogador (perfil + stats)
     */
    async getCompletePlayerData(nickname) {
        try {
            // 1. Buscar dados básicos
            const playerData = await this.getPlayerByNickname(nickname);
            if (!playerData) {
                return null;
            }
            // 2. Buscar estatísticas se tiver CS2
            let playerStats = null;
            if (playerData.games.cs2) {
                playerStats = await this.getPlayerStats(playerData.player_id, 'cs2');
            }
            // 3. Converter para formato interno
            return this.convertFaceitToPlayerStats(playerData, playerStats || undefined);
        }
        catch (error) {
            console.error('Erro ao buscar dados completos Faceit:', error);
            throw error;
        }
    }
    /**
     * 🔥 NOVO: Busca dados completos + histórico de matches
     */
    async getCompletePlayerDataWithHistory(nickname, matchLimit = 10) {
        try {
            const playerData = await this.getCompletePlayerData(nickname);
            if (!playerData) {
                return null;
            }
            // Buscar histórico de matches
            const history = await this.getPlayerMatchHistory(playerData.faceit_id, matchLimit);
            return {
                ...playerData,
                match_history: history?.items || [],
                live_matches: await this.getPlayerLiveMatches(playerData.faceit_id),
            };
        }
        catch (error) {
            console.error('Erro ao buscar dados completos com histórico:', error);
            throw error;
        }
    }
}
export const faceitService = new FaceitService();
//# sourceMappingURL=faceitService.js.map