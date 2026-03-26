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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-accent-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl mb-6 shadow-glow animate-float">
            <GraduationCap className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-3">
            <span className="gradient-text">Welcome to AI Teacher</span>
          </h1>
          <p className="text-lg text-white/90 font-medium">
            Your personal learning companion that remembers and adapts to you
          </p>
        </div>

        <div className="glass-effect rounded-3xl shadow-premium p-8 animate-scale-in border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-primary-600">👤</span>
                What's your name?
              </label>
              <div className="relative group">
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white
                    hover:border-primary-300 hover:bg-white/90
                    outline-none transition-all duration-200 text-lg font-medium text-gray-800
                    placeholder:text-gray-400 placeholder:font-normal
                    shadow-sm hover:shadow-md focus:shadow-glow"
                  placeholder="e.g., Rahul Kumar"
                  required
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <p className="text-xs text-gray-600 ml-1">This helps us personalize your learning experience</p>
            </div>

            {/* Class Dropdown */}
            <div className="space-y-2">
              <label htmlFor="class" className="block text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-primary-600">🎓</span>
                Which class are you in?
              </label>
              <div className="relative group">
                <select
                  id="class"
                  value={classNum}
                  onChange={(e) => setClassNum(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-5 py-4 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl 
                    focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white
                    hover:border-primary-300 hover:bg-white/90
                    outline-none transition-all duration-200 text-lg font-medium text-gray-800
                    shadow-sm hover:shadow-md focus:shadow-glow
                    appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="text-gray-400">Select your class</option>
                  {[6, 7, 8, 9, 10].map((num) => (
                    <option key={num} value={num} className="text-gray-800 font-medium py-2">
                      Class {num} - CBSE
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
              <p className="text-xs text-gray-600 ml-1">We'll customize content based on your curriculum</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !name || !classNum}
              className={`w-full py-4 rounded-xl 
                font-bold text-lg shadow-lg 
                transition-all duration-200 transform 
                relative overflow-hidden group
                ${loading || !name || !classNum 
                  ? 'bg-gray-400 cursor-not-allowed opacity-50' 
                  : 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              
              {loading ? (
                <span className="flex items-center justify-center gap-2 relative z-10">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up your profile...
                </span>
              ) : (
                <span className="relative z-10">Start Learning 🚀</span>
              )}
            </button>

            {/* Validation message */}
            {(!name || !classNum) && (
              <div className="text-center text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <span className="font-medium">Please complete:</span>
                <div className="mt-1 space-y-1">
                  {!name && <div className="text-xs">• Enter your name</div>}
                  {!classNum && <div className="text-xs">• Select your class</div>}
                </div>
              </div>
            )}

            {/* Info text */}
            <p className="text-center text-xs text-gray-600 mt-4">
              Your data is secure and used only to personalize your learning
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
