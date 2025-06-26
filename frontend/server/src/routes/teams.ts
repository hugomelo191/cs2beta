import express from 'express';
import {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
  getFeaturedTeams,
  createMyTeam,
  leaveTeam,
} from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTeams);
router.get('/featured', getFeaturedTeams);
router.get('/:id', getTeam);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createTeam);
router.put('/:id', protect, authorize('admin', 'moderator'), updateTeam);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteTeam);

// Team player management
router.post('/:id/players', protect, authorize('admin', 'moderator'), addPlayerToTeam);
router.delete('/:id/players/:playerId', protect, authorize('admin', 'moderator'), removePlayerFromTeam);

// Player team management (for regular users)
router.post('/create-my-team', protect, createMyTeam);
router.post('/leave', protect, leaveTeam);

export default router; 