import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { tournaments, teams, tournamentParticipants } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql, gte, lte } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateTournamentSchema, UpdateTournamentSchema } from '../types/index.js';
import { getParam, getQuery, getQueryInt, getBody } from '../utils/requestHelpers.js';

// @desc    Get all tournaments with filtering and pagination
// @route   GET /api/tournaments
// @access  Public
export const getTournaments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 6);
    const search = getQuery(req, 'search');
    const status = getQuery(req, 'status');
    const country = getQuery(req, 'country');
    const sortBy = getQuery(req, 'sortBy') || 'startDate';
    const sortOrder = getQuery(req, 'sortOrder') || 'asc';

    const offset = (page - 1) * limit;

    // Build where conditions
    let whereConditions: any[] = [];

    if (search) {
      whereConditions.push(
        or(
          like(tournaments.name, `%${search}%`),
          like(tournaments.description, `%${search}%`),
          like(tournaments.organizer, `%${search}%`)
        )
      );
    }

    if (status) {
      whereConditions.push(eq(tournaments.status, status));
    }

    if (country) {
      whereConditions.push(eq(tournaments.country, country));
    }

    // Get valid sort columns
    const validSortColumns = ['startDate', 'endDate', 'name', 'prizePool', 'createdAt'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'startDate';

    const allTournaments = await db.query.tournaments.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      offset,
      limit,
      orderBy: sortOrder === 'desc' ? desc(tournaments[sortColumn as keyof typeof tournaments] as any) : asc(tournaments[sortColumn as keyof typeof tournaments] as any),
      with: {
        participants: {
          with: {
            team: {
              columns: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    // Count total tournaments
    const totalTournaments = await db.query.tournaments.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
    });

    const totalPages = Math.ceil(totalTournaments.length / limit);

    res.json({
      success: true,
      data: {
        tournaments: allTournaments,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: totalTournaments.length,
          itemsPerPage: limit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single tournament by ID
// @route   GET /api/tournaments/:id
// @access  Public
export const getTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
      with: {
        participants: {
          with: {
            team: true,
          },
        },
      },
    });

    if (!tournament) {
      throw new CustomError('Tournament not found', 404);
    }

    res.json({
      success: true,
      data: {
        tournament,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private (Admin)
export const createTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateTournamentSchema.parse(getBody(req));

    const [newTournament] = await db.insert(tournaments).values({
      name: validatedData.name,
      description: validatedData.description || null,
      organizer: validatedData.organizer,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      registrationDeadline: validatedData.registrationDeadline || null,
      maxTeams: validatedData.maxTeams || null,
      currentTeams: 0,
      format: validatedData.format,
      rules: validatedData.rules || null,
      prizePool: validatedData.prizePool?.toString() || null,
      currency: validatedData.currency,
      status: validatedData.status || 'upcoming',
      country: validatedData.country || null,
      logo: validatedData.logo || null,
      banner: validatedData.banner || null,
      isFeatured: validatedData.isFeatured || false,
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: {
        tournament: newTournament,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private (Admin)
export const updateTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Validate input
    const validatedData = UpdateTournamentSchema.parse(getBody(req));

    // Check if tournament exists
    const existingTournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
    });

    if (!existingTournament) {
      throw new CustomError('Tournament not found', 404);
    }

    // Update tournament
    const [updatedTournament] = await db.update(tournaments)
      .set({
        name: validatedData.name || existingTournament.name,
        description: validatedData.description || existingTournament.description,
        organizer: validatedData.organizer || existingTournament.organizer,
        startDate: validatedData.startDate || existingTournament.startDate,
        endDate: validatedData.endDate || existingTournament.endDate,
        registrationDeadline: validatedData.registrationDeadline || existingTournament.registrationDeadline,
        maxTeams: validatedData.maxTeams || existingTournament.maxTeams,
        format: validatedData.format || existingTournament.format,
        rules: validatedData.rules || existingTournament.rules,
        prizePool: validatedData.prizePool?.toString() || existingTournament.prizePool,
        currency: validatedData.currency || existingTournament.currency,
        status: validatedData.status || existingTournament.status,
        country: validatedData.country || existingTournament.country,
        logo: validatedData.logo || existingTournament.logo,
        banner: validatedData.banner || existingTournament.banner,
        isFeatured: validatedData.isFeatured ?? existingTournament.isFeatured,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, id))
      .returning();

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: {
        tournament: updatedTournament,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private (Admin)
export const deleteTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    // Check if tournament exists
    const existingTournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
    });

    if (!existingTournament) {
      throw new CustomError('Tournament not found', 404);
    }

    // Delete participants first
    await db.delete(tournamentParticipants).where(eq(tournamentParticipants.tournamentId, id));

    // Delete tournament
    await db.delete(tournaments).where(eq(tournaments.id, id));

    res.json({
      success: true,
      message: 'Tournament deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured tournaments
// @route   GET /api/tournaments/featured
// @access  Public
export const getFeaturedTournaments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getQueryInt(req, 'limit', 6);

    const featuredTournaments = await db.query.tournaments.findMany({
      where: eq(tournaments.isFeatured, true),
      limit,
      orderBy: desc(tournaments.startDate),
      with: {
        participants: {
          with: {
            team: {
              columns: {
                id: true,
                name: true,
                logo: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: {
        tournaments: featuredTournaments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get upcoming tournaments
// @route   GET /api/tournaments/upcoming
// @access  Public
export const getUpcomingTournaments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getQueryInt(req, 'limit', 10);

    const upcomingTournaments = await db.query.tournaments.findMany({
      where: and(
        eq(tournaments.status, 'upcoming'),
        gte(tournaments.startDate, new Date())
      ),
      limit,
      orderBy: asc(tournaments.startDate),
    });

    res.json({
      success: true,
      data: {
        tournaments: upcomingTournaments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ongoing tournaments
// @route   GET /api/tournaments/ongoing
// @access  Public
export const getOngoingTournaments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getQueryInt(req, 'limit', 10);

    const ongoingTournaments = await db.query.tournaments.findMany({
      where: eq(tournaments.status, 'ongoing'),
      limit,
      orderBy: asc(tournaments.startDate),
    });

    res.json({
      success: true,
      data: {
        tournaments: ongoingTournaments,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register team for tournament
// @route   POST /api/tournaments/:id/register
// @access  Private
export const registerTeamForTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tournamentId = getParam(req, 'id');
    const { teamId }: { teamId: string } = getBody(req);

    if (!teamId) {
      throw new CustomError('Team ID is required', 400);
    }

    // Check if tournament exists
    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, tournamentId),
    });

    if (!tournament) {
      throw new CustomError('Tournament not found', 404);
    }

    // Check if tournament is open for registration
    if (tournament.status !== 'upcoming') {
      throw new CustomError('Tournament is not open for registration', 400);
    }

    // Check if registration deadline has passed
    if (tournament.registrationDeadline && new Date() > tournament.registrationDeadline) {
      throw new CustomError('Registration deadline has passed', 400);
    }

    // Check if tournament is full
    if (tournament.maxTeams && (tournament.currentTeams || 0) >= tournament.maxTeams) {
      throw new CustomError('Tournament is full', 400);
    }

    // Check if team is already registered
    const existingParticipant = await db.query.tournamentParticipants.findFirst({
      where: and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.teamId, teamId)
      ),
    });

    if (existingParticipant) {
      throw new CustomError('Team is already registered for this tournament', 400);
    }

    // Add team to tournament
    await db.insert(tournamentParticipants).values({
      tournamentId: tournamentId,
      teamId: teamId,
      status: 'registered',
    });

    // Update current teams count
    await db.update(tournaments)
      .set({
        currentTeams: (tournament.currentTeams || 0) + 1,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, tournamentId));

    res.status(201).json({
      success: true,
      message: 'Successfully registered for tournament',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tournament participants
// @route   GET /api/tournaments/:id/participants
// @access  Public
export const getTournamentParticipants = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = getParam(req, 'id');

    const participants = await db.query.tournamentParticipants.findMany({
      where: eq(tournamentParticipants.tournamentId, id),
      with: {
        team: true,
      },
    });

    res.json({
      success: true,
      data: {
        participants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update participant status
// @route   PUT /api/tournaments/:id/participants/:participantId
// @access  Private (Admin)
export const updateParticipantStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tournamentId = getParam(req, 'id');
    const participantId = getParam(req, 'participantId');
    const { status, seed, finalPosition }: { 
      status?: string; 
      seed?: number; 
      finalPosition?: number; 
    } = getBody(req);

    // Update participant
    const [updatedParticipant] = await db.update(tournamentParticipants)
      .set({
        status: status || null,
        seed: seed || null,
        finalPosition: finalPosition || null,
      })
      .where(eq(tournamentParticipants.id, participantId))
      .returning();

    if (!updatedParticipant) {
      throw new CustomError('Participant not found', 404);
    }

    res.json({
      success: true,
      message: 'Participant status updated successfully',
      data: {
        participant: updatedParticipant,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tournaments by status
// @route   GET /api/tournaments/status/:status
// @access  Public
export const getTournamentsByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = getParam(req, 'status');
    const limit = getQueryInt(req, 'limit', 10);

    const tournamentsByStatus = await db.query.tournaments.findMany({
      where: eq(tournaments.status, status),
      limit,
      orderBy: asc(tournaments.startDate),
    });

    res.json({
      success: true,
      data: {
        tournaments: tournamentsByStatus,
        total: tournamentsByStatus.length,
      },
    });
  } catch (error) {
    next(error);
  }
}; 