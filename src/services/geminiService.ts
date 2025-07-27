import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, ScheduleData } from '../types';
import { logger } from '../utils/logger';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env['GEMINI_API_KEY'];
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not defined');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  private createPrompt(userPrompt: string): string {
    return `You are an AI scheduling assistant. Analyze the following user prompt and extract scheduling information. Return ONLY a valid JSON object with the following structure:

{
  "type": "meeting|reminder|task|appointment",
  "title": "Brief descriptive title",
  "description": "Optional detailed description",
  "date": "YYYY-MM-DD format",
  "time": "HH:MM format (24-hour)",
  "duration": number (in minutes, optional),
  "participants": ["array of participant names", "optional"],
  "location": "location string, optional",
  "priority": "low|medium|high",
  "category": "category string, optional",
  "metadata": {}
}

Rules:
1. If no specific date is mentioned, use today's date
2. If no specific time is mentioned, use a reasonable default time (e.g., 09:00)
3. Duration should be in minutes
4. Priority should be "medium" unless explicitly stated otherwise
5. Type should be inferred from context:
   - "meeting" for meetings with others
   - "reminder" for personal reminders
   - "task" for to-do items
   - "appointment" for scheduled appointments
6. Extract participant names when mentioned
7. Include location if specified
8. Return ONLY the JSON object, no additional text

User prompt: "${userPrompt}"

JSON Response:`;
  }

  public async processSchedulePrompt(userPrompt: string): Promise<AIResponse> {
    try {
      logger.info('Processing schedule prompt:', { prompt: userPrompt });

      const prompt = this.createPrompt(userPrompt);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      logger.info('Raw AI response:', { response: text });

      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const jsonString = jsonMatch[0];
      const scheduleData: ScheduleData = JSON.parse(jsonString);

      // Validate the parsed data
      if (!this.validateScheduleData(scheduleData)) {
        throw new Error('Invalid schedule data structure');
      }

      logger.info('Successfully processed schedule prompt', { 
        type: scheduleData.type, 
        title: scheduleData.title 
      });

      return {
        success: true,
        data: scheduleData
      };

    } catch (error) {
      logger.error('Error processing schedule prompt:', error);
      
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  private validateScheduleData(data: any): data is ScheduleData {
    const requiredFields = ['type', 'title', 'date', 'time'];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        logger.error(`Missing required field: ${field}`);
        return false;
      }
    }

    // Validate type enum
    const validTypes = ['meeting', 'reminder', 'task', 'appointment'];
    if (!validTypes.includes(data.type)) {
      logger.error(`Invalid type: ${data.type}`);
      return false;
    }

    // Validate priority enum
    if (data.priority && !['low', 'medium', 'high'].includes(data.priority)) {
      logger.error(`Invalid priority: ${data.priority}`);
      return false;
    }

    // Validate date format (basic check)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      logger.error(`Invalid date format: ${data.date}`);
      return false;
    }

    // Validate time format (basic check)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(data.time)) {
      logger.error(`Invalid time format: ${data.time}`);
      return false;
    }

    return true;
  }
}

// Lazy initialization to ensure environment variables are loaded
let _geminiService: GeminiService | null = null;

export const getGeminiService = (): GeminiService => {
  if (!_geminiService) {
    _geminiService = new GeminiService();
  }
  return _geminiService;
}; 