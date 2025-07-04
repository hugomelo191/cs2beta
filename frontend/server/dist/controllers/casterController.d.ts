import { Request, Response, NextFunction } from 'express';
export declare const getCasters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createCaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateCaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteCaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLiveCasters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCastersByType: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getTopRatedCasters: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateLiveStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const rateCaster: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCastersByCountry: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getCastersBySpecialty: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=casterController.d.ts.map