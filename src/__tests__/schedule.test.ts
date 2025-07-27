import { ScheduleController } from '../controllers/scheduleController';
import { scheduleService } from '../services/scheduleService';
import { getGeminiService } from '../services/geminiService';

// Mock the services
jest.mock('../services/scheduleService');
jest.mock('../services/geminiService', () => ({
  getGeminiService: jest.fn()
}));

describe('ScheduleController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createSchedule', () => {
    it('should create a schedule successfully', async () => {
      const mockRequest = {
        body: {
          prompt: 'Schedule a meeting with John next Tuesday at 10 AM',
          userId: 'user123'
        }
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any;

      const mockAIResponse = {
        success: true,
        data: {
          type: 'meeting',
          title: 'Meeting with John',
          date: '2024-01-16',
          time: '10:00',
          participants: ['John']
        }
      };

      const mockScheduleResponse = {
        success: true,
        data: {
          _id: 'schedule123',
          ...mockAIResponse.data
        },
        message: 'Schedule created successfully'
      };

      const mockGeminiService = {
        processSchedulePrompt: jest.fn().mockResolvedValue(mockAIResponse)
      };
      (getGeminiService as jest.Mock).mockReturnValue(mockGeminiService);
      (scheduleService.createSchedule as jest.Mock).mockResolvedValue(mockScheduleResponse);

      await ScheduleController.createSchedule(mockRequest, mockResponse);

      expect(mockGeminiService.processSchedulePrompt).toHaveBeenCalledWith('Schedule a meeting with John next Tuesday at 10 AM');
      expect(scheduleService.createSchedule).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockScheduleResponse.data,
        message: 'Schedule created successfully'
      });
    });
  });
}); 