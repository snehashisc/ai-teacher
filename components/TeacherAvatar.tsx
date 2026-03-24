'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TeacherAvatarProps {
  isSpeaking?: boolean;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'encouraging' | 'explaining';
  size?: 'small' | 'medium' | 'large';
}

export default function TeacherAvatar({ 
  isSpeaking = false, 
  emotion = 'neutral',
  size = 'medium' 
}: TeacherAvatarProps) {
  const [mouthOpen, setMouthOpen] = useState(false);

  // Animate mouth when speaking
  useEffect(() => {
    if (isSpeaking) {
      const interval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 200);
      return () => clearInterval(interval);
    } else {
      setMouthOpen(false);
    }
  }, [isSpeaking]);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  };

  const getEyeExpression = () => {
    switch (emotion) {
      case 'happy':
        return 'M15,25 Q20,22 25,25'; // Curved eyes (smiling)
      case 'thinking':
        return 'M15,23 L25,23'; // Straight line (focused)
      case 'encouraging':
        return 'M15,25 Q20,22 25,25'; // Curved eyes (warm)
      default:
        return 'M15,24 Q20,24 25,24'; // Normal
    }
  };

  const getMouthExpression = () => {
    if (isSpeaking && mouthOpen) {
      return 'M30,45 Q40,50 50,45'; // Open mouth
    }
    
    switch (emotion) {
      case 'happy':
      case 'encouraging':
        return 'M30,45 Q40,48 50,45'; // Smile
      case 'thinking':
        return 'M35,45 L45,45'; // Neutral line
      default:
        return 'M30,45 Q40,46 50,45'; // Slight smile
    }
  };

  const getHandGesture = () => {
    switch (emotion) {
      case 'explaining':
        return { left: -10, right: 10 };
      case 'encouraging':
        return { left: 5, right: 5 };
      default:
        return { left: 0, right: 0 };
    }
  };

  const handGesture = getHandGesture();

  return (
    <motion.div
      className={`${sizeClasses[size]} relative`}
      animate={isSpeaking ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
    >
      <svg viewBox="0 0 80 80" className="w-full h-full">
        {/* Head */}
        <circle
          cx="40"
          cy="35"
          r="25"
          fill="#FCD34D"
          stroke="#F59E0B"
          strokeWidth="2"
        />
        
        {/* Hair */}
        <path
          d="M15,25 Q15,10 25,15 Q30,8 35,12 Q40,5 45,12 Q50,8 55,15 Q65,10 65,25"
          fill="#92400E"
        />
        
        {/* Left Eye */}
        <motion.path
          d={getEyeExpression()}
          stroke="#1F2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={emotion === 'thinking' ? { x: [0, 2, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Right Eye */}
        <motion.path
          d={getEyeExpression()}
          transform="translate(30, 0)"
          stroke="#1F2937"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          animate={emotion === 'thinking' ? { x: [0, 2, 0] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Mouth */}
        <motion.path
          d={getMouthExpression()}
          stroke="#1F2937"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={{ d: getMouthExpression() }}
          transition={{ duration: 0.2 }}
        />
        
        {/* Body */}
        <rect
          x="20"
          y="55"
          width="40"
          height="20"
          rx="5"
          fill="#3B82F6"
        />
        
        {/* Left Hand */}
        <motion.circle
          cx="15"
          cy="65"
          r="4"
          fill="#FCD34D"
          animate={{ x: handGesture.left }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Right Hand */}
        <motion.circle
          cx="65"
          cy="65"
          r="4"
          fill="#FCD34D"
          animate={{ x: handGesture.right }}
          transition={{ duration: 0.5 }}
        />

        {/* Glasses (optional) */}
        <g opacity="0.8">
          <circle cx="20" cy="24" r="6" fill="none" stroke="#1F2937" strokeWidth="1.5" />
          <circle cx="50" cy="24" r="6" fill="none" stroke="#1F2937" strokeWidth="1.5" />
          <line x1="26" y1="24" x2="44" y2="24" stroke="#1F2937" strokeWidth="1.5" />
        </g>
      </svg>

      {/* Thought bubble when thinking */}
      <AnimatePresence>
        {emotion === 'thinking' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute -top-8 -right-8"
          >
            <div className="bg-white rounded-full p-2 shadow-lg">
              <span className="text-2xl">💭</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking indicator */}
      {isSpeaking && (
        <motion.div
          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          <div className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
            Speaking...
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
