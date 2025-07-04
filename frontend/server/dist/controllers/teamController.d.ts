import { Request, Response, NextFunction } from 'express';
export declare const getTeams: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteTeam: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTeamMembers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const addTeamMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const removeTeamMember: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFeaturedTeams: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createTeamWithUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserTeamInvitations: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=teamController.d.ts.map