import express from 'express';
import {
  getCasters,
  getCaster,
  createCaster,
  updateCaster,
  deleteCaster,
  getLiveCasters,
  getCastersByType,
  getTopRatedCasters,
  updateLiveStatus,
  rateCaster,
  getCastersByCountry,
  getCastersBySpecialty,
} from '../controllers/casterController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getCasters);
router.get('/live', getLiveCasters);
router.get('/top-rated', getTopRatedCasters);
router.get('/type/:type', getCastersByType);
router.get('/country/:country', getCastersByCountry);
router.get('/specialty/:specialty', getCastersBySpecialty);
router.get('/:id', getCaster);

// Protected routes
router.post('/', protect, authorize('admin', 'moderator'), createCaster);
router.put('/:id', protect, authorize('admin', 'moderator'), updateCaster);
router.delete('/:id', protect, authorize('admin', 'moderator'), deleteCaster);

// Live status and rating
router.put('/:id/live', protect, updateLiveStatus);
router.post('/:id/rate', protect, rateCaster);

export default router; 