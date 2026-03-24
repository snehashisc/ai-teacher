import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { studentId, subject, chapter } = await request.json();

    if (!studentId || !subject || !chapter) {
      return NextResponse.json(
        { error: 'Student ID, subject, and chapter are required' },
        { status: 400 }
      );
    }

    const session = await createSession(studentId, subject, chapter);

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Error starting session:', error);
    return NextResponse.json(
      { error: 'Failed to start session' },
      { status: 500 }
    );
  }
}
