import { Router } from 'express';
import { ScheduleController } from '../controllers/scheduleController';

const router = Router();

// Create a new schedule from natural language prompt
router.post(
  '/',
  ScheduleController.validateCreateSchedule,
  ScheduleController.createSchedule
);

// Get all schedules with pagination
router.get('/', ScheduleController.getSchedules);

// Get schedules by date range
router.get('/date-range', ScheduleController.getSchedulesByDateRange);

// Get schedules by type
router.get('/type/:type', ScheduleController.getSchedulesByType);

// Get a specific schedule by ID
router.get('/:id', ScheduleController.getScheduleById);

// Update a schedule
router.put('/:id', ScheduleController.updateSchedule);

// Delete a schedule
router.delete('/:id', ScheduleController.deleteSchedule);

export default router; 