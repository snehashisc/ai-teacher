import { create } from 'zustand';
import { AITutor } from '../ai/tutor';
import { Homework } from '../ai/homework';

export interface Message {
  id: string;
  role: 'teacher' | 'student';
  content: string;
  type?: 'explanation' | 'question' | 'feedback' | 'encouragement';
  timestamp: Date;
  isCorrect?: boolean;
}

export interface SessionState {
  studentId: string | null;
  studentName: string | null;
  classNum: number | null;
  subject: string | null;
  chapter: string | null;
  topic: string | null;
  sessionId: string | null;
  
  mode: 'selection' | 'teaching' | 'homework' | 'report' | null;
  
  messages: Message[];
  tutor: AITutor | null;
  
  homework: Homework | null;
  homeworkAnswers: Record<string, string>;
  
  isTeacherThinking: boolean;
  
  setStudent: (id: string, name: string, classNum: number) => void;
  setSelection: (subject: string, chapter: string, topic: string) => void;
  setSessionId: (id: string) => void;
  setMode: (mode: SessionState['mode']) => void;
  
  initializeTutor: (tutor: AITutor) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  
  setHomework: (homework: Homework) => void;
  setHomeworkAnswer: (questionId: string, answer: string) => void;
  
  setTeacherThinking: (thinking: boolean) => void;
  
  reset: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  studentId: null,
  studentName: null,
  classNum: null,
  subject: null,
  chapter: null,
  topic: null,
  sessionId: null,
  mode: 'selection',
  messages: [],
  tutor: null,
  homework: null,
  homeworkAnswers: {},
  isTeacherThinking: false,

  setStudent: (id, name, classNum) => 
    set({ studentId: id, studentName: name, classNum }),

  setSelection: (subject, chapter, topic) => 
    set({ subject, chapter, topic }),

  setSessionId: (id) => 
    set({ sessionId: id }),

  setMode: (mode) => 
    set({ mode }),

  initializeTutor: (tutor) => 
    set({ tutor }),

  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
        },
      ],
    })),

  setHomework: (homework) => 
    set({ homework, homeworkAnswers: {} }),

  setHomeworkAnswer: (questionId, answer) =>
    set((state) => ({
      homeworkAnswers: {
        ...state.homeworkAnswers,
        [questionId]: answer,
      },
    })),

  setTeacherThinking: (thinking) => 
    set({ isTeacherThinking: thinking }),

  reset: () =>
    set({
      studentId: null,
      studentName: null,
      classNum: null,
      subject: null,
      chapter: null,
      topic: null,
      sessionId: null,
      mode: 'selection',
      messages: [],
      tutor: null,
      homework: null,
      homeworkAnswers: {},
      isTeacherThinking: false,
    }),
}));
