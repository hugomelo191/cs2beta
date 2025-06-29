import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export class CustomError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface AppError {
  statusCode?: number;
  isOperational?: boolean;
  message: string;
  name: string;
  stack?: string;
}

export const errorHandler = (
  err: AppError | ZodError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error: AppError;

  if (err instanceof ZodError) {
    // Zod validation error
    const message = err.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
    error = {
      message,
      name: 'ValidationError',
      statusCode: 400
    };
  } else if (err instanceof CustomError) {
    // Custom error
    error = {
      message: err.message,
      name: err.name,
      statusCode: err.statusCode,
      isOperational: err.isOperational
    };
  } else {
    // Generic error
    error = {
      message: err.message || 'Server Error',
      name: err.name || 'Error',
      statusCode: err.statusCode || 500
    };
  }

  console.error('Error:', {
    message: error.message,
    statusCode: error.statusCode,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get?.('User-Agent'),
  });

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    }),
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction): void => {
  const error = new CustomError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next); 