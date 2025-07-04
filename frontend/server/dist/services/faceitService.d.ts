export interface FaceitPlayerData {
    player_id: string;
    nickname: string;
    steam_id_64: string;
    steam_nickname: string;
    avatar: string;
    country: string;
    skill_level: number;
    faceit_elo: number;
    faceit_url: string;
    memberships: any[];
    games: {
        cs2?: {
            region: string;
            game_player_id: string;
            skill_level: number;
            faceit_elo: number;
            game_player_name: string;
            skill_level_label: string;
            regions: any;
            game_profile_id: string;
        };
    };
}
export interface FaceitPlayerStats {
    player_id: string;
    game_id: string;
    lifetime: {
        'Total Headshots %': string;
        'Longest Win Streak': string;
        'Win Rate %': string;
        'Recent Results': string[];
        'K/D Ratio': string;
        'Current Win Streak': string;
        'Average K/D Ratio': string;
        'Average Headshots %': string;
        'Matches': string;
        'Wins': string;
    };
}
export interface FaceitMatch {
    match_id: string;
    version: number;
    game: string;
    region: string;
    competition_id: string;
    competition_name: string;
    competition_type: string;
    organizer_id: string;
    teams: {
        faction1: FaceitTeam;
        faction2: FaceitTeam;
    };
    voting: any;
    calculate_elo: boolean;
    configured_at: number;
    started_at: number;
    finished_at: number;
    demo_url: string[];
    chat_room_id: string;
    best_of: number;
    results: {
        winner: string;
        score: {
            faction1: number;
            faction2: number;
        };
    };
    status: string;
    faceit_url: string;
}
export interface FaceitTeam {
    team_id: string;
    nickname: string;
    avatar: string;
    type: string;
    players: FaceitTeamPlayer[];
}
export interface FaceitTeamPlayer {
    player_id: string;
    nickname: string;
    avatar: string;
    skill_level: number;
    game_player_id: string;
    game_player_name: string;
    faceit_url: string;
}
export interface FaceitPlayerHistory {
    items: FaceitMatch[];
    start: number;
    end: number;
}
export interface FaceitLiveMatch {
    match_id: string;
    status: string;
    teams: {
        faction1: FaceitTeam;
        faction2: FaceitTeam;
    };
    current_score: {
        faction1: number;
        faction2: number;
    };
    map: string;
    started_at: number;
    faceit_url: string;
}
declare class FaceitService {
    private apiKey;
    constructor();
    /**
     * Busca dados básicos do jogador pelo nickname
     */
    getPlayerByNickname(nickname: string): Promise<FaceitPlayerData | null>;
    /**
     * Busca estatísticas detalhadas do jogador
     */
    getPlayerStats(playerId: string, gameId?: string): Promise<FaceitPlayerStats | null>;
    /**
     * 🔥 NOVO: Busca histórico de matches do jogador
     */
    getPlayerMatchHistory(playerId: string, limit?: number, offset?: number): Promise<FaceitPlayerHistory | null>;
    /**
     * 🔥 NOVO: Busca detalhes de um match específico
     */
    getMatchDetails(matchId: string): Promise<FaceitMatch | null>;
    /**
     * 🔥 NOVO: Busca stats detalhadas de um match
     */
    getMatchStats(matchId: string): Promise<any | null>;
    /**
     * 🔥 NOVO: Busca matches ao vivo do jogador
     */
    getPlayerLiveMatches(playerId: string): Promise<FaceitLiveMatch[]>;
    /**
     * 🔥 NOVO: Busca matches populares ao vivo
     */
    getPopularLiveMatches(): Promise<FaceitLiveMatch[]>;
    /**
     * 🔥 NOVO: Dados simulados para quando não há API configurada
     */
    private getSimulatedPlayerData;
    private getSimulatedPlayerStats;
    private getSimulatedMatchHistory;
    private getSimulatedLiveMatches;
    private getSimulatedPopularLiveMatches;
    /**
     * Verifica se um nickname existe no Faceit
     */
    validateNickname(nickname: string): Promise<boolean>;
    /**
     * Converte dados do Faceit para formato interno
     */
    convertFaceitToPlayerStats(faceitData: FaceitPlayerData, faceitStats?: FaceitPlayerStats): {
        faceit_id: string;
        faceit_nickname: string;
        faceit_elo: number;
        faceit_level: number;
        steam_id: string;
        avatar: string;
        country: string;
        stats: {
            kd: number;
            avg_kd: number;
            headshot_percentage: number;
            win_rate: number;
            matches_played: number;
            wins: number;
            current_win_streak: number;
            longest_win_streak: number;
        };
        faceit_url: string;
        steam_url: string;
    };
    /**
     * Busca dados completos do jogador (perfil + stats)
     */
    getCompletePlayerData(nickname: string): Promise<{
        faceit_id: string;
        faceit_nickname: string;
        faceit_elo: number;
        faceit_level: number;
        steam_id: string;
        avatar: string;
        country: string;
        stats: {
            kd: number;
            avg_kd: number;
            headshot_percentage: number;
            win_rate: number;
            matches_played: number;
            wins: number;
            current_win_streak: number;
            longest_win_streak: number;
        };
        faceit_url: string;
        steam_url: string;
    }>;
    /**
     * 🔥 NOVO: Busca dados completos + histórico de matches
     */
    getCompletePlayerDataWithHistory(nickname: string, matchLimit?: number): Promise<{
        match_history: FaceitMatch[];
        live_matches: FaceitLiveMatch[];
        faceit_id: string;
        faceit_nickname: string;
        faceit_elo: number;
        faceit_level: number;
        steam_id: string;
        avatar: string;
        country: string;
        stats: {
            kd: number;
            avg_kd: number;
            headshot_percentage: number;
            win_rate: number;
            matches_played: number;
            wins: number;
            current_win_streak: number;
            longest_win_streak: number;
        };
        faceit_url: string;
        steam_url: string;
    }>;
}
export declare const faceitService: FaceitService;
export {};
//# sourceMappingURL=faceitService.d.ts.map