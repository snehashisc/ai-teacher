'use client';

import { useState } from 'react';
import { getCurriculum } from '@/lib/curriculum';
import { BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';

interface SubjectSelectionProps {
  classNum: number;
  studentName: string;
  onSelect: (subject: string, chapter: string, topic: string) => void;
  onBack?: () => void;
}

export default function SubjectSelection({ 
  classNum, 
  studentName, 
  onSelect,
  onBack 
}: SubjectSelectionProps) {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  const curriculum = getCurriculum(classNum);
  const subject = selectedSubject 
    ? curriculum?.subjects.find(s => s.id === selectedSubject)
    : null;
  const chapter = selectedChapter && subject
    ? subject.chapters.find(c => c.id === selectedChapter)
    : null;

  const handleTopicSelect = (topicId: string) => {
    if (selectedSubject && selectedChapter) {
      onSelect(selectedSubject, selectedChapter, topicId);
    }
  };

  // Debug logging
  if (!curriculum) {
    console.error('No curriculum found for class:', classNum);
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          {onBack && (
            <button
              onClick={onBack}
              className="glass-effect px-4 py-2 rounded-xl flex items-center text-gray-700 hover:text-primary-600 mb-6 transition-all hover:shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back</span>
            </button>
          )}
          <div className="glass-effect rounded-3xl p-8 shadow-premium border border-white/30">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              <span className="gradient-text">Hi {studentName}! 👋</span>
            </h1>
            <p className="text-xl text-gray-700 font-medium">
              {!selectedSubject && "Let's start by choosing what you'd like to learn today"}
              {selectedSubject && !selectedChapter && "Great! Now pick a chapter"}
              {selectedSubject && selectedChapter && "Perfect! Choose a topic to begin"}
            </p>
          </div>
        </div>

        {!selectedSubject && (
          <>
            {!curriculum || !curriculum.subjects || curriculum.subjects.length === 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                <p className="text-yellow-800 mb-2">
                  No curriculum available for Class {classNum} yet.
                </p>
                <p className="text-sm text-yellow-600">
                  We're working on adding more content. For now, try Class 6!
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {curriculum.subjects.map((subj, idx) => (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    className="premium-card p-8 text-left group hover:scale-[1.02] transform transition-all animate-slide-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mr-5 shadow-lg group-hover:shadow-glow transition-all">
                          <BookOpen className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            {subj.name}
                          </h3>
                          <p className="text-sm text-gray-500 font-medium">
                            {subj.chapters.length} chapters • Interactive learning
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedSubject && !selectedChapter && subject && (
          <div className="space-y-5">
            <button
              onClick={() => setSelectedSubject(null)}
              className="glass-effect px-5 py-2 rounded-xl text-primary-600 hover:text-primary-700 font-semibold transition-all hover:shadow-lg"
            >
              ← Change Subject
            </button>
            <div className="grid gap-5">
              {subject.chapters.map((chap, idx) => (
                <button
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap.id)}
                  className="premium-card p-7 text-left group hover:scale-[1.01] transform transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition">
                        {chap.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {chap.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full">
                          {chap.topics.length} topics
                        </span>
                        <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full">
                          ~{chap.estimatedHours} hours
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all ml-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && selectedChapter && chapter && (
          <div className="space-y-5">
            <button
              onClick={() => setSelectedChapter(null)}
              className="glass-effect px-5 py-2 rounded-xl text-primary-600 hover:text-primary-700 font-semibold transition-all hover:shadow-lg"
            >
              ← Change Chapter
            </button>
            <div className="grid gap-4">
              {chapter.topics.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className="premium-card p-6 text-left group hover:scale-[1.01] transform transition-all animate-slide-up"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition">
                          {topic.name}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          topic.difficulty === 'easy' 
                            ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                            : topic.difficulty === 'medium'
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'
                            : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
                        }`}>
                          {(topic.difficulty || 'medium').toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {topic.description}
                      </p>
                    </div>
                    <ChevronRight className="w-7 h-7 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all ml-4" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
