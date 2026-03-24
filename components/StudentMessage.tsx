'use client';

import { Message } from '@/lib/store/session-store';
import { User } from 'lucide-react';

interface StudentMessageProps {
  message: Message;
}

export default function StudentMessage({ message }: StudentMessageProps) {
  return (
    <div className="flex gap-3 justify-end animate-fade-in">
      <div className="flex-1 flex justify-end">
        <div>
          <div className="bg-primary-500 text-white rounded-2xl rounded-tr-none px-4 py-3 max-w-2xl">
            <p className="leading-relaxed">{message.content}</p>
          </div>
          <p className="text-xs text-gray-400 mt-1 mr-2 text-right">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}
