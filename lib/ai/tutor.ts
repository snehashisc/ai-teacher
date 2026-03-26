import { chat, ChatMessage } from './client';
import { getSecureAIClient } from './secure-client';
import { LLMMessage } from '../llm/provider';
import { getTeacherSystemPrompt, getAnswerEvaluatorPrompt, getConceptExplanationPrompt } from './prompts';
import { StudentContext } from '../curriculum/types';

export interface TutorResponse {
  message: string;
  type: 'explanation' | 'question' | 'feedback' | 'encouragement';
}

export class AITutor {
  private conversationHistory: ChatMessage[] = [];
  private systemPrompt: string;
  private secureClient = getSecureAIClient();
  private studentId?: string;

  constructor(
    private classNum: number,
    private subject: string,
    private chapter: string,
    private topic: string,
    private studentContext?: StudentContext
  ) {
    this.systemPrompt = getTeacherSystemPrompt(
      classNum,
      subject,
      chapter,
      topic,
      studentContext
    );
    this.conversationHistory.push({
      role: 'system',
      content: this.systemPrompt,
    });
    this.studentId = studentContext?.studentId;
  }

  async startLesson(): Promise<TutorResponse> {
    const initialPrompt = `Start teaching "${this.topic}" from ${this.chapter}. 

REMEMBER: You are a TEACHER (strict but humble), talking to a Class ${this.classNum} student (age 11-14).

IMPORTANT: Keep it SHORT and INTERACTIVE!
- ONE sentence professional greeting (not overly casual)
- ONE simple question to check what they already know
- Total: 2 sentences maximum
- Maintain teacher-student dynamic

Example: "Hello! Let's learn about ${this.topic} today. Tell me - what do you already know about this topic?"

Now begin the lesson:`;
    
    this.conversationHistory.push({
      role: 'user',
      content: initialPrompt,
    });

    // Use secure client with guard rails
    const response = await this.secureClient.chat(
      this.conversationHistory as LLMMessage[],
      { studentId: this.studentId }
    );
    
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
    });

    return {
      message: response,
      type: 'explanation',
    };
  }

  async respondToStudent(studentMessage: string): Promise<TutorResponse> {
    this.conversationHistory.push({
      role: 'user',
      content: studentMessage,
    });

    // Use secure client with guard rails
    const response = await this.secureClient.chat(
      this.conversationHistory as LLMMessage[],
      { studentId: this.studentId }
    );
    
    this.conversationHistory.push({
      role: 'assistant',
      content: response,
    });

    const type = this.detectResponseType(response);

    return {
      message: response,
      type,
    };
  }

  async explainConcept(subtopic: string): Promise<string> {
    const prompt = getConceptExplanationPrompt(this.topic, subtopic, this.classNum);
    
    // Use secure client with guard rails
    const response = await this.secureClient.chat([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: prompt },
    ] as LLMMessage[], { studentId: this.studentId });

    return response;
  }

  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  private detectResponseType(response: string): TutorResponse['type'] {
    if (response.includes('?')) return 'question';
    if (response.includes('correct') || response.includes('wrong') || response.includes('mistake')) {
      return 'feedback';
    }
    if (response.includes('Good') || response.includes('Great') || response.includes('Well done')) {
      return 'encouragement';
    }
    return 'explanation';
  }
}

export interface EvaluationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  misconception: string | null;
  hint: string | null;
}

export async function evaluateAnswer(
  question: string,
  expectedAnswer: string,
  studentAnswer: string,
  topic: string,
  studentId?: string
): Promise<EvaluationResult> {
  const prompt = getAnswerEvaluatorPrompt(question, expectedAnswer, studentAnswer, topic);
  
  const secureClient = getSecureAIClient();
  const response = await secureClient.chat([
    { role: 'system', content: 'You are an expert answer evaluator. Always respond with valid JSON.' },
    { role: 'user', content: prompt },
  ] as LLMMessage[], {
    temperature: 0.3,
    studentId,
  });

  try {
    const result = JSON.parse(response);
    return result;
  } catch (error) {
    console.error('Failed to parse evaluation result:', error);
    return {
      isCorrect: false,
      score: 0,
      feedback: 'Unable to evaluate answer. Please try again.',
      misconception: null,
      hint: null,
    };
  }
}
