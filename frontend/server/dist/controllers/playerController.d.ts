import { Request, Response, NextFunction } from 'express';
export declare const getPlayers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createPlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deletePlayer: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFeaturedPlayers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPlayersByTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePlayerStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPlayersByPosition: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getPlayerHistory: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getPlayerLiveMatches: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const syncPlayerFaceit: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=playerController.d.ts.map