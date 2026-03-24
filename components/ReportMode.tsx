'use client';

import { HomeworkResult } from '@/lib/ai/homework';
import { Trophy, TrendingUp, TrendingDown, CheckCircle, XCircle, Home } from 'lucide-react';

interface ReportModeProps {
  result: HomeworkResult;
  onExit: () => void;
}

export default function ReportMode({ result, onExit }: ReportModeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-600';
    if (score >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success-50';
    if (score >= 60) return 'bg-warning-50';
    return 'bg-error-50';
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl mb-6 shadow-glow animate-float">
            <Trophy className="w-14 h-14 text-white" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="gradient-text">Great Work!</span>
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Here's how you did on your homework
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className={`glass-effect rounded-3xl p-8 text-center animate-scale-in shadow-premium border border-white/30`}>
            <p className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">Overall Score</p>
            <p className={`text-6xl font-bold ${getScoreColor(result.totalScore)} mb-2`}>
              {Math.round(result.totalScore)}%
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
              <div 
                className={`h-2 rounded-full transition-all duration-1000 ${
                  result.totalScore >= 80 ? 'bg-gradient-to-r from-success-400 to-success-600' :
                  result.totalScore >= 60 ? 'bg-gradient-to-r from-warning-400 to-warning-600' :
                  'bg-gradient-to-r from-error-400 to-error-600'
                }`}
                style={{ width: `${result.totalScore}%` }}
              />
            </div>
          </div>

          <div className="glass-effect rounded-3xl p-8 text-center animate-scale-in shadow-premium border border-white/30" style={{ animationDelay: '0.1s' }}>
            <p className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">Correct Answers</p>
            <p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
              {result.correctAnswers}/{result.totalQuestions}
            </p>
          </div>

          <div className="glass-effect rounded-3xl p-8 text-center animate-scale-in shadow-premium border border-white/30" style={{ animationDelay: '0.2s' }}>
            <p className="text-sm text-gray-700 mb-2 font-semibold uppercase tracking-wide">Accuracy</p>
            <p className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
              {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>
          
          <div className="space-y-4">
            {result.submissions.map((submission, idx) => (
              <div
                key={submission.questionId}
                className={`p-4 rounded-lg border-2 ${
                  submission.isCorrect
                    ? 'border-success-200 bg-success-50'
                    : 'border-error-200 bg-error-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {submission.isCorrect ? (
                      <CheckCircle className="w-6 h-6 text-success-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-error-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Question {idx + 1}
                      </h3>
                      <span className={`text-sm font-medium ${
                        submission.isCorrect ? 'text-success-600' : 'text-error-600'
                      }`}>
                        {submission.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Your answer:</strong> {submission.studentAnswer}
                    </p>
                    <p className="text-sm text-gray-600">
                      {submission.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {result.strengths.length > 0 && (
          <div className="bg-success-50 rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-success-600" />
              <h3 className="text-lg font-semibold text-success-900">Your Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((strength, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm font-medium"
                >
                  {strength}
                </span>
              ))}
            </div>
          </div>
        )}

        {result.weaknesses.length > 0 && (
          <div className="bg-warning-50 rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-6 h-6 text-warning-600" />
              <h3 className="text-lg font-semibold text-warning-900">Areas to Improve</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.weaknesses.map((weakness, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-warning-100 text-warning-700 rounded-full text-sm font-medium"
                >
                  {weakness}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-primary-50 rounded-2xl p-6 mb-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-semibold text-primary-900 mb-2">
            Teacher's Recommendation
          </h3>
          <p className="text-gray-700">{result.recommendation}</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={onExit}
            className="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition flex items-center gap-2 font-medium"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
