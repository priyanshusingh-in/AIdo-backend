import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse, ScheduleData } from '../types';
import { logger } from '../utils/logger';
import { 
  calculateRelativeTime, 
  hasRelativeTimeExpression, 
  extractRelativeTimeExpression,
  getCurrentDateTime 
} from '../utils/timeUtils';

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
    const currentDateTime = getCurrentDateTime();
    
    return `You are an AI scheduling assistant. Analyze the following user prompt and extract scheduling information. 

CURRENT DATE AND TIME: ${currentDateTime.date} ${currentDateTime.time}

Return ONLY a valid JSON object with the following structure:

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
1. Use the CURRENT DATE AND TIME provided above as the reference point
2. If the user mentions relative time (e.g., "in 2 minutes", "in 1 hour"), calculate the actual date and time based on the current date/time
3. If no specific date is mentioned, use today's date (${currentDateTime.date})
4. If no specific time is mentioned, use a reasonable default time (e.g., 09:00)
5. Duration should be in minutes
6. Priority should be "medium" unless explicitly stated otherwise
7. Type should be inferred from context:
   - "meeting" for meetings with others
   - "reminder" for personal reminders
   - "task" for to-do items
   - "appointment" for scheduled appointments
8. Extract participant names when mentioned
9. Include location if specified
10. Return ONLY the JSON object, no additional text

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

      // Post-process the data to handle relative time expressions
      const processedData = this.postProcessScheduleData(scheduleData, userPrompt);

      // Validate the parsed data
      if (!this.validateScheduleData(processedData)) {
        throw new Error('Invalid schedule data structure');
      }

      logger.info('Successfully processed schedule prompt', { 
        type: processedData.type, 
        title: processedData.title 
      });

      return {
        success: true,
        data: processedData
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

  private postProcessScheduleData(scheduleData: ScheduleData, userPrompt: string): ScheduleData {
    // Check if the user prompt contains relative time expressions
    if (hasRelativeTimeExpression(userPrompt)) {
      const relativeExpression = extractRelativeTimeExpression(userPrompt);
      
      if (relativeExpression) {
        logger.info('Detected relative time expression', { 
          expression: relativeExpression, 
          originalDate: scheduleData.date, 
          originalTime: scheduleData.time 
        });
        
        // Calculate the actual date and time based on the relative expression
        const calculatedTime = calculateRelativeTime(relativeExpression);
        
        // Update the schedule data with calculated date and time
        scheduleData.date = calculatedTime.date;
        scheduleData.time = calculatedTime.time;
        
        logger.info('Updated schedule with calculated time', { 
          newDate: scheduleData.date, 
          newTime: scheduleData.time 
        });
      }
    }
    
    return scheduleData;
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