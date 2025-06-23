import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { tournaments, teams, tournamentParticipants } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql, gte, lte } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateTournamentSchema, UpdateTournamentSchema } from '../types/index.js';

// @desc    Get all tournaments
// @route   GET /api/tournaments
// @access  Public
export const getTournaments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const country = req.query.country as string;
    const sortBy = req.query.sortBy as string || 'startDate';
    const sortOrder = req.query.sortOrder as string || 'asc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(like(tournaments.name, `%${search}%`));
    }
    
    if (status) {
      whereConditions.push(eq(tournaments.status, status));
    }

    if (country) {
      whereConditions.push(eq(tournaments.country, country));
    }

    // Get tournaments with pagination
    const tournamentsList = await db.query.tournaments.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: sortOrder === 'desc' ? desc(tournaments[sortBy as keyof typeof tournaments]) : asc(tournaments[sortBy as keyof typeof tournaments]),
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: tournaments.id })
      .from(tournaments)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: tournamentsList,
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

// @desc    Get single tournament
// @route   GET /api/tournaments/:id
// @access  Public
export const getTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
    });

    if (!tournament) {
      throw new CustomError('Tournament not found', 404);
    }

    // Get tournament participants
    const participants = await db.query.tournamentParticipants.findMany({
      where: eq(tournamentParticipants.tournamentId, id),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
            country: true,
          }
        }
      },
      orderBy: asc(tournamentParticipants.seed),
    });

    res.json({
      success: true,
      data: {
        ...tournament,
        participants,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new tournament
// @route   POST /api/tournaments
// @access  Private
export const createTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateTournamentSchema.parse(req.body);

    // Create tournament
    const [newTournament] = await db.insert(tournaments).values({
      ...validatedData,
      maps: validatedData.maps || [],
      currentTeams: 0,
    }).returning();

    res.status(201).json({
      success: true,
      message: 'Tournament created successfully',
      data: newTournament,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tournament
// @route   PUT /api/tournaments/:id
// @access  Private
export const updateTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = UpdateTournamentSchema.parse(req.body);

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
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, id))
      .returning();

    res.json({
      success: true,
      message: 'Tournament updated successfully',
      data: updatedTournament,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete tournament
// @route   DELETE /api/tournaments/:id
// @access  Private
export const deleteTournament = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if tournament exists
    const existingTournament = await db.query.tournaments.findFirst({
      where: eq(tournaments.id, id),
    });

    if (!existingTournament) {
      throw new CustomError('Tournament not found', 404);
    }

    // Check if tournament has participants
    const participants = await db.query.tournamentParticipants.findMany({
      where: eq(tournamentParticipants.tournamentId, id),
    });

    if (participants.length > 0) {
      throw new CustomError('Cannot delete tournament with participants', 400);
    }

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
    const limit = parseInt(req.query.limit as string) || 6;

    const featuredTournaments = await db.query.tournaments.findMany({
      where: and(
        eq(tournaments.isFeatured, true),
        or(
          eq(tournaments.status, 'upcoming'),
          eq(tournaments.status, 'ongoing')
        )
      ),
      orderBy: asc(tournaments.startDate),
      limit,
    });

    res.json({
      success: true,
      data: featuredTournaments,
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
    const limit = parseInt(req.query.limit as string) || 10;

    const upcomingTournaments = await db.query.tournaments.findMany({
      where: and(
        eq(tournaments.status, 'upcoming'),
        gte(tournaments.startDate, new Date())
      ),
      orderBy: asc(tournaments.startDate),
      limit,
    });

    res.json({
      success: true,
      data: upcomingTournaments,
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
    const limit = parseInt(req.query.limit as string) || 10;

    const ongoingTournaments = await db.query.tournaments.findMany({
      where: eq(tournaments.status, 'ongoing'),
      orderBy: desc(tournaments.startDate),
      limit,
    });

    res.json({
      success: true,
      data: ongoingTournaments,
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
    const { id: tournamentId } = req.params;
    const { teamId } = req.body;

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
    if (tournament.maxTeams && tournament.currentTeams >= tournament.maxTeams) {
      throw new CustomError('Tournament is full', 400);
    }

    // Check if team exists
    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      throw new CustomError('Team not found', 404);
    }

    // Check if team is already registered
    const existingRegistration = await db.query.tournamentParticipants.findFirst({
      where: and(
        eq(tournamentParticipants.tournamentId, tournamentId),
        eq(tournamentParticipants.teamId, teamId)
      ),
    });

    if (existingRegistration) {
      throw new CustomError('Team is already registered for this tournament', 400);
    }

    // Register team
    await db.insert(tournamentParticipants).values({
      tournamentId,
      teamId,
      status: 'registered',
    });

    // Update tournament current teams count
    await db.update(tournaments)
      .set({
        currentTeams: tournament.currentTeams + 1,
        updatedAt: new Date(),
      })
      .where(eq(tournaments.id, tournamentId));

    res.json({
      success: true,
      message: 'Team registered successfully for tournament',
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
    const { id: tournamentId } = req.params;

    const participants = await db.query.tournamentParticipants.findMany({
      where: eq(tournamentParticipants.tournamentId, tournamentId),
      with: {
        team: {
          columns: {
            id: true,
            name: true,
            tag: true,
            logo: true,
            country: true,
          }
        }
      },
      orderBy: asc(tournamentParticipants.seed),
    });

    res.json({
      success: true,
      data: participants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update tournament participant status
// @route   PUT /api/tournaments/:id/participants/:participantId
// @access  Private
export const updateParticipantStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: tournamentId, participantId } = req.params;
    const { status, seed, finalPosition } = req.body;

    // Check if participant exists
    const participant = await db.query.tournamentParticipants.findFirst({
      where: eq(tournamentParticipants.id, participantId),
    });

    if (!participant) {
      throw new CustomError('Participant not found', 404);
    }

    // Update participant
    await db.update(tournamentParticipants)
      .set({
        status,
        seed,
        finalPosition,
      })
      .where(eq(tournamentParticipants.id, participantId));

    res.json({
      success: true,
      message: 'Participant status updated successfully',
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
    const { status } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const tournamentsByStatus = await db.query.tournaments.findMany({
      where: eq(tournaments.status, status),
      orderBy: status === 'upcoming' ? asc(tournaments.startDate) : desc(tournaments.startDate),
      limit,
    });

    res.json({
      success: true,
      data: tournamentsByStatus,
    });
  } catch (error) {
    next(error);
  }
}; 