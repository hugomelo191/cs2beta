import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../db/connection.js';
import { users, players } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { LoginSchema, RegisterSchema } from '../types/index.js';
import { faceitService } from '../services/faceitService.js';
import { getBody } from '../utils/requestHelpers.js';

// Generate JWT Token
const generateToken = (id: string) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET not configured');
  }
  const options: jwt.SignOptions = {
    expiresIn: '7d',
  };
  return jwt.sign({ id }, jwtSecret, options);
};

// @desc    Register user with mandatory player profile
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input - now includes player data
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

    // Check if nickname is already taken
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.nickname, validatedData.nickname),
    });

    if (existingPlayer) {
      throw new CustomError('Player nickname already taken', 400);
    }

    // Validate Faceit nickname and get data
    let faceitData = null;
    try {
      faceitData = await faceitService.getCompletePlayerData(validatedData.faceitNickname);
      if (!faceitData) {
        throw new CustomError('Nickname do Faceit não encontrado. Verifica se está correto.', 400);
      }
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        throw error;
      }
      console.warn('⚠️ Erro ao buscar dados Faceit, continuando sem dados:', error.message);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create user and player in transaction
    const [newUser] = await db.insert(users).values({
      email: validatedData.email,
      username: validatedData.username,
      password: hashedPassword,
      firstName: validatedData.firstName || null,
      lastName: validatedData.lastName || null,
      country: faceitData?.country || validatedData.country,
    } as any).returning();

    if (!newUser) {
      throw new CustomError('Failed to create user', 500);
    }

    // Create mandatory player profile with Faceit data
    const [newPlayer] = await db.insert(players).values({
      userId: newUser.id,
      nickname: validatedData.nickname,
      realName: validatedData.realName || `${validatedData.firstName || ''} ${validatedData.lastName || ''}`.trim() || null,
      country: faceitData?.country || validatedData.country,
      age: validatedData.age || null,
      position: validatedData.position || null,
      bio: validatedData.bio || null,
      // Faceit integration
      faceitNickname: faceitData?.faceit_nickname || validatedData.faceitNickname,
      faceitId: faceitData?.faceit_id || null,
      faceitElo: faceitData?.faceit_elo || null,
      faceitLevel: faceitData?.faceit_level || null,
      steamId: faceitData?.steam_id || null,
      faceitUrl: faceitData?.faceit_url || null,
      faceitStatsUpdatedAt: faceitData ? new Date() : null,
      // Stats from Faceit
      stats: faceitData?.stats || {
        kd: 0,
        adr: 0,
        maps_played: 0,
        wins: 0,
        losses: 0,
        views: 0,
      },
      achievements: [],
      socials: {
        ...validatedData.socials,
        faceit: faceitData?.faceit_url,
        steam: faceitData?.steam_url,
      },
      avatar: faceitData?.avatar || null,
    } as any).returning();

    // Generate token
    const token = generateToken(newUser.id);

    // Remove password from response
    const { password, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: 'User and player profile registered successfully',
      data: {
        user: userWithoutPassword,
        player: newPlayer,
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
      .set({ lastLogin: new Date() } as any)
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

// @desc    Get current user with player profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id),
      with: {
        players: {
          with: {
            team: true
          }
        }
      }
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile (basic info only)
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
      } as any)
      .where(eq(users.id, req.user!.id))
      .returning();

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: userWithoutPassword,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await db.query.users.findFirst({
      where: eq(users.id, req.user!.id),
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
      } as any)
      .where(eq(users.id, req.user!.id));

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user (client-side token removal)
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