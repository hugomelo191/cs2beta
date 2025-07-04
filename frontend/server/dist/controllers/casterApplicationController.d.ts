import { Request, Response, NextFunction } from 'express';
export declare const createApplication: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getApplications: (req: Request, res: Response) => Promise<void>;
export declare const getApplication: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const reviewApplication: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export declare const getApplicationStats: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=casterApplicationController.d.ts.map