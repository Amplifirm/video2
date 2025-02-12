import React from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const hieroglyphs = ["𓀀", "𓀁", "𓀂", "𓀃", "𓀄", "𓀅", "𓀆", "𓀇", "𓀈", "𓀉", "𓀊", "𓀋"];
  
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 3.5 }}
      onAnimationComplete={onLoadingComplete}
      className="fixed inset-0 z-[60] bg-[#2B1810] flex items-center justify-center"
    >
      <div className="relative">
        {/* Circular hieroglyph animation */}
        <div className="relative w-32 h-32">
          {hieroglyphs.map((glyph, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, rotate: (index * 30) }}
              animate={{ 
                opacity: [0, 1, 0],
                rotate: [(index * 30), (index * 30) + 360]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "linear"
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                transformOrigin: `0 ${64}px`
              }}
            >
              <span className="text-[#E3B04B] text-2xl">{glyph}</span>
            </motion.div>
          ))}
        </div>

        {/* Central ankh symbol */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl text-[#E3B04B]"
        >
          𓋹
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-white/80 text-sm tracking-[0.3em]"
        >
          DISCOVERING ANCIENT WONDERS
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;