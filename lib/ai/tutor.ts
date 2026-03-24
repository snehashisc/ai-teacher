import { chat, ChatMessage } from './client';
import { getTeacherSystemPrompt, getAnswerEvaluatorPrompt, getConceptExplanationPrompt } from './prompts';
import { StudentContext } from '../curriculum/types';

export interface TutorResponse {
  message: string;
  type: 'explanation' | 'question' | 'feedback' | 'encouragement';
}

export class AITutor {
  private conversationHistory: ChatMessage[] = [];
  private systemPrompt: string;

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
  }

  async startLesson(): Promise<TutorResponse> {
    const initialPrompt = `Start teaching the topic "${this.topic}" from ${this.chapter}. Begin with a friendly greeting and an engaging introduction to the concept.`;
    
    this.conversationHistory.push({
      role: 'user',
      content: initialPrompt,
    });

    const response = await chat(this.conversationHistory);
    
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

    const response = await chat(this.conversationHistory);
    
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
    
    const response = await chat([
      { role: 'system', content: this.systemPrompt },
      { role: 'user', content: prompt },
    ]);

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
  topic: string
): Promise<EvaluationResult> {
  const prompt = getAnswerEvaluatorPrompt(question, expectedAnswer, studentAnswer, topic);
  
  const response = await chat([
    { role: 'system', content: 'You are an expert answer evaluator. Always respond with valid JSON.' },
    { role: 'user', content: prompt },
  ], {
    temperature: 0.3,
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
