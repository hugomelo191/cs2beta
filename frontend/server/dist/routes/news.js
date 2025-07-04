import express from 'express';
import { getNews, getNewsArticle, createNews, updateNews, deleteNews, getFeaturedNews, getNewsByCategory, getNewsByAuthor, getMostViewedNews, getLatestNews, publishNews, unpublishNews, } from '../controllers/newsController.js';
import { protect, authorize } from '../middleware/auth.js';
const router = express.Router();
// Public routes
router.get('/', getNews);
router.get('/featured', getFeaturedNews);
router.get('/latest', getLatestNews);
router.get('/most-viewed', getMostViewedNews);
router.get('/category/:category', getNewsByCategory);
router.get('/author/:author', getNewsByAuthor);
router.get('/:id', getNewsArticle);
// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createNews);
router.put('/:id', protect, authorize('admin', 'moderator'), updateNews);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteNews);
// Publishing routes
router.put('/:id/publish', protect, authorize('admin', 'moderator'), publishNews);
router.put('/:id/unpublish', protect, authorize('admin', 'moderator'), unpublishNews);
export default router;
//# sourceMappingURL=news.js.map