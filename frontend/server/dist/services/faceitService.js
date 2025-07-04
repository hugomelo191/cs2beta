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
            throw new Error('Faceit API key não configurada');
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
            throw new Error('Erro ao conectar com Faceit');
        }
    }
    /**
     * Busca estatísticas detalhadas do jogador
     */
    async getPlayerStats(playerId, gameId = 'cs2') {
        if (!this.apiKey) {
            throw new Error('Faceit API key não configurada');
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
            throw new Error('Erro ao buscar estatísticas Faceit');
        }
    }
    /**
     * 🔥 NOVO: Busca histórico de matches do jogador
     */
    async getPlayerMatchHistory(playerId, limit = 20, offset = 0) {
        if (!this.apiKey) {
            throw new Error('Faceit API key não configurada');
        }
        try {
            const response = await axios.get(`${FACEIT_API_BASE}/players/${playerId}/history?game=cs2&limit=${limit}&offset=${offset}`, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json',
                },
                timeout: 10000,
            });
            return response.data;
        }
        catch (error) {
            console.error('Erro ao buscar histórico Faceit:', error.message);
            return null;
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
     * 🔥 NOVO: Busca matches em direto de um jogador
     */
    async getPlayerLiveMatches(playerId) {
        if (!this.apiKey) {
            return [];
        }
        try {
            // Buscar matches recentes e filtrar os que estão em andamento
            const history = await this.getPlayerMatchHistory(playerId, 10);
            if (!history)
                return [];
            const liveMatches = [];
            for (const match of history.items) {
                if (match.status === 'ONGOING') {
                    const matchDetails = await this.getMatchDetails(match.match_id);
                    if (matchDetails) {
                        liveMatches.push({
                            match_id: matchDetails.match_id,
                            status: matchDetails.status,
                            teams: matchDetails.teams,
                            current_score: matchDetails.results?.score || { faction1: 0, faction2: 0 },
                            map: 'TBD', // TODO: Extrair do voting ou match details
                            started_at: matchDetails.started_at,
                            faceit_url: matchDetails.faceit_url,
                        });
                    }
                }
            }
            return liveMatches;
        }
        catch (error) {
            console.error('Erro ao buscar matches em direto:', error);
            return [];
        }
    }
    /**
     * 🔥 NOVO: Busca matches populares em direto
     */
    async getPopularLiveMatches() {
        // Implementar quando tivermos lista de jogadores populares
        // Por agora retorna array vazio
        return [];
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