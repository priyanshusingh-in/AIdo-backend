import mongoose, { Document, Schema } from 'mongoose';
import { ScheduleData } from '../types';

export interface ISchedule extends Document, ScheduleData {
  userId?: string;
  aiPrompt: string;
  aiResponse: string;
  createdAt: Date;
  updatedAt: Date;
}

const ScheduleSchema = new Schema<ISchedule>({
  type: {
    type: String,
    enum: ['meeting', 'reminder', 'task', 'appointment'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    min: 1
  },
  participants: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true
  },
  metadata: {
    type: Schema.Types.Mixed
  },
  userId: {
    type: String,
    index: true
  },
  aiPrompt: {
    type: String,
    required: true
  },
  aiResponse: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better query performance
ScheduleSchema.index({ userId: 1, date: 1 });
ScheduleSchema.index({ type: 1, date: 1 });
ScheduleSchema.index({ createdAt: -1 });

// Virtual for formatted date and time
ScheduleSchema.virtual('formattedDateTime').get(function() {
  return `${this.date} at ${this.time}`;
});

// Ensure virtual fields are serialized
ScheduleSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    return ret;
  }
});

export const Schedule = mongoose.model<ISchedule>('Schedule', ScheduleSchema); 