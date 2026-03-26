// Content filtering and safety guard rails

export interface ContentCheckResult {
  allowed: boolean;
  reason?: string;
  severity?: 'low' | 'medium' | 'high';
}

// Inappropriate topics for educational context
const BLOCKED_TOPICS = [
  'violence', 'weapons', 'drugs', 'alcohol', 'gambling',
  'adult content', 'hate speech', 'self-harm', 'illegal activities'
];

// Educational keywords that should be present
const EDUCATIONAL_KEYWORDS = [
  'learn', 'study', 'understand', 'explain', 'teach', 'solve',
  'calculate', 'answer', 'question', 'homework', 'concept',
  'math', 'science', 'history', 'geography', 'language'
];

export class ContentFilter {
  
  /**
   * Check if user input is appropriate for educational context
   */
  checkUserInput(input: string): ContentCheckResult {
    const lowerInput = input.toLowerCase();

    // Check for blocked topics
    for (const topic of BLOCKED_TOPICS) {
      if (lowerInput.includes(topic)) {
        return {
          allowed: false,
          reason: `Content contains inappropriate topic: ${topic}`,
          severity: 'high'
        };
      }
    }

    // Check for prompt injection attempts
    const injectionPatterns = [
      /ignore (previous|all) instructions/i,
      /you are now/i,
      /forget (everything|all)/i,
      /new (role|personality|character)/i,
      /system prompt/i,
      /jailbreak/i,
    ];

    for (const pattern of injectionPatterns) {
      if (pattern.test(input)) {
        return {
          allowed: false,
          reason: 'Potential prompt injection detected',
          severity: 'high'
        };
      }
    }

    // Check input length (prevent abuse)
    if (input.length > 2000) {
      return {
        allowed: false,
        reason: 'Input too long (max 2000 characters)',
        severity: 'low'
      };
    }

    // Check for minimum content
    if (input.trim().length < 2) {
      return {
        allowed: false,
        reason: 'Input too short',
        severity: 'low'
      };
    }

    return { allowed: true };
  }

  /**
   * Check if AI response is appropriate
   */
  checkAIResponse(response: string): ContentCheckResult {
    const lowerResponse = response.toLowerCase();

    // Check for blocked topics in response
    for (const topic of BLOCKED_TOPICS) {
      if (lowerResponse.includes(topic)) {
        return {
          allowed: false,
          reason: `Response contains inappropriate content: ${topic}`,
          severity: 'high'
        };
      }
    }

    // Check if response is educational (more lenient)
    // Allow greetings, encouragement, and general teaching language
    const teacherPhrases = [
      'hello', 'hi', 'welcome', 'great', 'good', 'excellent', 'wonderful',
      'let', 'today', 'going', 'will', 'can', 'help', 'together',
      'chapter', 'topic', 'lesson', 'concept', 'example', 'practice',
      'question', 'answer', 'think', 'try', 'work', 'problem'
    ];
    
    const hasEducationalContent = EDUCATIONAL_KEYWORDS.some(keyword => 
      lowerResponse.includes(keyword)
    );
    
    const hasTeacherLanguage = teacherPhrases.some(phrase => 
      lowerResponse.includes(phrase)
    );

    // Only flag if it's long AND has neither educational keywords nor teacher language
    if (!hasEducationalContent && !hasTeacherLanguage && response.length > 200) {
      return {
        allowed: false,
        reason: 'Response does not appear to be educational',
        severity: 'medium'
      };
    }

    return { allowed: true };
  }

  /**
   * Sanitize user input
   */
  sanitizeInput(input: string): string {
    // Remove excessive whitespace
    let sanitized = input.trim().replace(/\s+/g, ' ');

    // Remove potentially harmful characters
    sanitized = sanitized.replace(/[<>]/g, '');

    // Limit length
    if (sanitized.length > 2000) {
      sanitized = sanitized.substring(0, 2000);
    }

    return sanitized;
  }

  /**
   * Check if topic is educational
   */
  isEducationalTopic(topic: string): boolean {
    const lowerTopic = topic.toLowerCase();
    
    const educationalSubjects = [
      'math', 'science', 'physics', 'chemistry', 'biology',
      'history', 'geography', 'english', 'language', 'literature',
      'computer', 'programming', 'art', 'music', 'economics'
    ];

    return educationalSubjects.some(subject => lowerTopic.includes(subject));
  }
}

// Singleton instance
let contentFilter: ContentFilter | null = null;

export function getContentFilter(): ContentFilter {
  if (!contentFilter) {
    contentFilter = new ContentFilter();
  }
  return contentFilter;
}
