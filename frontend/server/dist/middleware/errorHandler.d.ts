import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
export declare class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode: number);
}
export interface AppError {
    statusCode?: number;
    isOperational?: boolean;
    message: string;
    name: string;
    stack?: string;
}
export declare const errorHandler: (err: AppError | ZodError | CustomError, req: Request, res: Response, next: NextFunction) => void;
export declare const notFound: (req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => Promise<any>;
//# sourceMappingURL=errorHandler.d.ts.map