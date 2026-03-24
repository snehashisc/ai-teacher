import { NextRequest, NextResponse } from 'next/server';
import { AITutor } from '@/lib/ai/tutor';
import { getStudentContext, addInteraction } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { studentId, classNum, subject, chapter, topic, sessionId } = await request.json();

    if (!studentId || !classNum || !subject || !chapter || !topic || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const studentContext = await getStudentContext(studentId);
    
    const tutor = new AITutor(classNum, subject, chapter, topic, studentContext);
    const response = await tutor.startLesson();

    await addInteraction(sessionId, 'explanation', response.message);

    return NextResponse.json({ 
      message: response.message,
      type: response.type,
    });
  } catch (error) {
    console.error('Error starting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to start lesson' },
      { status: 500 }
    );
  }
}
