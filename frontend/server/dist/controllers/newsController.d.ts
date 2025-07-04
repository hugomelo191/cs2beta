import { Request, Response, NextFunction } from 'express';
export declare const getNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNewsArticle: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getFeaturedNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNewsByCategory: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getNewsByAuthor: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getMostViewedNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getLatestNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const publishNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const unpublishNews: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=newsController.d.ts.map