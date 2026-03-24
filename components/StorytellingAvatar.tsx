'use client';

import { motion } from 'framer-motion';
import { Book, Sparkles } from 'lucide-react';

interface StorytellingAvatarProps {
  isActive: boolean;
  storyPhase?: 'intro' | 'middle' | 'climax' | 'conclusion';
}

export default function StorytellingAvatar({ 
  isActive, 
  storyPhase = 'intro' 
}: StorytellingAvatarProps) {
  
  const getBackgroundColor = () => {
    switch (storyPhase) {
      case 'intro': return 'from-blue-400 to-purple-400';
      case 'middle': return 'from-purple-400 to-pink-400';
      case 'climax': return 'from-pink-400 to-red-400';
      case 'conclusion': return 'from-green-400 to-blue-400';
      default: return 'from-blue-400 to-purple-400';
    }
  };

  return (
    <div className="relative">
      {/* Magical background */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${getBackgroundColor()} rounded-3xl blur-2xl opacity-30`}
        animate={isActive ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Main avatar container */}
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center justify-center mb-4">
          {/* Animated teacher with book */}
          <motion.div
            animate={isActive ? { 
              rotateY: [0, 10, -10, 0],
              y: [0, -5, 0]
            } : {}}
            transition={{ duration: 4, repeat: Infinity }}
            className="relative"
          >
            <svg viewBox="0 0 120 120" className="w-32 h-32">
              {/* Teacher body */}
              <circle cx="60" cy="45" r="30" fill="#FCD34D" />
              <rect x="40" y="70" width="40" height="30" rx="8" fill="#3B82F6" />
              
              {/* Smiling face */}
              <circle cx="52" cy="40" r="3" fill="#1F2937" />
              <circle cx="68" cy="40" r="3" fill="#1F2937" />
              <path d="M45,52 Q60,58 75,52" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              
              {/* Hair */}
              <path d="M30,35 Q30,15 45,20 Q55,10 60,18 Q65,10 75,20 Q90,15 90,35" fill="#92400E" />
              
              {/* Book in hand */}
              <g transform="translate(20, 75)">
                <rect x="0" y="0" width="25" height="18" rx="2" fill="#EF4444" />
                <line x1="12.5" y1="0" x2="12.5" y2="18" stroke="#DC2626" strokeWidth="1" />
                <text x="6" y="12" fontSize="10" fill="white">📖</text>
              </g>
            </svg>
          </motion.div>
        </div>

        {/* Floating sparkles */}
        <AnimatePresence>
          {isActive && (
            <>
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ 
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    opacity: 0 
                  }}
                  animate={{ 
                    y: [null, Math.random() * -50 - 20],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  style={{
                    left: `${20 + i * 15}%`,
                    top: '50%'
                  }}
                >
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Story mode indicator */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4"
          >
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full">
              <Book className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-700">
                Story Time
              </span>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
