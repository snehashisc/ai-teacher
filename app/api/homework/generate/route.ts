import { NextRequest, NextResponse } from 'next/server';
import { generateHomework } from '@/lib/ai/homework';
import { getStudentContext, saveHomework } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { 
      studentId,
      sessionId,
      classNum, 
      subject, 
      chapter, 
      topics,
      difficulty = 'mixed',
      count = 5,
    } = await request.json();

    if (!classNum || !subject || !chapter || !topics || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const studentContext = studentId ? await getStudentContext(studentId) : undefined;

    const homework = await generateHomework(
      classNum,
      subject,
      chapter,
      topics,
      { difficulty, count, studentContext }
    );

    await saveHomework(sessionId, homework);

    return NextResponse.json({ homework });
  } catch (error) {
    console.error('Error generating homework:', error);
    return NextResponse.json(
      { error: 'Failed to generate homework' },
      { status: 500 }
    );
  }
}
