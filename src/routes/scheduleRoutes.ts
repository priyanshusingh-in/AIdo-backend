import { Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';
import { authenticateToken, optionalAuth } from '../middleware/authMiddleware';

const router = Router();

// Create a new schedule from natural language prompt
router.post(
  '/',
  optionalAuth, // Allow both authenticated and unauthenticated users
  ScheduleController.validateCreateSchedule,
  ScheduleController.createSchedule
);

// Get all schedules with pagination
router.get('/', authenticateToken, ScheduleController.getSchedules);

// Get schedules by date range
router.get('/date-range', authenticateToken, ScheduleController.getSchedulesByDateRange);

// Get schedules by type
router.get('/type/:type', authenticateToken, ScheduleController.getSchedulesByType);

// Get a specific schedule by ID
router.get('/:id', authenticateToken, ScheduleController.getScheduleById);

// Update a schedule
router.put('/:id', authenticateToken, ScheduleController.updateSchedule);

// Delete a schedule
router.delete('/:id', authenticateToken, ScheduleController.deleteSchedule);

export default router; 