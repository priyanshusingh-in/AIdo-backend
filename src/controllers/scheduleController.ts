import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { geminiService } from '../services/geminiService';
import { scheduleService } from '../services/scheduleService';
import { logger } from '../utils/logger';
import { ApiResponse } from '../types';

export class ScheduleController {
  // Validation rules for creating a schedule
  public static validateCreateSchedule = [
    body('prompt')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Prompt must be between 1 and 1000 characters')
      .escape(),
    body('userId')
      .optional()
      .isString()
      .withMessage('User ID must be a string')
  ];

  // Create a new schedule from natural language prompt
  public static async createSchedule(req: Request, res: Response): Promise<void> {
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

      const { prompt, userId } = req.body;

      logger.info('Received schedule creation request', { 
        prompt: prompt.substring(0, 100) + '...', 
        userId 
      });

      // Process the prompt with Gemini AI
      const aiResponse = await geminiService.processSchedulePrompt(prompt);

      if (!aiResponse.success || !aiResponse.data) {
        res.status(400).json({
          success: false,
          error: aiResponse.error || 'Failed to process schedule prompt'
        });
        return;
      }

      // Save the schedule to database
      const scheduleResult = await scheduleService.createSchedule(
        aiResponse.data,
        prompt,
        JSON.stringify(aiResponse.data),
        userId
      );

      if (!scheduleResult.success) {
        res.status(500).json({
          success: false,
          error: scheduleResult.error || 'Failed to create schedule'
        });
        return;
      }

      res.status(201).json({
        success: true,
        data: scheduleResult.data,
        message: 'Schedule created successfully'
      });

    } catch (error) {
      logger.error('Error in createSchedule controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get all schedules with pagination
  public static async getSchedules(req: Request, res: Response): Promise<void> {
    try {
      const { userId, limit = 50, offset = 0 } = req.query;

      const result = await scheduleService.getSchedules(
        userId as string,
        parseInt(limit as string),
        parseInt(offset as string)
      );

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to fetch schedules'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in getSchedules controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get a specific schedule by ID
  public static async getScheduleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const result = await scheduleService.getScheduleById(id, userId as string);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error || 'Schedule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in getScheduleById controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Update a schedule
  public static async updateSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const updateData = req.body;

      const result = await scheduleService.updateSchedule(id, updateData, userId as string);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error || 'Schedule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in updateSchedule controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Delete a schedule
  public static async deleteSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { userId } = req.query;

      const result = await scheduleService.deleteSchedule(id, userId as string);

      if (!result.success) {
        res.status(404).json({
          success: false,
          error: result.error || 'Schedule not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in deleteSchedule controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get schedules by date range
  public static async getSchedulesByDateRange(req: Request, res: Response): Promise<void> {
    try {
      const { startDate, endDate, userId } = req.query;

      if (!startDate || !endDate) {
        res.status(400).json({
          success: false,
          error: 'Start date and end date are required'
        });
        return;
      }

      const result = await scheduleService.getSchedulesByDateRange(
        startDate as string,
        endDate as string,
        userId as string
      );

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to fetch schedules by date range'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in getSchedulesByDateRange controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  // Get schedules by type
  public static async getSchedulesByType(req: Request, res: Response): Promise<void> {
    try {
      const { type } = req.params;
      const { userId } = req.query;

      const result = await scheduleService.getSchedulesByType(type, userId as string);

      if (!result.success) {
        res.status(500).json({
          success: false,
          error: result.error || 'Failed to fetch schedules by type'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: result.data,
        message: result.message
      });

    } catch (error) {
      logger.error('Error in getSchedulesByType controller:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 