import { NextRequest, NextResponse } from 'next/server';
import { evaluateAnswer } from '@/lib/ai/tutor';
import { calculateHomeworkResult, HomeworkSubmission } from '@/lib/ai/homework';
import { saveHomework, updateProgress } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { 
      studentId,
      sessionId,
      subject,
      chapter,
      homework,
      answers,
    } = await request.json();

    if (!sessionId || !homework || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const submissions: HomeworkSubmission[] = [];

    for (let i = 0; i < homework.questions.length; i++) {
      const question = homework.questions[i];
      const studentAnswer = answers[question.id] || '';

      const evaluation = await evaluateAnswer(
        question.question,
        question.expectedAnswer,
        studentAnswer,
        question.topic
      );

      submissions.push({
        questionId: question.id,
        studentAnswer,
        isCorrect: evaluation.isCorrect,
        score: evaluation.score,
        feedback: evaluation.feedback,
      });

      if (studentId) {
        await updateProgress(
          studentId,
          subject,
          chapter,
          question.topic,
          evaluation.isCorrect
        );
      }
    }

    const result = calculateHomeworkResult(homework, submissions);

    await saveHomework(sessionId, homework, answers, result.totalScore);

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error submitting homework:', error);
    return NextResponse.json(
      { error: 'Failed to submit homework' },
      { status: 500 }
    );
  }
}
