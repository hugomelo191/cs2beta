import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { teams, teamMembers, players } from '../db/schema.js';
import { eq, desc, asc, like, and, or } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateTeamSchema, UpdateTeamSchema } from '../types/index.js';
import { getParam, getQuery, getQueryInt, getBody } from '../utils/requestHelpers.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 10);
    const search = getQuery(req, 'search');
    const country = getQuery(req, 'country');
    const sortBy = getQuery(req, 'sortBy') || 'createdAt';
    const sortOrder = getQuery(req, 'sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(teams.name, `%${search}%`),
          like(teams.tag, `%${search}%`),
          like(teams.description, `%${search}%`)
        )
      );
    }

    if (country) {
      whereConditions.push(eq(teams.country, country));
    }

    // Get teams with simple select
    const allTeams = await db.select().from(teams).limit(limit).offset(offset);

    // Count total teams
    const [countResult] = await db.select({ count: teams.id }).from(teams);
    const totalItems = await db.select().from(teams);

    const totalPages = Math.ceil(totalItems.length / limit);

    res.json({
      success: true,
      data: {
        teams: allTeams,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalItems.length,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    next(error);
  }
};

// @desc    Get single team with members
// @route   GET /api/teams/:id
// @access  Public
export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const [teamData] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);

    if (!teamData) {
      throw new CustomError('Team not found', 404);
    }

    // Get team members
    const members = await db.select().from(teamMembers).where(eq(teamMembers.teamId, id));

    // Get team players
    const teamPlayers = await db.select().from(players).where(eq(players.teamId, id));

    res.json({
      success: true,
      data: {
        ...teamData,
        members,
        players: teamPlayers,
      },
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    next(error);
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateTeamSchema.parse(getBody(req));

    const [newTeam] = await db.insert(teams).values({
      name: validatedData.name,
      tag: validatedData.tag,
      country: validatedData.country,
      description: validatedData.description || null,
      city: validatedData.city || null,
      founded: validatedData.founded || null,
      website: validatedData.website || null,
      socials: validatedData.socials || {},
    }).returning();

    if (!newTeam) {
      throw new CustomError('Failed to create team', 500);
    }

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: {
        team: newTeam,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team
// @route   PUT /api/teams/:id
// @access  Private
export const updateTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Validate input
    const validatedData = UpdateTeamSchema.parse(getBody(req));

    // Check if team exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!existingTeam) {
      throw new CustomError('Team not found', 404);
    }

    // Update team
    const [updatedTeam] = await db.update(teams)
      .set({
        name: validatedData.name || existingTeam.name,
        tag: validatedData.tag || existingTeam.tag,
        description: validatedData.description || existingTeam.description,
        logo: validatedData.logo || existingTeam.logo,
        banner: validatedData.banner || existingTeam.banner,
        city: validatedData.city || existingTeam.city,
        website: validatedData.website || existingTeam.website,
        socials: validatedData.socials || existingTeam.socials,
        updatedAt: new Date(),
      } as any)
      .where(eq(teams.id, id))
      .returning();

    if (!updatedTeam) {
      throw new CustomError('Failed to update team', 500);
    }

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: {
        team: updatedTeam,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team
// @route   DELETE /api/teams/:id
// @access  Private
export const deleteTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Check if team exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!existingTeam) {
      throw new CustomError('Team not found', 404);
    }

    // Remove all team members first
    await db.delete(teamMembers).where(eq(teamMembers.teamId, id));

    // Update players to remove team association
    await db.update(players)
      .set({ teamId: null } as any)
      .where(eq(players.teamId, id));

    // Delete team
    await db.delete(teams).where(eq(teams.id, id));

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get team members
// @route   GET /api/teams/:id/members
// @access  Public
export const getTeamMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = getParam(req, 'id');

    // Check if team exists
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      throw new CustomError('Team not found', 404);
    }

    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, teamId),
      with: {
        player: true,
      },
    });

    res.json({
      success: true,
      data: {
        members,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add player to team
// @route   POST /api/teams/:id/members
// @access  Private
export const addTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = getParam(req, 'id');
    const { playerId, role }: { playerId: string; role: string } = getBody(req);

    if (!playerId || !teamId) {
      throw new CustomError('Team ID and Player ID are required', 400);
    }

    await db.insert(teamMembers).values({
      teamId: teamId,
      playerId: playerId,
      role: role,
    } as any);

    // Update player team association
    await db.update(players)
      .set({ teamId: teamId } as any)
      .where(eq(players.id, playerId));

    res.status(201).json({
      success: true,
      message: 'Player added to team successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove player from team
// @route   DELETE /api/teams/:teamId/members/:playerId
// @access  Private
export const removeTeamMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const teamId = getParam(req, 'teamId');
    const playerId = getParam(req, 'playerId');

    await db.delete(teamMembers).where(
      and(eq(teamMembers.teamId, teamId), eq(teamMembers.playerId, playerId))
    );

    // Remove player team association
    await db.update(players)
      .set({ teamId: null } as any)
      .where(eq(players.id, playerId));

    res.json({
      success: true,
      message: 'Player removed from team successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured teams
// @route   GET /api/teams/featured
// @access  Public
export const getFeaturedTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getQueryInt(req, 'limit', 6);

    const featuredTeams = await db.query.teams.findMany({
      limit,
      orderBy: desc(teams.createdAt),
    });

    res.json({
      success: true,
      data: {
        teams: featuredTeams,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team and add creator as member
// @route   POST /api/teams/create-with-user
// @access  Private
export const createTeamWithUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateTeamSchema.parse(getBody(req));

    const [newTeam] = await db.insert(teams).values({
      name: validatedData.name,
      tag: validatedData.tag,
      country: validatedData.country,
      description: validatedData.description || null,
      city: validatedData.city || null,
      founded: validatedData.founded || null,
      website: validatedData.website || null,
      socials: validatedData.socials || {},
    }).returning();

    if (!newTeam) {
      throw new CustomError('Failed to create team', 500);
    }

    // Add creator as team member (captain)
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      playerId: req.user?.id || '',
      role: 'captain',
    } as any);

    // Update player team association
    await db.update(players)
      .set({ teamId: newTeam.id } as any)
      .where(eq(teams.id, newTeam.id));

    const teamWithMembers = await db.query.teams.findFirst({
      where: eq(teams.id, newTeam.id),
      with: {
        members: {
          with: {
            player: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: {
        team: teamWithMembers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's team invitations
// @route   GET /api/teams/invitations
// @access  Private
export const getUserTeamInvitations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new CustomError('User not authenticated', 401);
    }

    // Get user's player profile
    const userPlayer = await db.query.players.findFirst({
      where: eq(players.userId, userId),
    });

    if (!userPlayer) {
      throw new CustomError('Player profile not found', 404);
    }

    if (!userPlayer.teamId) {
      res.json({
        success: true,
        data: {
          invitations: [],
        },
      });
      return;
    }

    // Get pending team invitations
    const activeTeamMembers = await db.query.teamMembers.findMany({
      where: and(
        eq(teamMembers.teamId, userPlayer.teamId),
        eq(teamMembers.isActive, true)
      ),
    });

    res.json({
      success: true,
      data: {
        invitations: activeTeamMembers,
      },
    });
  } catch (error) {
    next(error);
  }
}; 
