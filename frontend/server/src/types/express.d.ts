import { Request as ExpressRequest } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        username: string;
        role: string;
        isActive: boolean;
      };
    }
  }
}

declare module 'express-slow-down' {
  import { RequestHandler } from 'express';
  
  interface SlowDownOptions {
    windowMs?: number;
    delayAfter?: number;
    delayMs?: number;
    maxDelayMs?: number;
    skipFailedRequests?: boolean;
    skipSuccessfulRequests?: boolean;
    keyGenerator?: (req: any) => string;
    skip?: (req: any, res: any) => boolean;
    onLimitReached?: (req: any, res: any, options: any) => void;
  }
  
  function slowDown(options?: SlowDownOptions): RequestHandler;
  export = slowDown;
}

// Re-export Express types properly
declare module 'express' {
  import * as core from 'express-serve-static-core';
  
  export interface Request extends core.Request {}
  export interface Response extends core.Response {}
  export interface NextFunction extends core.NextFunction {}
  export interface Router extends core.Router {}
  export interface Application extends core.Application {}
  
  function express(): Application;
  namespace express {
    export function json(options?: any): RequestHandler;
    export function urlencoded(options?: any): RequestHandler;
    export function Router(options?: any): Router;
  }
  export = express;
} 