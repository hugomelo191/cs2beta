import { Router } from 'express';
import { gameController } from '../controllers/gameController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.get('/live', gameController.getLiveGames);
router.get('/team/:teamId/stats', gameController.getTeamStats);
router.get('/player/steam/:steamId', gameController.getSteamPlayerStats);
router.get('/player/faceit/:faceitId', gameController.getFaceitPlayerStats);

// Rotas protegidas (apenas admins/moderadores)
router.put('/:gameId/score', protect, gameController.updateGameScore);

export default router; 