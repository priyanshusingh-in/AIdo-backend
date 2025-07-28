import { Schedule, ISchedule } from '../models/Schedule';
import { ScheduleData, ApiResponse } from '../types';
import { logger } from '../utils/logger';

export class ScheduleService {
  public async createSchedule(
    scheduleData: ScheduleData, 
    aiPrompt: string, 
    aiResponse: string, 
    userId?: string
  ): Promise<ApiResponse<ISchedule>> {
    try {
      logger.info('Creating new schedule', { 
        type: scheduleData.type, 
        title: scheduleData.title,
        userId 
      });

      const schedule = new Schedule({
        ...scheduleData,
        userId,
        aiPrompt,
        aiResponse
      });

      const savedSchedule = await schedule.save();

      logger.info('Schedule created successfully', { 
        scheduleId: savedSchedule._id 
      });

      return {
        success: true,
        data: savedSchedule,
        message: 'Schedule created successfully'
      };

    } catch (error) {
      logger.error('Error creating schedule:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create schedule'
      };
    }
  }

  public async getSchedules(userId?: string, limit = 50, offset = 0): Promise<ApiResponse<ISchedule[]>> {
    try {
      logger.info('Fetching schedules', { userId, limit, offset });

      const query = userId ? { userId } : {};
      
      const schedules = await Schedule.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset)
        .lean();

      const total = await Schedule.countDocuments(query);

      logger.info('Schedules fetched successfully', { 
        count: schedules.length, 
        total 
      });

      return {
        success: true,
        data: schedules,
        message: `Found ${schedules.length} schedules`
      };

    } catch (error) {
      logger.error('Error fetching schedules:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schedules'
      };
    }
  }

  public async getScheduleById(scheduleId: string, userId?: string): Promise<ApiResponse<ISchedule>> {
    try {
      logger.info('Fetching schedule by ID', { scheduleId, userId });

      const query: any = { _id: scheduleId };
      if (userId) {
        query.userId = userId;
      }

      const schedule = await Schedule.findOne(query).lean();

      if (!schedule) {
        logger.warn('Schedule not found', { scheduleId });
        return {
          success: false,
          error: 'Schedule not found'
        };
      }

      logger.info('Schedule fetched successfully', { scheduleId });

      return {
        success: true,
        data: schedule,
        message: 'Schedule found'
      };

    } catch (error) {
      logger.error('Error fetching schedule by ID:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schedule'
      };
    }
  }

  public async updateSchedule(
    scheduleId: string, 
    updateData: Partial<ScheduleData>, 
    userId?: string
  ): Promise<ApiResponse<ISchedule>> {
    try {
      logger.info('Updating schedule', { scheduleId, userId });

      const query: any = { _id: scheduleId };
      if (userId) {
        query.userId = userId;
      }

      const schedule = await Schedule.findOneAndUpdate(
        query,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!schedule) {
        logger.warn('Schedule not found for update', { scheduleId });
        return {
          success: false,
          error: 'Schedule not found'
        };
      }

      logger.info('Schedule updated successfully', { scheduleId });

      return {
        success: true,
        data: schedule,
        message: 'Schedule updated successfully'
      };

    } catch (error) {
      logger.error('Error updating schedule:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update schedule'
      };
    }
  }

  public async deleteSchedule(scheduleId: string, userId?: string): Promise<ApiResponse<void>> {
    try {
      logger.info('Deleting schedule', { scheduleId, userId });

      const query: any = { _id: scheduleId };
      if (userId) {
        query.userId = userId;
      }

      const result = await Schedule.findOneAndDelete(query);

      if (!result) {
        logger.warn('Schedule not found for deletion', { scheduleId });
        return {
          success: false,
          error: 'Schedule not found'
        };
      }

      logger.info('Schedule deleted successfully', { scheduleId });

      return {
        success: true,
        message: 'Schedule deleted successfully'
      };

    } catch (error) {
      logger.error('Error deleting schedule:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete schedule'
      };
    }
  }

  public async getSchedulesByDateRange(
    startDate: string, 
    endDate: string, 
    userId?: string
  ): Promise<ApiResponse<ISchedule[]>> {
    try {
      logger.info('Fetching schedules by date range', { startDate, endDate, userId });

      const query: any = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };

      if (userId) {
        query.userId = userId;
      }

      const schedules = await Schedule.find(query)
        .sort({ date: 1, time: 1 })
        .lean();

      logger.info('Schedules fetched by date range successfully', { 
        count: schedules.length 
      });

      return {
        success: true,
        data: schedules,
        message: `Found ${schedules.length} schedules in date range`
      };

    } catch (error) {
      logger.error('Error fetching schedules by date range:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schedules by date range'
      };
    }
  }

  public async getSchedulesByType(
    type: string, 
    userId?: string
  ): Promise<ApiResponse<ISchedule[]>> {
    try {
      logger.info('Fetching schedules by type', { type, userId });

      const query: any = { type };
      if (userId) {
        query.userId = userId;
      }

      const schedules = await Schedule.find(query)
        .sort({ date: 1, time: 1 })
        .lean();

      logger.info('Schedules fetched by type successfully', { 
        type, 
        count: schedules.length 
      });

      return {
        success: true,
        data: schedules,
        message: `Found ${schedules.length} ${type} schedules`
      };

    } catch (error) {
      logger.error('Error fetching schedules by type:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch schedules by type'
      };
    }
  }
}

export const scheduleService = new ScheduleService(); 