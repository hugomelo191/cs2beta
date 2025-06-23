import express from 'express';
import {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getFeaturedPlayers,
  getPlayersByTeam,
  updatePlayerStats,
  getPlayersByPosition,
} from '../controllers/playerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getPlayers);
router.get('/featured', getFeaturedPlayers);
router.get('/team/:teamId', getPlayersByTeam);
router.get('/position/:position', getPlayersByPosition);
router.get('/:id', getPlayer);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createPlayer);
router.put('/:id', protect, authorize('admin', 'moderator'), updatePlayer);
router.delete('/:id', protect, authorize('admin', 'moderator'), deletePlayer);

// Stats management
router.put('/:id/stats', protect, authorize('admin', 'moderator'), updatePlayerStats);

export default router; 