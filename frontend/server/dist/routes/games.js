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
// 🔥 NOVAS ROTAS - Resultados FILTRADOS (apenas equipas registadas)
router.get('/matches/live', gameController.getLiveMatches);
router.get('/matches/recent', gameController.getRecentMatches);
router.get('/matches/history', gameController.getRegisteredTeamsHistory);
router.get('/matches/:matchId', gameController.getMatchDetails);
router.get('/matches/:matchId/stats', gameController.getMatchStats);
// 🔥 EQUIPAS REGISTADAS
router.get('/teams/registered', gameController.getRegisteredTeams);
router.get('/teams/registered/:teamId/stats', gameController.getRegisteredTeamStats);
// 🔥 RANKINGS PORTUGUESES (baseado em equipas registadas)
router.get('/rankings/portugal', gameController.getPortugueseRankings);
export default router;
//# sourceMappingURL=games.js.map