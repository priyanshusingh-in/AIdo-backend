/**
 * Utility functions for handling time calculations and relative time expressions
 */

export interface TimeCalculation {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
}

/**
 * Calculate the target date and time based on a relative time expression
 * @param relativeExpression - e.g., "in 2 minutes", "in 1 hour", "in 3 days"
 * @param baseDate - Optional base date (defaults to current date/time)
 * @returns Object with calculated date and time
 */
export function calculateRelativeTime(
  relativeExpression: string, 
  baseDate: Date = new Date()
): TimeCalculation {
  const now = new Date(baseDate);
  const lowerExpression = relativeExpression.toLowerCase().trim();
  
  // Extract number and unit from expressions like "in 2 minutes", "in 1 hour", etc.
  const match = lowerExpression.match(/in\s+(\d+)\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)/);
  
  if (!match) {
    // If no relative expression found, return current date/time
    return {
      date: now.toISOString().split('T')[0],
      time: now.toTimeString().slice(0, 5)
    };
  }
  
  const amount = parseInt(match[1]);
  const unit = match[2];
  
  const targetDate = new Date(now);
  
  switch (unit) {
    case 'minute':
    case 'minutes':
      targetDate.setMinutes(targetDate.getMinutes() + amount);
      break;
    case 'hour':
    case 'hours':
      targetDate.setHours(targetDate.getHours() + amount);
      break;
    case 'day':
    case 'days':
      targetDate.setDate(targetDate.getDate() + amount);
      break;
    case 'week':
    case 'weeks':
      targetDate.setDate(targetDate.getDate() + (amount * 7));
      break;
    case 'month':
    case 'months':
      targetDate.setMonth(targetDate.getMonth() + amount);
      break;
    case 'year':
    case 'years':
      targetDate.setFullYear(targetDate.getFullYear() + amount);
      break;
    default:
      // Default to current time
      break;
  }
  
  return {
    date: targetDate.toISOString().split('T')[0],
    time: targetDate.toTimeString().slice(0, 5)
  };
}

/**
 * Check if a string contains relative time expressions
 * @param text - The text to check
 * @returns true if relative time expressions are found
 */
export function hasRelativeTimeExpression(text: string): boolean {
  const relativeTimePatterns = [
    /\bin\s+\d+\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/i,
    /\b\d+\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+from\s+now\b/i,
    /\b(tomorrow|next\s+week|next\s+month|next\s+year)\b/i
  ];
  
  return relativeTimePatterns.some(pattern => pattern.test(text));
}

/**
 * Extract relative time expression from text
 * @param text - The text to extract from
 * @returns The relative time expression or null if not found
 */
export function extractRelativeTimeExpression(text: string): string | null {
  const relativeTimePatterns = [
    /\bin\s+\d+\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\b/i,
    /\b\d+\s+(minute|minutes|hour|hours|day|days|week|weeks|month|months|year|years)\s+from\s+now\b/i
  ];
  
  for (const pattern of relativeTimePatterns) {
    const match = text.match(pattern);
    if (match) {
      return match[0];
    }
  }
  
  return null;
}

/**
 * Get current date and time in the required format
 * @returns Object with current date and time
 */
export function getCurrentDateTime(): TimeCalculation {
  const now = new Date();
  return {
    date: now.toISOString().split('T')[0],
    time: now.toTimeString().slice(0, 5)
  };
} 