import { Request, Response } from 'express';
export declare const gameController: {
    getLiveGames(req: Request, res: Response): Promise<void>;
    getTeamStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateGameScore(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getSteamPlayerStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getFaceitPlayerStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * 🔥 ATUALIZADO: Matches em direto APENAS de equipas registadas
     */
    getLiveMatches(req: Request, res: Response): Promise<void>;
    /**
     * 🔥 NOVO: Histórico de matches das equipas registadas
     */
    getRegisteredTeamsHistory(req: Request, res: Response): Promise<void>;
    /**
     * 🔥 NOVO: Lista de equipas registadas no site
     */
    getRegisteredTeams(req: Request, res: Response): Promise<void>;
    /**
     * 🔥 NOVO: Stats de uma equipa registada específica
     */
    getRegisteredTeamStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * 🔥 NOVO: Detalhes de um match específico
     */
    getMatchDetails(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * 🔥 NOVO: Stats de um match finalizado
     */
    getMatchStats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * 🔥 NOVO: Rankings portugueses do CS2
     */
    getPortugueseRankings(req: Request, res: Response): Promise<void>;
    /**
     * 🔥 NOVO: Matches recentes finalizados
     */
    getRecentMatches(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=gameController.d.ts.map