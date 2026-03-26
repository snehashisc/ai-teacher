'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, BookOpen, Home } from 'lucide-react';
import { useSessionStore, Message } from '@/lib/store/session-store';
import TeacherMessage from './TeacherMessage';
import StudentMessage from './StudentMessage';
import ThinkingIndicator from './ThinkingIndicator';
import { getSpeechService } from '@/lib/voice/speech';

interface VoiceTeachingModeProps {
  onComplete: () => void;
  onExit: () => void;
}

export default function VoiceTeachingMode({ onComplete, onExit }: VoiceTeachingModeProps) {
  const [input, setInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lessonStarted, setLessonStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const speechService = useRef(getSpeechService());

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
  } = useSessionStore();

  useEffect(() => {
    // Prevent duplicate lesson starts (React Strict Mode runs effects twice)
    if (!lessonStarted) {
      setLessonStarted(true);
      startLesson();
    }
  }, [lessonStarted]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTeacherThinking]);

  // Auto-speak teacher messages
  useEffect(() => {
    if (messages.length > 0 && voiceEnabled) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'teacher' && !isTeacherThinking) {
        speakMessage(lastMessage.content);
      }
    }
  }, [messages, voiceEnabled, isTeacherThinking]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakMessage = (text: string) => {
    setIsSpeaking(true);
    speechService.current.speak(text, {
      rate: 0.9,
      onEnd: () => setIsSpeaking(false),
    });
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
    } finally {
      setTeacherThinking(false);
    }
  };

  const handleSend = async (message?: string) => {
    const userMessage = message || input;
    if (!userMessage.trim()) return;

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

  const handleVoiceInput = () => {
    if (isListening) {
      speechService.current.stopListening();
      setIsListening(false);
      setInterimTranscript('');
      return;
    }

    // Stop teacher if speaking
    if (isSpeaking) {
      speechService.current.stopSpeaking();
      setIsSpeaking(false);
    }

    setIsListening(true);
    setInterimTranscript('');
    speechService.current.startListening(
      (transcript) => {
        setIsListening(false);
        setInterimTranscript('');
        setInput(transcript);
        handleSend(transcript);
      },
      (error) => {
        setIsListening(false);
        setInterimTranscript('');
        console.error('Voice input error:', error);
        alert('Could not understand. Please try again or type your answer.');
      },
      (interim) => {
        // Show interim results
        setInterimTranscript(interim);
      }
    );
  };

  const toggleVoice = () => {
    if (voiceEnabled && isSpeaking) {
      speechService.current.stopSpeaking();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass-effect border-b border-white/30 px-4 py-5 sticky top-0 z-10 shadow-lg">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">{chapter}</h2>
              <p className="text-sm text-gray-600 font-medium">{topic}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleVoice}
              className={`p-3 rounded-xl transition-all shadow-md ${
                voiceEnabled 
                  ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-glow' 
                  : 'bg-white text-gray-400 hover:bg-gray-50'
              }`}
              title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
            >
              {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <button
              onClick={onComplete}
              className="px-5 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:shadow-glow transition-all text-sm font-semibold"
            >
              Finish & Get Homework
            </button>
            <button
              onClick={onExit}
              className="p-3 text-gray-600 hover:text-gray-900 transition rounded-xl hover:bg-white/50"
              title="Exit to home"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {messages.map((message, index) => (
            message.role === 'teacher' ? (
              <TeacherMessage 
                key={message.id} 
                message={message}
                isSpeaking={isSpeaking && index === messages.length - 1}
              />
            ) : (
              <StudentMessage key={message.id} message={message} />
            )
          ))}
          
          {isTeacherThinking && <ThinkingIndicator />}
          
          {isSpeaking && (
            <div className="flex justify-center">
              <div className="bg-primary-100 px-4 py-2 rounded-full flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary-600 animate-pulse" />
                <span className="text-sm text-primary-700 font-medium">Teacher is speaking...</span>
              </div>
            </div>
          )}

          {isListening && (
            <div className="flex justify-center">
              <div className="glass-effect px-6 py-4 rounded-2xl flex flex-col items-center gap-3 shadow-glow">
                <div className="flex items-center gap-2">
                  <Mic className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="text-sm text-gray-700 font-semibold">Listening...</span>
                </div>
                {interimTranscript && (
                  <div className="text-sm text-gray-600 italic max-w-md text-center">
                    "{interimTranscript}"
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Speak now or click mic to stop
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="glass-effect border-t border-white/30 px-4 py-5 sticky bottom-0 shadow-premium">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-3">
            <button
              onClick={handleVoiceInput}
              disabled={isTeacherThinking || isSpeaking}
              className={`p-4 rounded-2xl transition-all flex-shrink-0 shadow-lg ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-glow animate-pulse'
                  : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-glow'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isListening ? 'Stop listening' : 'Speak your answer'}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </button>
            
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your answer or click the mic to speak..."
              className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg bg-white/80 backdrop-blur-sm"
              disabled={isTeacherThinking || isListening}
            />
            
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTeacherThinking || isListening}
              className="px-7 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-2xl hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-semibold shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-sm text-gray-700 text-center mt-3 font-medium">
            {voiceEnabled ? '🎤 Voice mode active - Teacher will speak responses' : '🔇 Voice mode off'}
          </p>
        </div>
      </footer>
    </div>
  );
}
