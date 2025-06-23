import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { drafts, draftApplications, users, teams } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateDraftSchema, UpdateDraftSchema } from '../types/index.js';

// @desc    Get all drafts
// @route   GET /api/draft
// @access  Public
export const getDrafts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const country = req.query.country as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(like(drafts.title, `%${search}%`));
    }
    
    if (status) {
      whereConditions.push(eq(drafts.status, status));
    }

    if (country) {
      whereConditions.push(eq(drafts.country, country));
    }

    // Get drafts with pagination
    const draftsList = await db.query.drafts.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      with: {
        organizer: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        },
        applications: {
          columns: {
            id: true,
            status: true,
          }
        }
      },
      orderBy: sortOrder === 'desc' ? desc(drafts[sortBy as keyof typeof drafts]) : asc(drafts[sortBy as keyof typeof drafts]),
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: drafts.id })
      .from(drafts)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: draftsList,
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

// @desc    Get single draft
// @route   GET /api/draft/:id
// @access  Public
export const getDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const draft = await db.query.drafts.findFirst({
      where: eq(drafts.id, id),
      with: {
        organizer: {
          columns: {
            id: true,
            username: true,
            avatar: true,
            country: true,
          }
        },
        applications: {
          with: {
            applicant: {
              columns: {
                id: true,
                username: true,
                avatar: true,
                country: true,
              }
            }
          },
          orderBy: desc(draftApplications.createdAt),
        }
      }
    });

    if (!draft) {
      throw new CustomError('Draft not found', 404);
    }

    res.json({
      success: true,
      data: draft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new draft
// @route   POST /api/draft
// @access  Private
export const createDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = (req as any).user;
    
    // Validate input
    const validatedData = CreateDraftSchema.parse(req.body);

    // Create draft
    const [newDraft] = await db.insert(drafts).values({
      ...validatedData,
      organizerId: currentUser.id,
      currentApplications: 0,
    }).returning();

    // Get draft with relations
    const draftWithRelations = await db.query.drafts.findFirst({
      where: eq(drafts.id, newDraft.id),
      with: {
        organizer: {
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
      message: 'Draft created successfully',
      data: draftWithRelations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update draft
// @route   PUT /api/draft/:id
// @access  Private
export const updateDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;
    
    // Validate input
    const validatedData = UpdateDraftSchema.parse(req.body);

    // Check if draft exists
    const existingDraft = await db.query.drafts.findFirst({
      where: eq(drafts.id, id),
    });

    if (!existingDraft) {
      throw new CustomError('Draft not found', 404);
    }

    // Only organizer or admin can update draft
    if (existingDraft.organizerId !== currentUser.id && currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Update draft
    const [updatedDraft] = await db.update(drafts)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, id))
      .returning();

    res.json({
      success: true,
      message: 'Draft updated successfully',
      data: updatedDraft,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete draft
// @route   DELETE /api/draft/:id
// @access  Private
export const deleteDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const currentUser = (req as any).user;

    // Check if draft exists
    const existingDraft = await db.query.drafts.findFirst({
      where: eq(drafts.id, id),
    });

    if (!existingDraft) {
      throw new CustomError('Draft not found', 404);
    }

    // Only organizer or admin can delete draft
    if (existingDraft.organizerId !== currentUser.id && currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Check if draft has applications
    const applications = await db.query.draftApplications.findMany({
      where: eq(draftApplications.draftId, id),
    });

    if (applications.length > 0) {
      throw new CustomError('Cannot delete draft with applications', 400);
    }

    // Delete draft
    await db.delete(drafts).where(eq(drafts.id, id));

    res.json({
      success: true,
      message: 'Draft deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to draft
// @route   POST /api/draft/:id/apply
// @access  Private
export const applyToDraft = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: draftId } = req.params;
    const currentUser = (req as any).user;
    const { message, experience, availability } = req.body;

    // Check if draft exists and is open
    const draft = await db.query.drafts.findFirst({
      where: eq(drafts.id, draftId),
    });

    if (!draft) {
      throw new CustomError('Draft not found', 404);
    }

    if (draft.status !== 'open') {
      throw new CustomError('Draft is not accepting applications', 400);
    }

    // Check if user already applied
    const existingApplication = await db.query.draftApplications.findFirst({
      where: and(
        eq(draftApplications.draftId, draftId),
        eq(draftApplications.applicantId, currentUser.id)
      ),
    });

    if (existingApplication) {
      throw new CustomError('You have already applied to this draft', 400);
    }

    // Check if draft is full
    if (draft.maxApplications && draft.currentApplications >= draft.maxApplications) {
      throw new CustomError('Draft is full', 400);
    }

    // Create application
    await db.insert(draftApplications).values({
      draftId,
      applicantId: currentUser.id,
      message,
      experience,
      availability,
      status: 'pending',
    });

    // Update draft application count
    await db.update(drafts)
      .set({
        currentApplications: draft.currentApplications + 1,
        updatedAt: new Date(),
      })
      .where(eq(drafts.id, draftId));

    res.json({
      success: true,
      message: 'Application submitted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get draft applications
// @route   GET /api/draft/:id/applications
// @access  Private
export const getDraftApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: draftId } = req.params;
    const currentUser = (req as any).user;

    // Check if draft exists
    const draft = await db.query.drafts.findFirst({
      where: eq(drafts.id, draftId),
    });

    if (!draft) {
      throw new CustomError('Draft not found', 404);
    }

    // Only organizer or admin can view applications
    if (draft.organizerId !== currentUser.id && currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    const applications = await db.query.draftApplications.findMany({
      where: eq(draftApplications.draftId, draftId),
      with: {
        applicant: {
          columns: {
            id: true,
            username: true,
            avatar: true,
            country: true,
            bio: true,
          }
        }
      },
      orderBy: desc(draftApplications.createdAt),
    });

    res.json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/draft/:id/applications/:applicationId
// @access  Private
export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id: draftId, applicationId } = req.params;
    const { status, feedback } = req.body;
    const currentUser = (req as any).user;

    // Check if draft exists
    const draft = await db.query.drafts.findFirst({
      where: eq(drafts.id, draftId),
    });

    if (!draft) {
      throw new CustomError('Draft not found', 404);
    }

    // Only organizer or admin can update applications
    if (draft.organizerId !== currentUser.id && currentUser.role !== 'admin') {
      throw new CustomError('Access denied', 403);
    }

    // Check if application exists
    const application = await db.query.draftApplications.findFirst({
      where: eq(draftApplications.id, applicationId),
    });

    if (!application) {
      throw new CustomError('Application not found', 404);
    }

    // Update application status
    await db.update(draftApplications)
      .set({
        status,
        feedback,
        updatedAt: new Date(),
      })
      .where(eq(draftApplications.id, applicationId));

    res.json({
      success: true,
      message: 'Application status updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/draft/applications/my
// @access  Private
export const getMyApplications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const currentUser = (req as any).user;

    const myApplications = await db.query.draftApplications.findMany({
      where: eq(draftApplications.applicantId, currentUser.id),
      with: {
        draft: {
          columns: {
            id: true,
            title: true,
            status: true,
            country: true,
          },
          with: {
            organizer: {
              columns: {
                id: true,
                username: true,
                avatar: true,
              }
            }
          }
        }
      },
      orderBy: desc(draftApplications.createdAt),
    });

    res.json({
      success: true,
      data: myApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get drafts by status
// @route   GET /api/draft/status/:status
// @access  Public
export const getDraftsByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const draftsByStatus = await db.query.drafts.findMany({
      where: eq(drafts.status, status),
      with: {
        organizer: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: desc(drafts.createdAt),
      limit,
    });

    res.json({
      success: true,
      data: draftsByStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get drafts by country
// @route   GET /api/draft/country/:country
// @access  Public
export const getDraftsByCountry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { country } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const draftsByCountry = await db.query.drafts.findMany({
      where: eq(drafts.country, country),
      with: {
        organizer: {
          columns: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: desc(drafts.createdAt),
      limit,
    });

    res.json({
      success: true,
      data: draftsByCountry,
    });
  } catch (error) {
    next(error);
  }
}; 