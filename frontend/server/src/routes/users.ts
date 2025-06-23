import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
  changePassword,
  getUserStats,
  verifyUser,
  getUsersByRole,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Profile routes (user's own profile)
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/password', changePassword);

// User management routes
router.get('/', authorize('admin', 'moderator'), getUsers);
router.get('/role/:role', authorize('admin', 'moderator'), getUsersByRole);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin'), deleteUser);
router.put('/:id/verify', authorize('admin'), verifyUser);

// Statistics
router.get('/:id/stats', getUserStats);

export default router; 