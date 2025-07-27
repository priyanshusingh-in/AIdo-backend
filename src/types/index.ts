// AI Response Types
export interface AIResponse {
  success: boolean;
  data: ScheduleData | null;
  error?: string;
}

export interface ScheduleData {
  type: 'meeting' | 'reminder' | 'task' | 'appointment';
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: number; // in minutes
  participants?: string[];
  location?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  metadata?: Record<string, any>;
}

// Request Types
export interface ScheduleRequest {
  prompt: string;
  userId?: string;
}

// Database Types
export interface ScheduleDocument extends ScheduleData {
  _id: string;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
  aiPrompt: string;
  aiResponse: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Error Types
export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
}

// Auth Types
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Environment Variables
export interface EnvironmentVariables {
  PORT: number;
  NODE_ENV: string;
  MONGODB_URI: string;
  GEMINI_API_KEY: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  RATE_LIMIT_WINDOW_MS: number;
  RATE_LIMIT_MAX_REQUESTS: number;
  LOG_LEVEL: string;
} 