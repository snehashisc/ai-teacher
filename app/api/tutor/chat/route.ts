import { NextRequest, NextResponse } from 'next/server';
import { AITutor } from '@/lib/ai/tutor';
import { getStudentContext, addInteraction } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { 
      studentId, 
      classNum, 
      subject, 
      chapter, 
      topic, 
      sessionId,
      message,
      conversationHistory 
    } = await request.json();

    if (!studentId || !message || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const studentContext = await getStudentContext(studentId);
    
    const tutor = new AITutor(classNum, subject, chapter, topic, studentContext);
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg: any) => {
        (tutor as any).conversationHistory.push(msg);
      });
    }

    await addInteraction(sessionId, 'answer', message);

    const response = await tutor.respondToStudent(message);

    await addInteraction(sessionId, response.type, response.message);

    return NextResponse.json({ 
      message: response.message,
      type: response.type,
      conversationHistory: tutor.getConversationHistory(),
    });
  } catch (error) {
    console.error('Error in chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    );
  }
}
