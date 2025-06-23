import express from 'express';
import {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament,
  getFeaturedTournaments,
  getUpcomingTournaments,
  getOngoingTournaments,
  registerTeamForTournament,
  getTournamentParticipants,
  updateParticipantStatus,
  getTournamentsByStatus,
} from '../controllers/tournamentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getTournaments);
router.get('/featured', getFeaturedTournaments);
router.get('/upcoming', getUpcomingTournaments);
router.get('/ongoing', getOngoingTournaments);
router.get('/status/:status', getTournamentsByStatus);
router.get('/:id', getTournament);
router.get('/:id/participants', getTournamentParticipants);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createTournament);
router.put('/:id', protect, authorize('admin', 'moderator'), updateTournament);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteTournament);

// Tournament registration
router.post('/:id/register', protect, registerTeamForTournament);
router.put('/:id/participants/:participantId', protect, authorize('admin', 'moderator'), updateParticipantStatus);

export default router; 