interface GameData {
    id: string;
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    status: 'upcoming' | 'live' | 'finished';
    map: string;
    tournament: string;
    startTime: Date;
    endTime?: Date;
}
interface TeamStats {
    teamId: string;
    name: string;
    wins: number;
    losses: number;
    draws: number;
    totalMatches: number;
    winRate: number;
    currentStreak: number;
    lastMatches: Array<{
        opponent: string;
        result: 'W' | 'L' | 'D';
        score: string;
        date: Date;
    }>;
}
declare class GameDataService {
    private readonly CACHE_TTL;
    private readonly LIVE_GAMES_KEY;
    private readonly TEAM_STATS_KEY;
    private cache;
    private setCache;
    private getCache;
    getLiveGames(): Promise<GameData[]>;
    getTeamStats(teamId: string): Promise<TeamStats | null>;
    updateGameScore(gameId: string, score1: number, score2: number): Promise<void>;
    getSteamPlayerStats(steamId: string): Promise<any>;
    getFaceitPlayerStats(faceitId: string): Promise<any>;
    /**
     * 🔥 NOVO: Dados simulados para Steam quando não há API configurada
     */
    private getSimulatedSteamStats;
    /**
     * 🔥 NOVO: Dados simulados para Faceit quando não há API configurada
     */
    private getSimulatedFaceitStats;
    startPolling(): void;
}
export declare const gameDataService: GameDataService;
export {};
//# sourceMappingURL=gameDataService.d.ts.map