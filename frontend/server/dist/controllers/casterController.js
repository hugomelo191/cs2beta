import { db } from '../db/connection.js';
import { casters } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateCasterSchema, UpdateCasterSchema } from '../types/index.js';
// @desc    Get all casters
// @route   GET /api/casters
// @access  Public
export const getCasters = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search;
        const type = req.query.type;
        const country = req.query.country;
        const isLive = req.query.isLive;
        const sortBy = req.query.sortBy || 'followers';
        const sortOrder = req.query.sortOrder || 'desc';
        const offset = (page - 1) * limit;
        // Build where conditions
        const whereConditions = [];
        if (search) {
            whereConditions.push(or(like(casters.name, `%${search}%`), like(casters.specialty, `%${search}%`), like(casters.bio, `%${search}%`)));
        }
        if (type) {
            whereConditions.push(eq(casters.type, type));
        }
        if (country) {
            whereConditions.push(eq(casters.country, country));
        }
        if (isLive !== undefined) {
            whereConditions.push(eq(casters.isLive, isLive === 'true'));
        }
        // Get casters with pagination
        let orderByClause;
        switch (sortBy) {
            case 'name':
                orderByClause = sortOrder === 'desc' ? desc(casters.name) : asc(casters.name);
                break;
            case 'rating':
                orderByClause = sortOrder === 'desc' ? desc(casters.rating) : asc(casters.rating);
                break;
            case 'followers':
                orderByClause = sortOrder === 'desc' ? desc(casters.followers) : asc(casters.followers);
                break;
            case 'views':
                orderByClause = sortOrder === 'desc' ? desc(casters.views) : asc(casters.views);
                break;
            default:
                orderByClause = sortOrder === 'desc' ? desc(casters.createdAt) : asc(casters.createdAt);
        }
        const castersList = await db.query.casters.findMany({
            where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
            orderBy: orderByClause,
            limit,
            offset,
        });
        // Get total count
        const totalCount = await db.select({ count: sql `count(*)`.as('count') })
            .from(casters)
            .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
        const total = Number(totalCount[0]?.count) || 0;
        const totalPages = Math.ceil(total / limit);
        res.json({
            success: true,
            data: castersList,
            pagination: {
                page,
                limit,
                total,
                totalPages,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get single caster
// @route   GET /api/casters/:id
// @access  Public
export const getCaster = async (req, res, next) => {
    try {
        const { id } = req.params;
        const caster = await db.query.casters.findFirst({
            where: eq(casters.id, id),
        });
        if (!caster) {
            throw new CustomError('Caster not found', 404);
        }
        // Increment views
        await db.update(casters)
            .set({
            views: (caster.views || 0) + 1,
        })
            .where(eq(casters.id, id));
        res.json({
            success: true,
            data: {
                ...caster,
                views: (caster.views || 0) + 1,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Create new caster
// @route   POST /api/casters
// @access  Private
export const createCaster = async (req, res, next) => {
    try {
        // Validate input
        const validatedData = CreateCasterSchema.parse(req.body);
        // Create caster
        const [newCaster] = await db.insert(casters).values({
            ...validatedData,
            views: 0,
            rating: 0,
            totalRatings: 0,
        }).returning();
        res.status(201).json({
            success: true,
            message: 'Caster created successfully',
            data: newCaster,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Update caster
// @route   PUT /api/casters/:id
// @access  Private
export const updateCaster = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Validate input
        const validatedData = UpdateCasterSchema.parse(req.body);
        // Check if caster exists
        const existingCaster = await db.query.casters.findFirst({
            where: eq(casters.id, id),
        });
        if (!existingCaster) {
            throw new CustomError('Caster not found', 404);
        }
        // Update caster
        const [updatedCaster] = await db.update(casters)
            .set({
            ...validatedData,
            updatedAt: new Date(),
        })
            .where(eq(casters.id, id))
            .returning();
        res.json({
            success: true,
            message: 'Caster updated successfully',
            data: updatedCaster,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Delete caster
// @route   DELETE /api/casters/:id
// @access  Private
export const deleteCaster = async (req, res, next) => {
    try {
        const { id } = req.params;
        // Check if caster exists
        const existingCaster = await db.query.casters.findFirst({
            where: eq(casters.id, id),
        });
        if (!existingCaster) {
            throw new CustomError('Caster not found', 404);
        }
        // Delete caster
        await db.delete(casters).where(eq(casters.id, id));
        res.json({
            success: true,
            message: 'Caster deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get live casters
// @route   GET /api/casters/live
// @access  Public
export const getLiveCasters = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const liveCasters = await db.query.casters.findMany({
            where: and(eq(casters.isLive, true), sql `${casters.currentGame} IS NOT NULL`),
            orderBy: desc(casters.followers),
            limit,
        });
        res.json({
            success: true,
            data: liveCasters,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get casters by type
// @route   GET /api/casters/type/:type
// @access  Public
export const getCastersByType = async (req, res, next) => {
    try {
        const { type } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const castersByType = await db.query.casters.findMany({
            where: eq(casters.type, type),
            orderBy: desc(casters.followers),
            limit,
        });
        res.json({
            success: true,
            data: castersByType,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get top rated casters
// @route   GET /api/casters/top-rated
// @access  Public
export const getTopRatedCasters = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const topRatedCasters = await db.query.casters.findMany({
            where: and(sql `${casters.rating} > 0`, sql `${casters.totalRatings} >= 5`),
            orderBy: desc(casters.rating),
            limit,
        });
        res.json({
            success: true,
            data: topRatedCasters,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Update caster live status
// @route   PUT /api/casters/:id/live
// @access  Private
export const updateLiveStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isLive, currentGame } = req.body;
        // Check if caster exists
        const existingCaster = await db.query.casters.findFirst({
            where: eq(casters.id, id),
        });
        if (!existingCaster) {
            throw new CustomError('Caster not found', 404);
        }
        // Update live status
        await db.update(casters)
            .set({
            isLive,
            currentGame: isLive ? currentGame : null,
            updatedAt: new Date(),
        })
            .where(eq(casters.id, id));
        res.json({
            success: true,
            message: 'Live status updated successfully',
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Rate a caster
// @route   POST /api/casters/:id/rate
// @access  Private
export const rateCaster = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const currentUser = req.user;
        if (!rating || rating < 1 || rating > 5) {
            throw new CustomError('Rating must be between 1 and 5', 400);
        }
        // Check if caster exists
        const existingCaster = await db.query.casters.findFirst({
            where: eq(casters.id, id),
        });
        if (!existingCaster) {
            throw new CustomError('Caster not found', 404);
        }
        // Calculate new average rating
        const currentRating = existingCaster.rating || 0;
        const currentTotalRatings = existingCaster.totalRatings || 0;
        const newTotalRatings = currentTotalRatings + 1;
        const newRating = ((currentRating * currentTotalRatings) + rating) / newTotalRatings;
        // Update caster rating
        await db.update(casters)
            .set({
            rating: newRating,
            totalRatings: newTotalRatings,
            updatedAt: new Date(),
        })
            .where(eq(casters.id, id));
        res.json({
            success: true,
            message: 'Rating submitted successfully',
            data: {
                newRating,
                totalRatings: newTotalRatings,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get casters by country
// @route   GET /api/casters/country/:country
// @access  Public
export const getCastersByCountry = async (req, res, next) => {
    try {
        const { country } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const castersByCountry = await db.query.casters.findMany({
            where: eq(casters.country, country),
            orderBy: desc(casters.followers),
            limit,
        });
        res.json({
            success: true,
            data: castersByCountry,
        });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Search casters by specialty
// @route   GET /api/casters/specialty/:specialty
// @access  Public
export const getCastersBySpecialty = async (req, res, next) => {
    try {
        const { specialty } = req.params;
        const limit = parseInt(req.query.limit) || 10;
        const castersBySpecialty = await db.query.casters.findMany({
            where: like(casters.specialty, `%${specialty}%`),
            orderBy: desc(casters.rating),
            limit,
        });
        res.json({
            success: true,
            data: castersBySpecialty,
        });
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=casterController.js.map