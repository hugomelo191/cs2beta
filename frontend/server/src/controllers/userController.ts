import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { users, teams, players } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateUserSchema, UpdateUserSchema } from '../types/index.js';
import bcrypt from 'bcryptjs';
import { getParam, getQuery, getQueryInt, getBody } from '../utils/requestHelpers.js';

// @desc    Get all users with filtering and pagination
// @route   GET /api/users
// @access  Private (Admin)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 10);
    const search = getQuery(req, 'search');
    const role = getQuery(req, 'role');
    const isActive = getQuery(req, 'isActive');
    const sortBy = getQuery(req, 'sortBy') || 'createdAt';
    const sortOrder = getQuery(req, 'sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(users.email, `%${search}%`),
          like(users.username, `%${search}%`),
          like(users.firstName, `%${search}%`),
          like(users.lastName, `%${search}%`)
        )
      );
    }

    if (role) {
      whereConditions.push(eq(users.role, role));
    }

    if (isActive !== undefined) {
      whereConditions.push(eq(users.isActive, isActive === 'true'));
    }

    // Get valid sort columns
    const validSortColumns = ['createdAt', 'email', 'username', 'role'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'createdAt';

    const allUsers = await db.query.users.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      offset,
      limit,
      orderBy: sortOrder === 'desc' ? desc(users[sortColumn as keyof typeof users] as any) : asc(users[sortColumn as keyof typeof users] as any),
      columns: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Count total users
    const totalUsers = await db.query.users.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    });

    const totalPages = Math.ceil(totalUsers.length / limit);

    res.json({
      success: true,
      data: {
        users: allUsers,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalUsers.length,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private (Admin)
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        password: false, // Exclude password
      },
      with: {
        players: true,
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private (Admin/Self)
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Validate input
    const validatedData = UpdateUserSchema.parse(getBody(req));

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Hash password if provided
    let hashedPassword;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user
    const [updatedUser] = await db.update(users)
      .set({
        email: validatedData.email || existingUser.email,
        username: validatedData.username || existingUser.username,
        firstName: validatedData.firstName || existingUser.firstName,
        lastName: validatedData.lastName || existingUser.lastName,
        avatar: validatedData.avatar || existingUser.avatar,
        bio: validatedData.bio || existingUser.bio,
        country: validatedData.country || existingUser.country,
        password: hashedPassword || existingUser.password,
        updatedAt: new Date(),
      } as any)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio,
        country: users.country,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
      },
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
    const id = getParam(req, 'id');

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Soft delete - just deactivate the user instead of deleting
    await db.update(users)
      .set({
        isActive: false,
        updatedAt: new Date(),
      } as any)
      .where(eq(users.id, id));

    res.json({
      success: true,
      message: 'User deactivated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile (public)
// @route   GET /api/users/:id/profile
// @access  Public
export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        country: true,
        createdAt: true,
      },
              with: {
          players: {
            columns: {
              nickname: true,
              position: true,
              faceitElo: true,
              faceitLevel: true,
              achievements: true,
              socials: true,
            },
          },
        },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    res.json({
      success: true,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin update user
// @route   PUT /api/users/:id/admin-update
// @access  Private (Admin)
export const adminUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const { role, isVerified, ...profileData }: { 
      role?: string; 
      isVerified?: boolean; 
      [key: string]: any; 
    } = getBody(req);

    // Validate profile data
    const validatedData = UpdateUserSchema.parse(profileData);

    // Check if user exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!existingUser) {
      throw new CustomError('User not found', 404);
    }

    // Hash password if provided
    let hashedPassword;
    if (validatedData.password) {
      hashedPassword = await bcrypt.hash(validatedData.password, 12);
    }

    // Update user with admin privileges
    const [updatedUser] = await db.update(users)
      .set({
        email: validatedData.email || existingUser.email,
        username: validatedData.username || existingUser.username,
        firstName: validatedData.firstName || existingUser.firstName,
        lastName: validatedData.lastName || existingUser.lastName,
        avatar: validatedData.avatar || existingUser.avatar,
        bio: validatedData.bio || existingUser.bio,
        country: validatedData.country || existingUser.country,
        password: hashedPassword || existingUser.password,
        role: role || existingUser.role,
        isVerified: isVerified ?? existingUser.isVerified,
        updatedAt: new Date(),
      } as any)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        firstName: users.firstName,
        lastName: users.lastName,
        avatar: users.avatar,
        bio: users.bio,
        country: users.country,
        role: users.role,
        isActive: users.isActive,
        isVerified: users.isVerified,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    res.json({
      success: true,
      message: 'User updated successfully by admin',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin change user password
// @route   PUT /api/users/:id/change-password
// @access  Private (Admin)
export const adminChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const { currentPassword, newPassword }: { 
      currentPassword: string; 
      newPassword: string; 
    } = getBody(req);

    if (!currentPassword || !newPassword) {
      throw new CustomError('Current password and new password are required', 400);
    }

    // Get user with current password
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new CustomError('Current password is incorrect', 400);
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      } as any)
      .where(eq(users.id, id));

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user stats
// @route   GET /api/users/:id/stats
// @access  Public
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      with: {
        players: true,
      },
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Mock stats for now - in real app, calculate from games/matches
    const stats = {
      gamesPlayed: 150,
      wins: 95,
      losses: 55,
      winRate: 63.3,
      averageKD: 1.25,
      totalKills: 2156,
      totalDeaths: 1725,
      faceitLevel: user.players?.[0]?.faceitLevel || 0,
      faceitElo: user.players?.[0]?.faceitElo || 0,
    };

    res.json({
      success: true,
      data: {
        stats,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (activate/deactivate)
// @route   PUT /api/users/:id/toggle-status
// @access  Private (Admin)
export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Get current user
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    // Toggle status
    const [updatedUser] = await db.update(users)
      .set({
        isActive: !user.isActive,
        updatedAt: new Date(),
      } as any)
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        isActive: users.isActive,
      });

    res.json({
      success: true,
      message: `User ${updatedUser?.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        isActive: updatedUser?.isActive,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get users by role
// @route   GET /api/users/role/:role
// @access  Private (Admin)
export const getUsersByRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = getParam(req, 'role');
    const limit = getQueryInt(req, 'limit', 50);

    const usersByRole = await db.query.users.findMany({
      where: eq(users.role, role),
      limit,
      columns: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        isActive: true,
        isVerified: true,
        createdAt: true,
      },
    });

    res.json({
      success: true,
      data: {
        users: usersByRole,
        total: usersByRole.length,
      },
    });
  } catch (error) {
    next(error);
  }
}; 

