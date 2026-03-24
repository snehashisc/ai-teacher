'use client';

import { motion } from 'framer-motion';
import { Lightbulb, Brain, Target } from 'lucide-react';

interface ConceptExplanationAvatarProps {
  isExplaining: boolean;
  concept?: string;
  step?: number;
  totalSteps?: number;
}

export default function ConceptExplanationAvatar({ 
  isExplaining,
  concept,
  step = 1,
  totalSteps = 3
}: ConceptExplanationAvatarProps) {
  
  return (
    <div className="relative">
      {/* Main avatar */}
      <motion.div
        className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200"
        animate={isExplaining ? { 
          boxShadow: [
            '0 0 0 0 rgba(59, 130, 246, 0)',
            '0 0 0 10px rgba(59, 130, 246, 0.1)',
            '0 0 0 0 rgba(59, 130, 246, 0)'
          ]
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-start gap-4">
          {/* Teacher avatar */}
          <motion.div
            animate={isExplaining ? { rotate: [0, -5, 5, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg viewBox="0 0 80 80" className="w-20 h-20">
              {/* Head */}
              <circle cx="40" cy="30" r="20" fill="#FCD34D" />
              
              {/* Hair */}
              <path d="M20,25 Q20,12 30,15 Q35,8 40,12 Q45,8 50,15 Q60,12 60,25" fill="#92400E" />
              
              {/* Eyes - focused */}
              <circle cx="33" cy="28" r="2" fill="#1F2937" />
              <circle cx="47" cy="28" r="2" fill="#1F2937" />
              
              {/* Glasses */}
              <circle cx="33" cy="28" r="5" fill="none" stroke="#1F2937" strokeWidth="1" />
              <circle cx="47" cy="28" r="5" fill="none" stroke="#1F2937" strokeWidth="1" />
              <line x1="38" y1="28" x2="42" y2="28" stroke="#1F2937" strokeWidth="1" />
              
              {/* Mouth - explaining */}
              <motion.path
                d="M32,36 Q40,38 48,36"
                stroke="#1F2937"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                animate={isExplaining ? { d: [
                  "M32,36 Q40,38 48,36",
                  "M32,36 Q40,40 48,36",
                  "M32,36 Q40,38 48,36"
                ]} : {}}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
              
              {/* Body */}
              <rect x="25" y="48" width="30" height="25" rx="5" fill="#3B82F6" />
              
              {/* Pointer hand */}
              <motion.g
                animate={isExplaining ? { 
                  x: [0, 5, 0],
                  y: [0, -2, 0]
                } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <circle cx="60" cy="55" r="4" fill="#FCD34D" />
                <line x1="60" y1="55" x2="70" y2="50" stroke="#FCD34D" strokeWidth="3" strokeLinecap="round" />
              </motion.g>
            </svg>
          </motion.div>

          {/* Explanation content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                {concept || 'Explaining Concept'}
              </h3>
            </div>
            
            {/* Progress steps */}
            <div className="flex items-center gap-2 mb-3">
              {[...Array(totalSteps)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 flex-1 rounded-full ${
                    i < step ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: i < step ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </div>

            <p className="text-sm text-gray-600">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Lightbulb for key insights */}
        {isExplaining && (
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="bg-yellow-400 rounded-full p-2 shadow-lg">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Floating concept bubbles */}
      {isExplaining && (
        <div className="absolute inset-0 pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * 100,
                y: 100,
                opacity: 0 
              }}
              animate={{ 
                y: -50,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 3,
                delay: i * 0.8,
                repeat: Infinity
              }}
              style={{ left: `${i * 30}%` }}
            >
              <div className="bg-blue-100 rounded-full p-2">
                <Target className="w-3 h-3 text-blue-600" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
