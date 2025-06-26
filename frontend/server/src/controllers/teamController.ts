import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { teams, players, teamMembers } from '../db/schema.js';
import { eq, desc, asc, like, and } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateTeamSchema, UpdateTeamSchema } from '../types/index.js';

// @desc    Get all teams
// @route   GET /api/teams
// @access  Public
export const getTeams = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const country = req.query.country as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(like(teams.name, `%${search}%`));
    }
    
    if (country) {
      whereConditions.push(eq(teams.country, country));
    }

    whereConditions.push(eq(teams.isActive, true));

    // Get teams with pagination
    const teamsList = await db.query.teams.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: sortOrder === 'desc' ? desc(teams[sortBy as keyof typeof teams]) : asc(teams[sortBy as keyof typeof teams]),
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: teams.id })
      .from(teams)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: teamsList,
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

// @desc    Get single team
// @route   GET /api/teams/:id
// @access  Public
export const getTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!team) {
      throw new CustomError('Team not found', 404);
    }

    // Get team members
    const members = await db.query.teamMembers.findMany({
      where: eq(teamMembers.teamId, id),
      with: {
        player: {
          with: {
            user: true,
          },
        },
      },
    });

    // Get team players
    const players = await db.query.players.findMany({
      where: eq(players.teamId, id),
      with: {
        user: true,
      },
    });

    res.json({
      success: true,
      data: {
        ...team,
        members,
        players,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new team
// @route   POST /api/teams
// @access  Private
export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateTeamSchema.parse(req.body);

    // Check if team tag already exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.tag, validatedData.tag),
    });

    if (existingTeam) {
      throw new CustomError('Team tag already exists', 400);
    }

    // Create team
    const [newTeam] = await db.insert(teams).values({
      ...validatedData,
      socials: validatedData.socials || {},
      achievements: [],
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: newTeam,
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
    const { id } = req.params;
    
    // Validate input
    const validatedData = UpdateTeamSchema.parse(req.body);

    // Check if team exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!existingTeam) {
      throw new CustomError('Team not found', 404);
    }

    // Check if new tag conflicts with existing team
    if (validatedData.tag && validatedData.tag !== existingTeam.tag) {
      const tagConflict = await db.query.teams.findFirst({
        where: eq(teams.tag, validatedData.tag),
      });

      if (tagConflict) {
        throw new CustomError('Team tag already exists', 400);
      }
    }

    // Update team
    const [updatedTeam] = await db.update(teams)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, id))
      .returning();

    res.json({
      success: true,
      message: 'Team updated successfully',
      data: updatedTeam,
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
    const { id } = req.params;

    // Check if team exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.id, id),
    });

    if (!existingTeam) {
      throw new CustomError('Team not found', 404);
    }

    // Soft delete - set isActive to false
    await db.update(teams)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, id));

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add player to team
// @route   POST /api/teams/:id/players
// @access  Private
export const addPlayerToTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: teamId } = req.params;
    const { playerId, role = 'player' } = req.body;

    // Check if team exists
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      throw new CustomError('Team not found', 404);
    }

    // Check if player exists
    const player = await db.query.players.findFirst({
      where: eq(players.id, playerId),
    });

    if (!player) {
      throw new CustomError('Player not found', 404);
    }

    // Check if player is already in a team
    if (player.teamId && player.teamId !== teamId) {
      throw new CustomError('Player is already in another team', 400);
    }

    // Add player to team
    await db.insert(teamMembers).values({
      teamId,
      playerId,
      role,
    });

    // Update player's team
    await db.update(players)
      .set({ teamId })
      .where(eq(players.id, playerId));

    res.json({
      success: true,
      message: 'Player added to team successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove player from team
// @route   DELETE /api/teams/:id/players/:playerId
// @access  Private
export const removePlayerFromTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: teamId, playerId } = req.params;

    // Remove player from team members
    await db.delete(teamMembers)
      .where(and(eq(teamMembers.teamId, teamId), eq(teamMembers.playerId, playerId)));

    // Update player's team to null
    await db.update(players)
      .set({ teamId: null })
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
    const limit = parseInt(req.query.limit as string) || 6;

    const featuredTeams = await db.query.teams.findMany({
      where: and(eq(teams.isActive, true)),
      orderBy: desc(teams.createdAt),
      limit,
    });

    res.json({
      success: true,
      data: featuredTeams,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team for current player (becomes captain)
// @route   POST /api/teams/create-my-team
// @access  Private
export const createMyTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    // Get user's player profile
    const userPlayer = await db.query.players.findFirst({
      where: eq(players.userId, userId),
    });

    if (!userPlayer) {
      throw new CustomError('Player profile not found. Please complete your player profile first.', 404);
    }

    // Check if player already has a team
    if (userPlayer.teamId) {
      throw new CustomError('You are already part of a team. Leave your current team first.', 400);
    }

    // Validate input
    const validatedData = CreateTeamSchema.parse(req.body);

    // Check if team tag already exists
    const existingTeam = await db.query.teams.findFirst({
      where: eq(teams.tag, validatedData.tag),
    });

    if (existingTeam) {
      throw new CustomError('Team tag already exists', 400);
    }

    // Create team
    const [newTeam] = await db.insert(teams).values({
      ...validatedData,
      achievements: [],
      socials: validatedData.socials || {},
    }).returning();

    // Update player to be part of this team
    await db.update(players)
      .set({ 
        teamId: newTeam.id,
        role: 'player', // Can be changed later to captain
        updatedAt: new Date()
      })
      .where(eq(players.id, userPlayer.id));

    // Add player as team member with captain role
    await db.insert(teamMembers).values({
      teamId: newTeam.id,
      playerId: userPlayer.id,
      role: 'captain',
      isActive: true,
    });

    // Get team with relations
    const teamWithRelations = await db.query.teams.findFirst({
      where: eq(teams.id, newTeam.id),
      with: {
        players: {
          with: {
            user: {
              columns: {
                id: true,
                username: true,
                avatar: true,
              }
            }
          }
        },
        members: {
          with: {
            player: {
              with: {
                user: {
                  columns: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Team created successfully! You are now the team captain.',
      data: teamWithRelations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave current team
// @route   POST /api/teams/leave
// @access  Private
export const leaveTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;

    // Get user's player profile
    const userPlayer = await db.query.players.findFirst({
      where: eq(players.userId, userId),
      with: {
        team: true
      }
    });

    if (!userPlayer || !userPlayer.teamId) {
      throw new CustomError('You are not part of any team', 400);
    }

    // Check if user is the only member/captain
    const teamMembers = await db.query.teamMembers.findMany({
      where: and(
        eq(teamMembers.teamId, userPlayer.teamId),
        eq(teamMembers.isActive, true)
      )
    });

    // If user is the only member, delete the team
    if (teamMembers.length === 1) {
      await db.delete(teams).where(eq(teams.id, userPlayer.teamId));
    } else {
      // Remove from team members
      await db.update(teamMembers)
        .set({ 
          isActive: false,
          leftAt: new Date() 
        })
        .where(and(
          eq(teamMembers.teamId, userPlayer.teamId),
          eq(teamMembers.playerId, userPlayer.id)
        ));
    }

    // Update player to remove team association
    await db.update(players)
      .set({ 
        teamId: null,
        updatedAt: new Date()
      })
      .where(eq(players.id, userPlayer.id));

    res.json({
      success: true,
      message: teamMembers.length === 1 
        ? 'Team disbanded successfully as you were the only member.'
        : 'Left team successfully.',
    });
  } catch (error) {
    next(error);
  }
}; 