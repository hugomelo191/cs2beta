import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { players, teams, users } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreatePlayerSchema, UpdatePlayerSchema } from '../types/index.js';

// @desc    Get all players
// @route   GET /api/players
// @access  Public
export const getPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const country = req.query.country as string;
    const position = req.query.position as string;
    const teamId = req.query.teamId as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(players.nickname, `%${search}%`),
          like(players.realName, `%${search}%`)
        )
      );
    }
    
    if (country) {
      whereConditions.push(eq(players.country, country));
    }

    if (position) {
      whereConditions.push(eq(players.position, position));
    }

    if (teamId) {
      whereConditions.push(eq(players.teamId, teamId));
    }

    whereConditions.push(eq(players.isActive, true));

    // Get players with pagination and relations
    const playersList = await db.query.players.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        team: true,
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: sortOrder === 'desc' ? desc(players[sortBy as keyof typeof players]) : asc(players[sortBy as keyof typeof players]),
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: players.id })
      .from(players)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: playersList,
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

// @desc    Get single player
// @route   GET /api/players/:id
// @access  Public
export const getPlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const player = await db.query.players.findFirst({
      where: eq(players.id, id),
      with: {
        team: {
          with: {
            players: {
              where: eq(players.isActive, true),
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
        },
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
            bio: true,
            country: true,
          }
        }
      }
    });

    if (!player) {
      throw new CustomError('Player not found', 404);
    }

    // Increment views if stats exist
    if (player.stats) {
      const currentViews = (player.stats as any).views || 0;
      await db.update(players)
        .set({
          stats: {
            ...player.stats,
            views: currentViews + 1
          }
        })
        .where(eq(players.id, id));
    }

    res.json({
      success: true,
      data: player,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new player
// @route   POST /api/players
// @access  Private
export const createPlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreatePlayerSchema.parse(req.body);

    // Check if player nickname already exists
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.nickname, validatedData.nickname),
    });

    if (existingPlayer) {
      throw new CustomError('Player nickname already exists', 400);
    }

    // Create player
    const [newPlayer] = await db.insert(players).values({
      ...validatedData,
      stats: {
        kd: 0,
        adr: 0,
        maps_played: 0,
        wins: 0,
        losses: 0,
        views: 0,
      },
      achievements: [],
      socials: validatedData.socials || {},
    }).returning();

    // Get player with relations
    const playerWithRelations = await db.query.players.findFirst({
      where: eq(players.id, newPlayer.id),
      with: {
        team: true,
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Player created successfully',
      data: playerWithRelations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update player
// @route   PUT /api/players/:id
// @access  Private
export const updatePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = UpdatePlayerSchema.parse(req.body);

    // Check if player exists
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.id, id),
    });

    if (!existingPlayer) {
      throw new CustomError('Player not found', 404);
    }

    // Check if new nickname conflicts with existing player
    if (validatedData.nickname && validatedData.nickname !== existingPlayer.nickname) {
      const nicknameConflict = await db.query.players.findFirst({
        where: eq(players.nickname, validatedData.nickname),
      });

      if (nicknameConflict) {
        throw new CustomError('Player nickname already exists', 400);
      }
    }

    // Update player
    const [updatedPlayer] = await db.update(players)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(players.id, id))
      .returning();

    // Get updated player with relations
    const playerWithRelations = await db.query.players.findFirst({
      where: eq(players.id, id),
      with: {
        team: true,
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Player updated successfully',
      data: playerWithRelations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete player
// @route   DELETE /api/players/:id
// @access  Private
export const deletePlayer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if player exists
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.id, id),
    });

    if (!existingPlayer) {
      throw new CustomError('Player not found', 404);
    }

    // Soft delete - set isActive to false
    await db.update(players)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(players.id, id));

    res.json({
      success: true,
      message: 'Player deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured players
// @route   GET /api/players/featured
// @access  Public
export const getFeaturedPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 6;

    const featuredPlayers = await db.query.players.findMany({
      where: and(
        eq(players.isActive, true),
        sql`${players.stats}->>'views' IS NOT NULL`
      ),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
          }
        },
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: desc(sql`(${players.stats}->>'views')::int`),
      limit,
    });

    res.json({
      success: true,
      data: featuredPlayers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get players by team
// @route   GET /api/players/team/:teamId
// @access  Public
export const getPlayersByTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamId } = req.params;

    const teamPlayers = await db.query.players.findMany({
      where: and(
        eq(players.teamId, teamId),
        eq(players.isActive, true)
      ),
      with: {
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: asc(players.nickname),
    });

    res.json({
      success: true,
      data: teamPlayers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update player stats
// @route   PUT /api/players/:id/stats
// @access  Private
export const updatePlayerStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { kd, adr, maps_played, wins, losses } = req.body;

    // Check if player exists
    const existingPlayer = await db.query.players.findFirst({
      where: eq(players.id, id),
    });

    if (!existingPlayer) {
      throw new CustomError('Player not found', 404);
    }

    // Update stats
    const currentStats = existingPlayer.stats || {};
    const updatedStats = {
      ...currentStats,
      kd: kd !== undefined ? kd : currentStats.kd,
      adr: adr !== undefined ? adr : currentStats.adr,
      maps_played: maps_played !== undefined ? maps_played : currentStats.maps_played,
      wins: wins !== undefined ? wins : currentStats.wins,
      losses: losses !== undefined ? losses : currentStats.losses,
    };

    await db.update(players)
      .set({
        stats: updatedStats,
        updatedAt: new Date(),
      })
      .where(eq(players.id, id));

    res.json({
      success: true,
      message: 'Player stats updated successfully',
      data: updatedStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get players by position
// @route   GET /api/players/position/:position
// @access  Public
export const getPlayersByPosition = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { position } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const playersByPosition = await db.query.players.findMany({
      where: and(
        eq(players.position, position),
        eq(players.isActive, true)
      ),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
          }
        },
        user: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: desc(sql`(${players.stats}->>'kd')::float`),
      limit,
    });

    res.json({
      success: true,
      data: playersByPosition,
    });
  } catch (error) {
    next(error);
  }
}; 