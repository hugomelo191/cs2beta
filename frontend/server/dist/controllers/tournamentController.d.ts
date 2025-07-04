import { Request, Response, NextFunction } from 'express';
export declare const getTournaments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTournament: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTournament: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTournament: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTournament: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFeaturedTournaments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUpcomingTournaments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getOngoingTournaments: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const registerTeamForTournament: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTournamentParticipants: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateParticipantStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTournamentsByStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=tournamentController.d.ts.map