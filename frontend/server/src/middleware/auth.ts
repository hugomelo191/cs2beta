import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { CustomError } from './errorHandler.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Get user from the token
      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
      });

      if (!user) {
        throw new CustomError('User not found', 401);
      }

      if (!user.isActive) {
        throw new CustomError('User account is deactivated', 401);
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('Auth error:', error);
      throw new CustomError('Not authorized to access this route', 401);
    }
  }

  if (!token) {
    throw new CustomError('Not authorized to access this route', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new CustomError('Not authorized to access this route', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError(
        `User role ${req.user.role} is not authorized to access this route`,
        403
      );
    }

    next();
  };
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
      });

      if (user && user.isActive) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error for optional auth
      console.log('Optional auth failed:', error);
    }
  }

  next();
}; 