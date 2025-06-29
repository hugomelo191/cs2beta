import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  adminUpdateUser,
  adminChangePassword,
  getUserStats,
  toggleUserStatus,
  getUsersByRole,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/role/:role', protect, authorize('admin'), getUsersByRole);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);
router.put('/:id/admin-update', protect, authorize('admin'), adminUpdateUser);
router.put('/:id/change-password', protect, authorize('admin'), adminChangePassword);
router.put('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);

// Public routes
router.get('/:id/profile', getUserProfile);
router.get('/:id/stats', getUserStats);

export default router; 