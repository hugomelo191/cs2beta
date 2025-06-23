import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { users, teams, players } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateUserSchema, UpdateUserSchema } from '../types/index.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Moderator)
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;
    const country = req.query.country as string;
    const isVerified = req.query.isVerified as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(users.username, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`)
        )
      );
    }
    
    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    if (country) {
      whereConditions.push(eq(users.country, country));
    }

    if (isVerified !== undefined) {
      whereConditions.push(eq(users.isVerified, isVerified === 'true'));
    }

    // Get users with pagination
    const usersList = await db.query.users.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      columns: {
        password: false, // Exclude password from response
      },
      orderBy: sortOrder === 'desc' ? desc(users[sortBy as keyof typeof users]) : asc(users[sortBy as keyof typeof users]),
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: users.id })
      .from(users)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: usersList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Users can only access their own profile unless they're admin/moderator
    if (currentUser.id !== id && !['admin', 'moderator'].includes(currentUser.role)) {
      throw new CustomError('Access denied', 403);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false, // Exclude password
      },
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
          }
        },
        players: {
          columns: {
            id: true,
            nickname: true,
            position: true,
            teamId: true,
          }
        }
      }
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    // Validate input
    const validatedData = UpdateUserSchema.parse(req.body);

    // Users can only update their own profile unless they're admin
    if (currentUser.id !== id && currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Check if new email conflicts with existing user
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailConflict = await db.query.users.findFirst({
        where: eq(users.email, validatedData.email),
      });

      if (emailConflict) {
        throw new CustomError('Email already exists', 400);
      }
    }

    // Check if new username conflicts with existing user
    if (validatedData.username && validatedData.username !== existingUser.username) {
      const usernameConflict = await db.query.users.findFirst({
        where: eq(users.username, validatedData.username),
      });

      if (usernameConflict) {
        throw new CustomError('Username already exists', 400);
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user
    const [updatedUser] = await db.update(users)
      .set({
        ...validatedData,
        password: hashedPassword || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        country: users.country,
        bio: users.bio,
        avatar: users.avatar,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Only admins can delete users
    if (currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Prevent deleting admin users
    if (existingUser.role === 'admin') {
      throw new CustomError('Cannot delete admin users', 400);
    }

    // Check if user has associated data
    const userPlayers = await db.query.players.findMany({
      where: eq(players.userId, id),
    });

    if (userPlayers.length > 0) {
      throw new CustomError('Cannot delete user with associated players', 400);
    }

    // Delete user
    await db.delete(users).where(eq(users.id, id));

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = (req as any).user;

    const userProfile = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
      columns: {
        password: false, // Exclude password
      },
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
            country: true,
          }
        },
        players: {
          columns: {
            id: true,
            nickname: true,
            position: true,
            teamId: true,
            stats: true,
          }
        }
      }
    });

    if (!userProfile) {
      throw new CustomError('User profile not found', 404);
    }

    res.json({
      success: true,
      data: userProfile,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = (req as any).user;
    
    // Validate input (exclude role and isVerified from profile updates)
    const { role, isVerified, ...profileData } = req.body;
    const validatedData = UpdateUserSchema.partial().parse(profileData);

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Check if new email conflicts with existing user
    if (validatedData.email && validatedData.email !== existingUser.email) {
      const emailConflict = await db.query.users.findFirst({
        where: eq(users.email, validatedData.email),
      });

      if (emailConflict) {
        throw new CustomError('Email already exists', 400);
      }
    }

    // Check if new username conflicts with existing user
    if (validatedData.username && validatedData.username !== existingUser.username) {
      const usernameConflict = await db.query.users.findFirst({
        where: eq(users.username, validatedData.username),
      });

      if (usernameConflict) {
        throw new CustomError('Username already exists', 400);
      }
    }

    // Hash password if provided
    let hashedPassword;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user profile
    const [updatedUser] = await db.update(users)
      .set({
        ...validatedData,
        password: hashedPassword || undefined,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        role: users.role,
        country: users.country,
        bio: users.bio,
        avatar: users.avatar,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change user password
// @route   PUT /api/users/password
// @access  Private
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new CustomError('Current password and new password are required', 400);
    }

    // Get user with password
    const user = await db.query.users.findFirst({
      where: eq(users.id, currentUser.id),
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, currentUser.id));

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:id/stats
// @access  Private
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Users can only access their own stats unless they're admin/moderator
    if (currentUser.id !== id && !['admin', 'moderator'].includes(currentUser.role)) {
      throw new CustomError('Access denied', 403);
    }

    // Get user's players
    const userPlayers = await db.query.players.findMany({
      where: eq(players.userId, id),
      columns: {
        stats: true,
        achievements: true,
      }
    });

    // Calculate statistics
    const totalPlayers = userPlayers.length;
    const totalAchievements = userPlayers.reduce((acc, player) => {
      return acc + (player.achievements?.length || 0);
    }, 0);

    const totalStats = userPlayers.reduce((acc, player) => {
      const stats = player.stats as any;
      return {
        kd: acc.kd + (stats?.kd || 0),
        adr: acc.adr + (stats?.adr || 0),
        maps_played: acc.maps_played + (stats?.maps_played || 0),
        wins: acc.wins + (stats?.wins || 0),
        losses: acc.losses + (stats?.losses || 0),
        views: acc.views + (stats?.views || 0),
      };
    }, { kd: 0, adr: 0, maps_played: 0, wins: 0, losses: 0, views: 0 });

    const averageStats = totalPlayers > 0 ? {
      kd: totalStats.kd / totalPlayers,
      adr: totalStats.adr / totalPlayers,
      maps_played: totalStats.maps_played / totalPlayers,
      winrate: totalStats.maps_played > 0 ? (totalStats.wins / totalStats.maps_played) * 100 : 0,
    } : { kd: 0, adr: 0, maps_played: 0, winrate: 0 };

    res.json({
      success: true,
      data: {
        totalPlayers,
        totalAchievements,
        totalStats,
        averageStats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify user email
// @route   PUT /api/users/:id/verify
// @access  Private (Admin)
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Only admins can verify users
    if (currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Update verification status
    await db.update(users)
      .set({
        isVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id));

    res.json({
      success: true,
      message: 'User verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private (Admin/Moderator)
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { role } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const usersByRole = await db.query.users.findMany({
      where: eq(users.role, role),
      columns: {
        password: false, // Exclude password
      },
      orderBy: desc(users.createdAt),
      limit,
    });

    res.json({
      success: true,
      data: usersByRole,
    });
  } catch (error) {
    next(error);
  }
}; 