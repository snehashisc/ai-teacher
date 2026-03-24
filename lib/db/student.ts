import { prisma } from './client';
import { StudentContext } from '../curriculum/types';

export async function getOrCreateStudent(name: string, classNum: number) {
  let student = await prisma.student.findFirst({
    where: { name, class: classNum },
  });

  if (!student) {
    student = await prisma.student.create({
      data: { name, class: classNum },
    });
  }

  return student;
}

export async function getStudentContext(studentId: string): Promise<StudentContext> {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progress: true,
      weakTopics: true,
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  const weakTopics = student.weakTopics
    .filter(wt => wt.errorCount >= 3)
    .map(wt => wt.topic);

  const strongTopics = student.progress
    .filter(p => p.accuracy >= 80 && p.attemptsCount >= 3)
    .map(p => p.topic);

  const avgAccuracy = student.progress.length > 0
    ? student.progress.reduce((sum, p) => sum + p.accuracy, 0) / student.progress.length
    : 50;

  let learningPace: 'slow' | 'medium' | 'fast' = 'medium';
  if (avgAccuracy >= 80) learningPace = 'fast';
  else if (avgAccuracy < 50) learningPace = 'slow';

  return {
    studentId: student.id,
    class: student.class,
    weakTopics,
    strongTopics,
    currentAccuracy: avgAccuracy,
    learningPace,
  };
}

export async function updateProgress(
  studentId: string,
  subject: string,
  chapter: string,
  topic: string,
  isCorrect: boolean
) {
  const existing = await prisma.progress.findUnique({
    where: {
      studentId_subject_chapter_topic: {
        studentId,
        subject,
        chapter,
        topic,
      },
    },
  });

  if (existing) {
    const newAttemptsCount = existing.attemptsCount + 1;
    const correctCount = Math.round((existing.accuracy / 100) * existing.attemptsCount) + (isCorrect ? 1 : 0);
    const newAccuracy = (correctCount / newAttemptsCount) * 100;

    await prisma.progress.update({
      where: { id: existing.id },
      data: {
        accuracy: newAccuracy,
        attemptsCount: newAttemptsCount,
        lastAttempt: new Date(),
      },
    });
  } else {
    await prisma.progress.create({
      data: {
        studentId,
        subject,
        chapter,
        topic,
        accuracy: isCorrect ? 100 : 0,
        attemptsCount: 1,
      },
    });
  }

  if (!isCorrect) {
    await trackWeakTopic(studentId, subject, chapter, topic);
  }
}

export async function trackWeakTopic(
  studentId: string,
  subject: string,
  chapter: string,
  topic: string
) {
  const existing = await prisma.weakTopic.findUnique({
    where: {
      studentId_subject_chapter_topic: {
        studentId,
        subject,
        chapter,
        topic,
      },
    },
  });

  if (existing) {
    await prisma.weakTopic.update({
      where: { id: existing.id },
      data: {
        errorCount: existing.errorCount + 1,
        lastError: new Date(),
      },
    });
  } else {
    await prisma.weakTopic.create({
      data: {
        studentId,
        subject,
        chapter,
        topic,
        errorCount: 1,
      },
    });
  }
}

export async function createSession(
  studentId: string,
  subject: string,
  chapter: string
) {
  return await prisma.session.create({
    data: {
      studentId,
      subject,
      chapter,
    },
  });
}

export async function endSession(sessionId: string) {
  return await prisma.session.update({
    where: { id: sessionId },
    data: { endedAt: new Date() },
  });
}

export async function addInteraction(
  sessionId: string,
  type: string,
  content: string,
  isCorrect?: boolean
) {
  return await prisma.interaction.create({
    data: {
      sessionId,
      type,
      content,
      isCorrect,
    },
  });
}

export async function saveHomework(
  sessionId: string,
  questions: any,
  answers?: any,
  score?: number
) {
  return await prisma.homework.upsert({
    where: { sessionId },
    create: {
      sessionId,
      questions: JSON.stringify(questions),
      answers: answers ? JSON.stringify(answers) : null,
      score,
      completedAt: answers ? new Date() : null,
    },
    update: {
      answers: answers ? JSON.stringify(answers) : undefined,
      score,
      completedAt: answers ? new Date() : undefined,
    },
  });
}

export async function getStudentReport(studentId: string, subject?: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      progress: subject ? { where: { subject } } : true,
      weakTopics: subject ? { where: { subject } } : true,
      sessions: {
        where: subject ? { subject } : {},
        include: {
          interactions: true,
          homework: true,
        },
        orderBy: { startedAt: 'desc' },
        take: 10,
      },
    },
  });

  return student;
}
