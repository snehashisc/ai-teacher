'use client';

import { Message } from '@/lib/store/session-store';
import { CheckCircle, AlertCircle, Lightbulb, MessageCircle } from 'lucide-react';
import TeacherAvatar from './TeacherAvatar';

interface TeacherMessageProps {
  message: Message;
  isSpeaking?: boolean;
}

export default function TeacherMessage({ message, isSpeaking = false }: TeacherMessageProps) {
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
      return message.isCorrect 
        ? 'bg-gradient-to-br from-success-50 to-success-100 border-success-300' 
        : 'bg-gradient-to-br from-warning-50 to-warning-100 border-warning-300';
    }
    return 'bg-gradient-to-br from-white to-primary-50 border-primary-200';
  };

  const getEmotion = () => {
    if (message.type === 'encouragement') return 'encouraging';
    if (message.type === 'feedback') return message.isCorrect ? 'happy' : 'neutral';
    if (message.type === 'explanation') return 'explaining';
    if (message.type === 'question') return 'thinking';
    return 'neutral';
  };

  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0">
        <TeacherAvatar 
          isSpeaking={isSpeaking}
          emotion={getEmotion()}
          size="small"
        />
      </div>
      <div className="flex-1">
        <div className={`${getBgColor()} rounded-3xl rounded-tl-none px-6 py-4 max-w-3xl border-2 shadow-premium`}>
          <div className="flex items-start gap-3">
            {getIcon()}
            <p className="text-gray-800 leading-relaxed text-base">{message.content}</p>
          </div>
        </div>
        <p className="text-xs text-white/70 mt-2 ml-3 font-medium">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
