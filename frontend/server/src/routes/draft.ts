import express from 'express';
import {
  getDrafts,
  getDraft,
  createDraft,
  updateDraft,
  deleteDraft,
  applyToDraft,
  getDraftApplications,
  updateApplicationStatus,
  getMyApplications,
  getDraftsByStatus,
  getDraftsByCountry,
} from '../controllers/draftController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getDrafts);
router.get('/status/:status', getDraftsByStatus);
router.get('/country/:country', getDraftsByCountry);
router.get('/:id', getDraft);

// Protected routes
router.post('/', protect, createDraft);
router.put('/:id', protect, updateDraft);
router.delete('/:id', protect, deleteDraft);

// Application routes
router.post('/:id/apply', protect, applyToDraft);
router.get('/:id/applications', protect, getDraftApplications);
router.put('/:id/applications/:applicationId', protect, updateApplicationStatus);
router.get('/applications/my', protect, getMyApplications);

export default router; 