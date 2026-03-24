'use client';

import TeacherAvatar from './TeacherAvatar';

export default function ThinkingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0">
        <TeacherAvatar 
          isSpeaking={false}
          emotion="thinking"
          size="small"
        />
      </div>
      <div className="flex-1">
        <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-3xl rounded-tl-none px-6 py-4 max-w-md border-2 border-primary-200 shadow-lg">
          <div className="flex items-center gap-3 text-primary-600">
            <span className="text-base font-semibold">Teacher is thinking</span>
            <div className="thinking-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
