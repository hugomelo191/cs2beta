import express from 'express';
import { protect } from '../middleware/auth.js';
import { createDraftPost, getDraftPosts, getDraftPost, deleteDraftPost, getDraftPostStats } from '../controllers/draftPostController.js';
const router = express.Router();
// Public routes
router.get('/', getDraftPosts);
router.get('/stats', getDraftPostStats);
router.get('/:id', getDraftPost);
// Protected routes (require authentication)
router.post('/', protect, createDraftPost);
router.delete('/:id', protect, deleteDraftPost);
export default router;
//# sourceMappingURL=draftPosts.js.map