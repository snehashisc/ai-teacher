'use client';

import { Message } from '@/lib/store/session-store';
import { User } from 'lucide-react';

interface StudentMessageProps {
  message: Message;
}

export default function StudentMessage({ message }: StudentMessageProps) {
  return (
    <div className="flex gap-4 justify-end animate-fade-in">
      <div className="flex-1 flex justify-end">
        <div>
          <div className="bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-3xl rounded-tr-none px-6 py-4 max-w-3xl shadow-lg">
            <p className="leading-relaxed text-base">{message.content}</p>
          </div>
          <p className="text-xs text-white/70 mt-2 mr-3 text-right font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center shadow-md">
          <User className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
