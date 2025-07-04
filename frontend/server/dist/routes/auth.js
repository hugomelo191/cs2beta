import express from 'express';
import { register, login, getMe, updateProfile, changePassword, logout, } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();
// Public routes
router.post('/register', register);
router.post('/login', login);
// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logout);
export default router;
//# sourceMappingURL=auth.js.map