export interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
  estimatedHours: number;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Curriculum {
  class: number;
  board: 'CBSE' | 'ICSE' | 'STATE';
  subjects: Subject[];
}

export interface StudentContext {
  studentId: string;
  class: number;
  weakTopics: string[];
  strongTopics: string[];
  currentAccuracy: number;
  learningPace: 'slow' | 'medium' | 'fast';
}
