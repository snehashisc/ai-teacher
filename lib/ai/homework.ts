import { chat } from './client';
import { getSecureAIClient } from './secure-client';
import { LLMMessage } from '../llm/provider';
import { getHomeworkGeneratorPrompt } from './prompts';
import { StudentContext } from '../curriculum/types';

export interface HomeworkQuestion {
  id: string;
  question: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedAnswer: string;
  hints: string[];
}

export interface Homework {
  questions: HomeworkQuestion[];
}

export async function generateHomework(
  classNum: number,
  subject: string,
  chapter: string,
  topics: string[],
  options: {
    difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
    count?: number;
    studentContext?: StudentContext;
  } = {}
): Promise<Homework> {
  const {
    difficulty = 'mixed',
    count = 5,
    studentContext,
  } = options;

  const prompt = getHomeworkGeneratorPrompt(
    classNum,
    subject,
    chapter,
    topics,
    difficulty,
    count,
    studentContext
  );

  const secureClient = getSecureAIClient();
  const response = await secureClient.chat([
    { role: 'system', content: 'You are an expert homework creator. Always respond with valid JSON.' },
    { role: 'user', content: prompt },
  ] as LLMMessage[], {
    temperature: 0.8,
    maxTokens: 1500,
    studentId: studentContext?.studentId,
  });

  try {
    const homework = JSON.parse(response);
    return homework;
  } catch (error) {
    console.error('Failed to parse homework:', error);
    return {
      questions: [],
    };
  }
}

export interface HomeworkSubmission {
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  score: number;
  feedback: string;
}

export interface HomeworkResult {
  totalQuestions: number;
  correctAnswers: number;
  totalScore: number;
  submissions: HomeworkSubmission[];
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
}

export function calculateHomeworkResult(
  homework: Homework,
  submissions: HomeworkSubmission[]
): HomeworkResult {
  const totalQuestions = homework.questions.length;
  const correctAnswers = submissions.filter(s => s.isCorrect).length;
  const totalScore = submissions.reduce((sum, s) => sum + s.score, 0) / totalQuestions;

  const topicScores = new Map<string, { correct: number; total: number }>();
  
  submissions.forEach((submission, index) => {
    const question = homework.questions[index];
    const topic = question.topic;
    
    if (!topicScores.has(topic)) {
      topicScores.set(topic, { correct: 0, total: 0 });
    }
    
    const stats = topicScores.get(topic)!;
    stats.total++;
    if (submission.isCorrect) {
      stats.correct++;
    }
  });

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  topicScores.forEach((stats, topic) => {
    const accuracy = stats.correct / stats.total;
    if (accuracy >= 0.8) {
      strengths.push(topic);
    } else if (accuracy < 0.5) {
      weaknesses.push(topic);
    }
  });

  let recommendation = '';
  if (totalScore >= 80) {
    recommendation = 'Excellent work! You have a strong grasp of this chapter. Ready to move to the next topic!';
  } else if (totalScore >= 60) {
    recommendation = 'Good progress! Review the areas where you made mistakes and try a few more practice problems.';
  } else {
    recommendation = 'Keep practicing! Let\'s revisit the concepts you found challenging. Don\'t worry, we\'ll work through this together.';
  }

  if (weaknesses.length > 0) {
    recommendation += ` Focus especially on: ${weaknesses.join(', ')}.`;
  }

  return {
    totalQuestions,
    correctAnswers,
    totalScore,
    submissions,
    strengths,
    weaknesses,
    recommendation,
  };
}
