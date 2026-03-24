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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hi {studentName}! 👋
          </h1>
          <p className="text-gray-600">
            {!selectedSubject && "Let's start by choosing what you'd like to learn today"}
            {selectedSubject && !selectedChapter && "Great! Now pick a chapter"}
            {selectedSubject && selectedChapter && "Perfect! Choose a topic to begin"}
          </p>
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
                {curriculum.subjects.map((subj) => (
                  <button
                    key={subj.id}
                    onClick={() => setSelectedSubject(subj.id)}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-left group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                          <BookOpen className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {subj.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {subj.chapters.length} chapters
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {selectedSubject && !selectedChapter && subject && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedSubject(null)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Change Subject
            </button>
            <div className="grid gap-4">
              {subject.chapters.map((chap) => (
                <button
                  key={chap.id}
                  onClick={() => setSelectedChapter(chap.id)}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {chap.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {chap.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{chap.topics.length} topics</span>
                        <span className="mx-2">•</span>
                        <span>~{chap.estimatedHours} hours</span>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedSubject && selectedChapter && chapter && (
          <div className="space-y-4">
            <button
              onClick={() => setSelectedChapter(null)}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Change Chapter
            </button>
            <div className="grid gap-3">
              {chapter.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all text-left group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {topic.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          topic.difficulty === 'easy' 
                            ? 'bg-green-100 text-green-700'
                            : topic.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {topic.description}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition ml-4" />
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
