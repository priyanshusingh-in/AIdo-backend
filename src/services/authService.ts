import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

export interface AuthData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
  };
  token: string;
}

export class AuthService {
  private static generateToken(userId: string): string {
    const secret = process.env['JWT_SECRET'];
    const expiresIn = process.env['JWT_EXPIRES_IN'] || '7d';
    
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not defined');
    }

    return jwt.sign({ userId }, secret, { expiresIn });
  }

  public static async registerUser(authData: AuthData): Promise<ApiResponse<AuthResponse>> {
    try {
      logger.info('Attempting to register new user', { email: authData.email });

      // Check if user already exists
      const existingUser = await User.findOne({ email: authData.email.toLowerCase() });
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Create new user
      const user = new User({
        email: authData.email.toLowerCase(),
        password: authData.password,
        firstName: authData.firstName,
        lastName: authData.lastName
      });

      const savedUser = await user.save();

      // Generate JWT token
      const token = this.generateToken(savedUser._id.toString());

      logger.info('User registered successfully', { userId: savedUser._id.toString() });

      return {
        success: true,
        data: {
          user: {
            id: savedUser._id.toString(),
            email: savedUser.email,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            isActive: savedUser.isActive
          },
          token
        },
        message: 'User registered successfully'
      };

    } catch (error) {
      logger.error('Error registering user:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to register user'
      };
    }
  }

  public static async loginUser(loginData: LoginData): Promise<ApiResponse<AuthResponse>> {
    try {
      logger.info('Attempting user login', { email: loginData.email });

      // Find user by email
      const user = await User.findOne({ email: loginData.email.toLowerCase() });
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          success: false,
          error: 'Account is deactivated'
        };
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(loginData.password);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user._id.toString());

      logger.info('User logged in successfully', { userId: user._id.toString() });

      return {
        success: true,
        data: {
          user: {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActive: user.isActive
          },
          token
        },
        message: 'Login successful'
      };

    } catch (error) {
      logger.error('Error during login:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to login'
      };
    }
  }

  public static async getUserById(userId: string): Promise<ApiResponse<IUser>> {
    try {
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        data: user
      };

    } catch (error) {
      logger.error('Error fetching user:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch user'
      };
    }
  }

  public static verifyToken(token: string): { userId: string } | null {
    try {
      const secret = process.env['JWT_SECRET'];
      
      if (!secret) {
        throw new Error('JWT_SECRET environment variable is not defined');
      }

      const decoded = jwt.verify(token, secret) as { userId: string };
      return decoded;
    } catch (error) {
      logger.error('Token verification failed:', error);
      return null;
    }
  }
} 