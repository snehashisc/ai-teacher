import { NextRequest, NextResponse } from 'next/server';
import { getOrCreateStudent, getStudentContext } from '@/lib/db/student';

export async function POST(request: NextRequest) {
  try {
    const { name, classNum } = await request.json();

    if (!name || !classNum) {
      return NextResponse.json(
        { error: 'Name and class are required' },
        { status: 400 }
      );
    }

    const student = await getOrCreateStudent(name, classNum);
    const context = await getStudentContext(student.id);

    return NextResponse.json({ student, context });
  } catch (error) {
    console.error('Error creating/fetching student:', error);
    return NextResponse.json(
      { error: 'Failed to process student' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('id');

    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }

    const context = await getStudentContext(studentId);

    return NextResponse.json({ context });
  } catch (error) {
    console.error('Error fetching student context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student context' },
      { status: 500 }
    );
  }
}
