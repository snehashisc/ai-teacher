// Curriculum and student context types

export interface StudentContext {
  studentId: string;
  name?: string;
  class?: number;
  weakTopics?: string[];
  strongTopics?: string[];
  learningStyle?: string;
  learningPace?: 'slow' | 'medium' | 'fast';
  previousScore?: number;
  currentAccuracy?: number;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
}

export interface Chapter {
  id: string;
  name: string;
  description?: string;
  estimatedHours?: number;
  topics: Topic[];
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Curriculum {
  class?: number;
  classNum: number;
  board?: string;
  subjects: Subject[];
}
