'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, BookOpen, Home } from 'lucide-react';
import { useSessionStore, Message } from '@/lib/store/session-store';
import TeacherMessage from './TeacherMessage';
import StudentMessage from './StudentMessage';
import ThinkingIndicator from './ThinkingIndicator';

interface TeachingModeProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function TeachingMode({ onComplete, onExit }: TeachingModeProps) {
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    studentId,
    classNum,
    subject,
    chapter,
    topic,
    sessionId,
    messages,
    isTeacherThinking,
    addMessage,
    setTeacherThinking,
    setMode,
  } = useSessionStore();

  useEffect(() => {
    startLesson();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTeacherThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startLesson = async () => {
    setTeacherThinking(true);
    try {
      const response = await fetch('/api/tutor/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          classNum,
          subject,
          chapter,
          topic,
          sessionId,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        addMessage({
          role: 'teacher',
          content: `Sorry, I encountered an error: ${data.error}. Please make sure your Gemini API key is set correctly.`,
          type: 'explanation',
        });
      } else {
        addMessage({
          role: 'teacher',
          content: data.message,
          type: data.type,
        });
        setConversationHistory(data.conversationHistory || []);
      }
    } catch (error) {
      console.error('Error starting lesson:', error);
      addMessage({
        role: 'teacher',
        content: 'Sorry, I encountered a technical error. Please refresh the page and try again.',
        type: 'explanation',
      });
    } finally {
      setTeacherThinking(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    addMessage({
      role: 'student',
      content: userMessage,
    });

    setTeacherThinking(true);

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          classNum,
          subject,
          chapter,
          topic,
          sessionId,
          message: userMessage,
          conversationHistory,
        }),
      });

      const data = await response.json();
      addMessage({
        role: 'teacher',
        content: data.message,
        type: data.type,
      });
      setConversationHistory(data.conversationHistory || []);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setTeacherThinking(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{chapter}</h2>
              <p className="text-sm text-gray-500">{topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onComplete}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition text-sm font-medium"
            >
              Finish & Get Homework
            </button>
            <button
              onClick={onExit}
              className="p-2 text-gray-600 hover:text-gray-900 transition"
              title="Exit to home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            message.role === 'teacher' ? (
              <TeacherMessage key={message.id} message={message} />
            ) : (
              <StudentMessage key={message.id} message={message} />
            )
          ))}
          
          {isTeacherThinking && <ThinkingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer or ask a question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              disabled={isTeacherThinking}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTeacherThinking}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
