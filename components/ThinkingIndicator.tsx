'use client';

export default function ThinkingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">AI</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="bg-primary-50 rounded-2xl rounded-tl-none px-4 py-3 max-w-xs">
          <div className="flex items-center gap-2 text-primary-600">
            <span className="text-sm font-medium">Teacher is thinking</span>
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
