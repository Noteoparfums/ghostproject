import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { authController } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.js';
import { 
  signupSchema, 
  loginSchema, 
  verifyEmailSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema 
} from '@ghostwriter/shared';
import { rateLimits } from '../middleware/rateLimit.js';

const router = Router();

router.post('/signup', rateLimits.auth, validate({ body: signupSchema }), asyncHandler(authController.signup));
router.post('/login', rateLimits.auth, validate({ body: loginSchema }), asyncHandler(authController.login));
router.post('/refresh', rateLimits.auth, asyncHandler(authController.refresh));
router.post('/logout', requireAuth, asyncHandler(authController.logout));
router.post('/verify-email', rateLimits.auth, validate({ body: verifyEmailSchema }), asyncHandler(authController.verifyEmail));
router.post('/forgot-password', rateLimits.auth, validate({ body: forgotPasswordSchema }), asyncHandler(authController.forgotPassword));
router.post('/reset-password', rateLimits.auth, validate({ body: resetPasswordSchema }), asyncHandler(authController.resetPassword));

export default router;
