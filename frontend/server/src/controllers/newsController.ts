import { Request, Response, NextFunction } from 'express';
import { db } from '../db/connection.js';
import { news } from '../db/schema.js';
import { eq, desc, asc, like, and, or, sql } from 'drizzle-orm';
import { CustomError } from '../middleware/errorHandler.js';
import { CreateNewsSchema, UpdateNewsSchema } from '../types/index.js';
import { getQuery, getQueryInt, getParam, getBody } from '../utils/requestHelpers.js';

// @desc    Get all news
// @route   GET /api/news
// @access  Public
export const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = getQueryInt(req, 'page', 1);
    const limit = getQueryInt(req, 'limit', 10);
    const search = getQuery(req, 'search');
    const category = getQuery(req, 'category');
    const author = getQuery(req, 'author');
    const sortBy = getQuery(req, 'sortBy') || 'publishedAt';
    const sortOrder = getQuery(req, 'sortOrder') || 'desc';

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];
    
    if (search) {
      whereConditions.push(
        or(
          like(news.title, `%${search}%`),
          like(news.excerpt, `%${search}%`),
          like(news.content, `%${search}%`)
        )
      );
    }
    
    if (category) {
      whereConditions.push(eq(news.category, category));
    }

    if (author) {
      whereConditions.push(like(news.author, `%${author}%`));
    }

    // Only show published news
    whereConditions.push(eq(news.isPublished, true));

    // Get news with pagination - safe ordering
    let orderByClause;
    switch (sortBy) {
      case 'createdAt':
        orderByClause = sortOrder === 'desc' ? desc(news.createdAt) : asc(news.createdAt);
        break;
      case 'publishedAt':
        orderByClause = sortOrder === 'desc' ? desc(news.publishedAt) : asc(news.publishedAt);
        break;
      case 'views':
        orderByClause = sortOrder === 'desc' ? desc(news.views) : asc(news.views);
        break;
      case 'title':
        orderByClause = sortOrder === 'desc' ? desc(news.title) : asc(news.title);
        break;
      default:
        orderByClause = desc(news.createdAt);
    }

    const newsList = await db.query.news.findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: orderByClause,
      limit,
      offset,
    });

    // Get total count
    const totalCount = await db.select({ count: news.id })
      .from(news)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = totalCount.length;
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: newsList,
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

// @desc    Get single news article
// @route   GET /api/news/:id
// @access  Public
export const getNewsArticle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const newsArticle = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!newsArticle) {
      throw new CustomError('News article not found', 404);
    }

    // Check if article is published (unless admin)
    if (!newsArticle.isPublished && (req as any).user?.role !== 'admin') {
      throw new CustomError('News article not found', 404);
    }

    // Increment views
    await db.update(news)
      .set({
        views: (newsArticle.views || 0) + 1,
      } as any)
      .where(eq(news.id, id));

    res.json({
      success: true,
      data: {
        ...newsArticle,
        views: (newsArticle.views || 0) + 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new news article
// @route   POST /api/news
// @access  Private
export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const validatedData = CreateNewsSchema.parse(req.body);

    // Calculate read time if not provided
    let readTime = validatedData.readTime;
    if (!readTime) {
      const wordCount = validatedData.content.split(' ').length;
      readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute
    }

    // Create news article
    const [newNews] = await db.insert(news).values({
      ...validatedData,
      readTime,
      views: 0,
      publishedAt: validatedData.isPublished ? new Date() : null,
    } as any).returning();

    res.status(201).json({
      success: true,
      message: 'News article created successfully',
      data: newNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update news article
// @route   PUT /api/news/:id
// @access  Private
export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Validate input
    const validatedData = UpdateNewsSchema.parse(req.body);

    // Check if news article exists
    const existingNews = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!existingNews) {
      throw new CustomError('News article not found', 404);
    }

    // Calculate read time if content changed
    let readTime = validatedData.readTime;
    if (validatedData.content && !readTime) {
      const wordCount = validatedData.content.split(' ').length;
      readTime = Math.ceil(wordCount / 200);
    }

    // Update publishedAt if publishing for the first time
    let publishedAt = validatedData.publishedAt;
    if (validatedData.isPublished && !existingNews.isPublished && !publishedAt) {
      publishedAt = new Date();
    }

    // Update news article
    const [updatedNews] = await db.update(news)
      .set({
        ...validatedData,
        readTime,
        publishedAt,
        updatedAt: new Date(),
      } as any)
      .where(eq(news.id, id))
      .returning();

    res.json({
      success: true,
      message: 'News article updated successfully',
      data: updatedNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete news article
// @route   DELETE /api/news/:id
// @access  Private
export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if news article exists
    const existingNews = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!existingNews) {
      throw new CustomError('News article not found', 404);
    }

    // Delete news article
    await db.delete(news).where(eq(news.id, id));

    res.json({
      success: true,
      message: 'News article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured news
// @route   GET /api/news/featured
// @access  Public
export const getFeaturedNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = getQueryInt(req, 'limit', 6);

    const featuredNews = await db.query.news.findMany({
      where: and(
        eq(news.isFeatured, true),
        eq(news.isPublished, true)
      ),
      orderBy: desc(news.publishedAt),
      limit,
    });

    res.json({
      success: true,
      data: featuredNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
export const getNewsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const newsByCategory = await db.query.news.findMany({
      where: and(
        eq(news.category, category),
        eq(news.isPublished, true)
      ),
      orderBy: desc(news.publishedAt),
      limit,
    });

    res.json({
      success: true,
      data: newsByCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get news by author
// @route   GET /api/news/author/:author
// @access  Public
export const getNewsByAuthor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { author } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    const newsByAuthor = await db.query.news.findMany({
      where: and(
        like(news.author, `%${author}%`),
        eq(news.isPublished, true)
      ),
      orderBy: desc(news.publishedAt),
      limit,
    });

    res.json({
      success: true,
      data: newsByAuthor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get most viewed news
// @route   GET /api/news/most-viewed
// @access  Public
export const getMostViewedNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const mostViewedNews = await db.query.news.findMany({
      where: and(
        eq(news.isPublished, true),
        sql`${news.views} > 0`
      ),
      orderBy: desc(news.views),
      limit,
    });

    res.json({
      success: true,
      data: mostViewedNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get latest news
// @route   GET /api/news/latest
// @access  Public
export const getLatestNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;

    const latestNews = await db.query.news.findMany({
      where: eq(news.isPublished, true),
      orderBy: desc(news.publishedAt),
      limit,
    });

    res.json({
      success: true,
      data: latestNews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish news article
// @route   PUT /api/news/:id/publish
// @access  Private
export const publishNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if news article exists
    const existingNews = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!existingNews) {
      throw new CustomError('News article not found', 404);
    }

    // Publish news article
    await db.update(news)
      .set({
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      } as any)
      .where(eq(news.id, id));

    res.json({
      success: true,
      message: 'News article published successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unpublish news article
// @route   PUT /api/news/:id/unpublish
// @access  Private
export const unpublishNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check if news article exists
    const existingNews = await db.query.news.findFirst({
      where: eq(news.id, id),
    });

    if (!existingNews) {
      throw new CustomError('News article not found', 404);
    }

    // Unpublish news article
    await db.update(news)
      .set({
        isPublished: false,
        publishedAt: null,
        updatedAt: new Date(),
      } as any)
      .where(eq(news.id, id));

    res.json({
      success: true,
      message: 'News article unpublished successfully',
    });
  } catch (error) {
    next(error);
  }
}; 
