'use client';

import { useState } from 'react';
import { useSessionStore } from '@/lib/store/session-store';
import StudentSetup from '@/components/StudentSetup';
import SubjectSelection from '@/components/SubjectSelection';
import TeachingMode from '@/components/TeachingMode';
import HomeworkMode from '@/components/HomeworkMode';
import ReportMode from '@/components/ReportMode';
import { HomeworkResult } from '@/lib/ai/homework';

export default function Home() {
  const [homeworkResult, setHomeworkResult] = useState<HomeworkResult | null>(null);

  const {
    studentId,
    studentName,
    classNum,
    mode,
    setStudent,
    setSelection,
    setSessionId,
    setMode,
    reset,
  } = useSessionStore();

  const handleStudentSetup = async (id: string, name: string, classNum: number) => {
    setStudent(id, name, classNum);
    setMode('selection');
  };

  const handleSelection = async (subject: string, chapter: string, topic: string) => {
    setSelection(subject, chapter, topic);

    try {
      const response = await fetch('/api/session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          subject,
          chapter,
        }),
      });

      const data = await response.json();
      setSessionId(data.session.id);
      setMode('teaching');
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleTeachingComplete = () => {
    setMode('homework');
  };

  const handleHomeworkComplete = (result: HomeworkResult) => {
    setHomeworkResult(result);
    setMode('report');
  };

  const handleExit = () => {
    reset();
    setHomeworkResult(null);
  };

  if (!studentId || !mode) {
    return <StudentSetup onComplete={handleStudentSetup} />;
  }

  if (mode === 'selection') {
    return (
      <SubjectSelection
        classNum={classNum!}
        studentName={studentName!}
        onSelect={handleSelection}
        onBack={handleExit}
      />
    );
  }

  if (mode === 'teaching') {
    return (
      <TeachingMode
        onComplete={handleTeachingComplete}
        onExit={handleExit}
      />
    );
  }

  if (mode === 'homework') {
    return <HomeworkMode onComplete={handleHomeworkComplete} />;
  }

  if (mode === 'report' && homeworkResult) {
    return <ReportMode result={homeworkResult} onExit={handleExit} />;
  }

  return null;
}
