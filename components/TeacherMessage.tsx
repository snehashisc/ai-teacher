'use client';

import { Message } from '@/lib/store/session-store';
import { CheckCircle, AlertCircle, Lightbulb, MessageCircle } from 'lucide-react';

interface TeacherMessageProps {
  message: Message;
}

export default function TeacherMessage({ message }: TeacherMessageProps) {
  const getIcon = () => {
    switch (message.type) {
      case 'feedback':
        return message.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-success-500" />
        ) : (
          <AlertCircle className="w-5 h-5 text-warning-500" />
        );
      case 'question':
        return <MessageCircle className="w-5 h-5 text-primary-500" />;
      case 'encouragement':
        return <CheckCircle className="w-5 h-5 text-success-500" />;
      default:
        return <Lightbulb className="w-5 h-5 text-primary-500" />;
    }
  };

  const getBgColor = () => {
    if (message.type === 'feedback') {
      return message.isCorrect ? 'bg-success-50' : 'bg-warning-50';
    }
    return 'bg-primary-50';
  };

  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">AI</span>
        </div>
      </div>
      <div className="flex-1">
        <div className={`${getBgColor()} rounded-2xl rounded-tl-none px-4 py-3 max-w-2xl`}>
          <div className="flex items-start gap-2">
            {getIcon()}
            <p className="text-gray-800 leading-relaxed">{message.content}</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
