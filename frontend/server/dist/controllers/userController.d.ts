import { Request, Response, NextFunction } from 'express';
export declare const getAllUsers: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserProfile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminUpdateUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const adminChangePassword: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUserStats: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const toggleUserStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getUsersByRole: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=userController.d.ts.map