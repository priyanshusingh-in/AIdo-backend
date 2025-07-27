import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// Register a new user
router.post(
  '/register',
  AuthController.validateRegister,
  AuthController.register
);

// Login user
router.post(
  '/login',
  AuthController.validateLogin,
  AuthController.login
);

// Get current user profile (protected route)
router.get(
  '/profile',
  authenticateToken,
  AuthController.getProfile
);

export default router; 