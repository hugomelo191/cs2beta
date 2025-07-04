import { Request, Response, NextFunction } from 'express';
export declare const getDrafts: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDraft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createDraft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateDraft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteDraft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const applyToDraft: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDraftApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateApplicationStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMyApplications: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDraftsByStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getDraftsByCountry: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=draftController.d.ts.map