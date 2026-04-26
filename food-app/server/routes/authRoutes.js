import express from 'express';
import { body } from 'express-validator';
import {
  register,
  requestLoginOtp,
  resendOtp,
  verifyOtp,
  refreshAccessToken,
  getCurrentUser,
  logout,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post(
  '/register',
  authLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  register
);
router.post(
  '/login/request-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  requestLoginOtp
);
router.post(
  '/verify-otp',
  authLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ],
  verifyOtp
);
router.post('/resend-otp', authLimiter, resendOtp);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getCurrentUser);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
