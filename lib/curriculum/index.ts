import { Curriculum } from './types';
import { class6Math } from './data/class6-math';

export const curriculumData: Record<string, Curriculum> = {
  'cbse-6': {
    class: 6,
    board: 'CBSE',
    subjects: [class6Math],
  },
  'cbse-7': {
    class: 7,
    board: 'CBSE',
    subjects: [class6Math], // Using same curriculum for now
  },
  'cbse-8': {
    class: 8,
    board: 'CBSE',
    subjects: [class6Math], // Using same curriculum for now
  },
  'cbse-9': {
    class: 9,
    board: 'CBSE',
    subjects: [class6Math], // Using same curriculum for now
  },
  'cbse-10': {
    class: 10,
    board: 'CBSE',
    subjects: [class6Math], // Using same curriculum for now
  },
};

export function getCurriculum(classNum: number, board: string = 'CBSE'): Curriculum | null {
  const key = `${board.toLowerCase()}-${classNum}`;
  return curriculumData[key] || null;
}

export function getSubject(classNum: number, subjectId: string, board: string = 'CBSE') {
  const curriculum = getCurriculum(classNum, board);
  return curriculum?.subjects.find(s => s.id === subjectId);
}

export function getChapter(classNum: number, subjectId: string, chapterId: string, board: string = 'CBSE') {
  const subject = getSubject(classNum, subjectId, board);
  return subject?.chapters.find(c => c.id === chapterId);
}

export * from './types';
