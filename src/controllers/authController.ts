import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { AuthService, AuthData, LoginData } from '../services/authService';
import { logger } from '../utils/logger';

export class AuthController {
  // Validation rules for user registration
  public static validateRegister = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters')
      .escape(),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters')
      .escape()
  ];

  // Validation rules for user login
  public static validateLogin = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

  // Register a new user
  public static async register(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password, firstName, lastName } = req.body;

      logger.info('Received user registration request', { email });

      const authData: AuthData = {
        email,
        password,
        firstName,
        lastName
      };

      const result = await AuthService.registerUser(authData);

      if (!result.success) {
        res.status(400).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in register controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Login user
  public static async login(req: Request, res: Response): Promise<void> {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array()
        });
        return;
      }

      const { email, password } = req.body;

      logger.info('Received user login request', { email });

      const loginData: LoginData = {
        email,
        password
      };

      const result = await AuthService.loginUser(loginData);

      if (!result.success) {
        res.status(401).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in login controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get current user profile
  public static async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated'
        });
        return;
      }

      const result = await AuthService.getUserById(userId);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data
      });

    } catch (error) {
      logger.error('Error in getProfile controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 