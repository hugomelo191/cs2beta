import { Router } from 'express';
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
  getPlayerHistory,
  getPlayerLiveMatches,
  syncPlayerFaceit
} from '../controllers/playerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getPlayers);
router.get('/featured', getFeaturedPlayers);
router.get('/team/:teamId', getPlayersByTeam);
router.get('/position/:position', getPlayersByPosition);
router.get('/:id', getPlayer);

// 🔥 NOVAS ROTAS - Faceit Integration
router.get('/:id/history', getPlayerHistory);
router.get('/:id/live', getPlayerLiveMatches);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createPlayer);
router.put('/:id', protect, authorize('admin', 'moderator'), updatePlayer);
router.delete('/:id', protect, authorize('admin', 'moderator'), deletePlayer);

// Stats management
router.put('/:id/stats', protect, authorize('admin', 'moderator'), updatePlayerStats);

// 🔥 NOVA ROTA - Sincronizar Faceit (apenas admins)
router.post('/:id/sync-faceit', protect, authorize('admin', 'moderator'), syncPlayerFaceit);

export default router; 