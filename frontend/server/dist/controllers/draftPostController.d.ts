import { Request, Response } from 'express';
interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
        username: string;
        role: string;
        isActive: boolean;
    };
}
export declare const createDraftPost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDraftPosts: (req: Request, res: Response) => Promise<void>;
export declare const getDraftPost: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const deleteDraftPost: (req: AuthRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getDraftPostStats: (req: Request, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=draftPostController.d.ts.map