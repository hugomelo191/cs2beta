import { Request } from 'express';
export declare const getParam: (req: Request, key: string) => string;
export declare const getQuery: (req: Request, key: string) => string | undefined;
export declare const getQueryInt: (req: Request, key: string, defaultValue?: number) => number;
export declare const getBody: <T>(req: Request) => T;
//# sourceMappingURL=requestHelpers.d.ts.map