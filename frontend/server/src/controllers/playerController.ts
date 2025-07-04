import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { players, teams, users } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreatePlayerSchema, UpdatePlayerSchema } from '../types/index.js';
import { getQuery, getQueryInt, getParam, getBody } from '../utils/requestHelpers.js';
import { faceitService } from '../services/faceitService.js';

// @desc    Get all players
// @route   GET /api/players
// @access  Public
export const getPlayers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 10);
    const search = getQuery(req, 'search');
    const country = getQuery(req, 'country');
    const position = getQuery(req, 'position');
    const teamId = getQuery(req, 'teamId');
    const sortBy = getQuery(req, 'sortBy') || 'createdAt';
    const sortOrder = getQuery(req, 'sortOrder') || 'desc';

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
      orderBy: (() => {
        switch (sortBy) {
          case 'nickname':
            return sortOrder === 'desc' ? desc(players.nickname) : asc(players.nickname);
          case 'country':
            return sortOrder === 'desc' ? desc(players.country) : asc(players.country);
          case 'createdAt':
            return sortOrder === 'desc' ? desc(players.createdAt) : asc(players.createdAt);
          case 'faceitElo':
            return sortOrder === 'desc' ? desc(players.faceitElo) : asc(players.faceitElo);
          default:
            return desc(players.createdAt);
        }
      })(),
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
    if (player.stats && typeof player.stats === 'object') {
      const currentStats: Record<string, any> = { ...player.stats };
      const currentViews = currentStats.views || 0;
      currentStats.views = currentViews + 1;
      await db.update(players)
        .set({
          stats: JSON.parse(JSON.stringify(currentStats))
        } as any)
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
      stats: JSON.parse(JSON.stringify({
        kd: 0,
        adr: 0,
        maps_played: 0,
        wins: 0,
        losses: 0,
        views: 0,
      })),
      achievements: [],
      socials: validatedData.socials || {},
    } as any).returning();

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
      } as any)
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
      } as any)
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
    const currentStats: Record<string, any> = existingPlayer.stats || {};
    const updatedStats: Record<string, any> = {
      ...currentStats,
      kd: kd !== undefined ? kd : currentStats.kd,
      adr: adr !== undefined ? adr : currentStats.adr,
      maps_played: maps_played !== undefined ? maps_played : currentStats.maps_played,
      wins: wins !== undefined ? wins : currentStats.wins,
      losses: losses !== undefined ? losses : currentStats.losses,
    };

    // Update player stats
    const [updatedPlayer] = await db.update(players)
      .set({
        stats: JSON.parse(JSON.stringify({
          ...currentStats,
          ...updatedStats,
        })),
        updatedAt: new Date()
      } as any)
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

// 🔥 NOVOS ENDPOINTS: Histórico e matches em direto
export const getPlayerHistory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;

    // Buscar o jogador na base de dados
    const playersResult = await db
      .select()
      .from(players as any)
      .where(eq(players.id, id));

    if (playersResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Jogador não encontrado'
      });
    }

    const player = playersResult[0];

    // Se o jogador tem Faceit ID, buscar histórico real
    if (player.faceit_id) {
      try {
        const history = await faceitService.getPlayerMatchHistory(player.faceit_id, limit, offset);
        
        res.json({
          success: true,
          data: {
            player: {
              id: player.id,
              nickname: player.nickname,
              faceit_nickname: player.faceit_nickname
            },
            matches: history?.items || [],
            pagination: {
              limit,
              offset,
              hasMore: (history?.items?.length || 0) === limit
            }
          }
        });
        return;
      } catch (error) {
        console.error('Erro ao buscar histórico Faceit:', error);
        // Fallback para mock data se Faceit falhar
      }
    }

    // Mock data se não tiver Faceit ou falhar
    const mockHistory = [
      {
        match_id: `mock_${player.id}_1`,
        status: 'FINISHED',
        finished_at: Date.now() - 3600000,
        teams: {
          faction1: { nickname: player.team || 'Team A', score: 16 },
          faction2: { nickname: 'Team B', score: 12 }
        },
        map: 'de_dust2',
        result: 'win'
      }
    ];

    res.json({
      success: true,
      data: {
        player: {
          id: player.id,
          nickname: player.nickname,
          faceit_nickname: player.faceit_nickname
        },
        matches: mockHistory,
        pagination: { limit, offset, hasMore: false }
      }
    });
  } catch (error) {
    console.error('Erro ao buscar histórico do jogador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico do jogador'
    });
  }
};

export const getPlayerLiveMatches = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Buscar o jogador na base de dados
    const playersResult = await db
      .select()
      .from(players as any)
      .where(eq(players.id, id));

    if (playersResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Jogador não encontrado'
      });
    }

    const player = playersResult[0];

    // Se o jogador tem Faceit ID, buscar matches em direto
    if (player.faceit_id) {
      try {
        const liveMatches = await faceitService.getPlayerLiveMatches(player.faceit_id);
        
        res.json({
          success: true,
          data: {
            player: {
              id: player.id,
              nickname: player.nickname,
              faceit_nickname: player.faceit_nickname
            },
            live_matches: liveMatches
          }
        });
        return;
      } catch (error) {
        console.error('Erro ao buscar matches em direto:', error);
      }
    }

    // Retornar vazio se não tiver Faceit ou falhar
    res.json({
      success: true,
      data: {
        player: {
          id: player.id,
          nickname: player.nickname,
          faceit_nickname: player.faceit_nickname
        },
        live_matches: []
      }
    });
  } catch (error) {
    console.error('Erro ao buscar matches em direto do jogador:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar matches em direto do jogador'
    });
  }
};

export const syncPlayerFaceit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Buscar o jogador na base de dados
    const playersResult = await db
      .select()
      .from(players as any)
      .where(eq(players.id, id));

    if (playersResult.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Jogador não encontrado'
      });
    }

    const player = playersResult[0];

    if (!player.faceit_nickname) {
      return res.status(400).json({
        success: false,
        error: 'Jogador não tem nickname Faceit configurado'
      });
    }

    // Buscar dados atualizados do Faceit
    const faceitData = await faceitService.getCompletePlayerDataWithHistory(player.faceit_nickname, 5);
    
    if (!faceitData) {
      return res.status(404).json({
        success: false,
        error: 'Dados Faceit não encontrados'
      });
    }

    // Atualizar dados na base de dados
    await db
      .update(players as any)
      .set({
        faceit_id: faceitData.faceit_id,
        faceit_elo: faceitData.faceit_elo,
        faceit_level: faceitData.faceit_level,
        updated_at: new Date()
      } as any)
      .where(eq(players.id, id));

    res.json({
      success: true,
      data: {
        message: 'Dados Faceit sincronizados com sucesso',
        player: {
          id: player.id,
          nickname: player.nickname,
          faceit_data: faceitData
        }
      }
    });
  } catch (error) {
    console.error('Erro ao sincronizar Faceit:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao sincronizar dados Faceit'
    });
  }
}; 

