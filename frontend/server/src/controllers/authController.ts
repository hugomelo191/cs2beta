import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { LoginSchema, RegisterSchema } from '../types/index.js';

// Generate JWT Token
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (existingUser) {
      throw new CustomError('User already exists with this email', 400);
    }

    const existingUsername = await db.query.users.findFirst({
      where: eq(users.username, validatedData.username),
    });

    if (existingUsername) {
      throw new CustomError('Username already taken', 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user
    const [newUser] = await db.insert(users).values({
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      country: validatedData.country,
    }).returning();

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = LoginSchema.parse(req.body);

    // Check for user
    const user = await db.query.users.findFirst({
      where: eq(users.email, validatedData.email),
    });

    if (!user) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new CustomError('Account is deactivated', 401);
    }

    // Check password
    const isMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!isMatch) {
      throw new CustomError('Invalid credentials', 401);
    }

    // Update last login
    await db.update(users)
      .set({ lastLogin: new Date() })
      .where(eq(users.id, user.id));

    // Generate token
    const token = generateToken(user.id);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, (req as any).user.id),
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { firstName, lastName, avatar, bio, country } = req.body;

    // Update user
    const [updatedUser] = await db.update(users)
      .set({
        firstName,
        lastName,
        avatar,
        bio,
        country,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new CustomError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new CustomError('Please provide current and new password', 400);
    }

    // Get user
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      throw new CustomError('Current password is incorrect', 400);
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    next(error);
  }
}; 