'use client';

import { useState } from 'react';
import { GraduationCap } from 'lucide-react';

interface StudentSetupProps {
  onComplete: (studentId: string, name: string, classNum: number) => void;
}

export default function StudentSetup({ onComplete }: StudentSetupProps) {
  const [name, setName] = useState('');
  const [classNum, setClassNum] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !classNum) return;

    setLoading(true);
    try {
      const response = await fetch('/api/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, classNum: Number(classNum) }),
      });

      const data = await response.json();
      onComplete(data.student.id, data.student.name, data.student.class);
    } catch (error) {
      console.error('Error setting up student:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-500 rounded-full mb-4">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to AI Teacher
          </h1>
          <p className="text-gray-600">
            Your personal learning companion that remembers and adapts to you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                What's your name?
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                placeholder="Enter your name"
                required
              />
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                Which class are you in?
              </label>
              <select
                id="class"
                value={classNum}
                onChange={(e) => setClassNum(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select your class</option>
                {[6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    Class {num}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !classNum}
              className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Setting up...' : 'Start Learning'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
