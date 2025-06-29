import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { CustomError } from './errorHandler.js';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers?.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        throw new CustomError('No token provided', 401);
      }

      // Verify token
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new CustomError('JWT_SECRET not configured', 500);
      }

      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload & { id: string };

      if (!decoded.id) {
        throw new CustomError('Invalid token payload', 401);
      }

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

      req.user = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role || 'user',
        isActive: user.isActive
      };
      next();
    } catch (error) {
      console.error('Auth error:', error);
      throw new CustomError('Not authorized to access this route', 401);
    }
  } else {
    throw new CustomError('Not authorized to access this route', 401);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
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

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers?.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      if (!token) {
        return next();
      }

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.log('JWT_SECRET not configured for optional auth');
        return next();
      }

      const decoded = jwt.verify(token, jwtSecret) as jwt.JwtPayload & { id: string };

      if (!decoded.id) {
        return next();
      }

      const user = await db.query.users.findFirst({
        where: eq(users.id, decoded.id),
      });

      if (user && user.isActive) {
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role || 'user',
          isActive: user.isActive
        };
      }
    } catch (error) {
      // Token is invalid, but we don't throw an error for optional auth
      console.log('Optional auth failed:', error);
    }
  }

  next();
}; 