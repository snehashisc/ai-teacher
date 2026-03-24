'use client';

import { useState, useEffect } from 'react';
import { useSessionStore } from '@/lib/store/session-store';
import { ClipboardList, ArrowRight, Loader2 } from 'lucide-react';
import { Homework, HomeworkResult } from '@/lib/ai/homework';

interface HomeworkModeProps {
  onComplete: (result: HomeworkResult) => void;
}

export default function HomeworkMode({ onComplete }: HomeworkModeProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const {
    studentId,
    classNum,
    subject,
    chapter,
    topic,
    sessionId,
    homework,
    homeworkAnswers,
    setHomework,
    setHomeworkAnswer,
  } = useSessionStore();

  useEffect(() => {
    generateHomework();
  }, []);

  const generateHomework = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/homework/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          sessionId,
          classNum,
          subject,
          chapter,
          topics: [topic],
          difficulty: 'mixed',
          count: 5,
        }),
      });

      const data = await response.json();
      setHomework(data.homework);
    } catch (error) {
      console.error('Error generating homework:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!homework) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/homework/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          sessionId,
          subject,
          chapter,
          homework,
          answers: homeworkAnswers,
        }),
      });

      const data = await response.json();
      onComplete(data.result);
    } catch (error) {
      console.error('Error submitting homework:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Preparing your homework...</p>
        </div>
      </div>
    );
  }

  if (!homework || homework.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Failed to generate homework. Please try again.</p>
        </div>
      </div>
    );
  }

  const question = homework.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / homework.questions.length) * 100;
  const allAnswered = homework.questions.every(q => homeworkAnswers[q.id]?.trim());

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <div className="glass-effect rounded-3xl p-8 shadow-premium border border-white/30 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-glow">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">Homework Time!</h1>
                  <p className="text-sm text-gray-600 font-medium">
                    Question {currentQuestion + 1} of {homework.questions.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-3 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer" style={{
                    backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                    backgroundSize: '200% 100%'
                  }}></div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right font-medium">{Math.round(progress)}% Complete</p>
            </div>
          </div>
        </div>

        <div className="premium-card p-10 mb-8 animate-scale-in">
          <div className="flex items-start gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              question.difficulty === 'easy'
                ? 'bg-green-100 text-green-700'
                : question.difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {question.topic}
            </span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question}
          </h2>

          <textarea
            value={homeworkAnswers[question.id] || ''}
            onChange={(e) => setHomeworkAnswer(question.id, e.target.value)}
            placeholder="Write your answer here..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none"
            rows={6}
          />

          {question.hints && question.hints.length > 0 && (
            <details className="mt-4">
              <summary className="text-sm text-purple-600 cursor-pointer hover:text-purple-700 font-medium">
                Need a hint?
              </summary>
              <div className="mt-2 space-y-2">
                {question.hints.map((hint, idx) => (
                  <p key={idx} className="text-sm text-gray-600 bg-purple-50 p-3 rounded-lg">
                    💡 Hint {idx + 1}: {hint}
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>

          {currentQuestion < homework.questions.length - 1 ? (
            <button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Homework
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>

        {!allAnswered && currentQuestion === homework.questions.length - 1 && (
          <p className="text-sm text-warning-600 text-center mt-4">
            Please answer all questions before submitting
          </p>
        )}
      </div>
    </div>
  );
}
