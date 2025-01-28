import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getSubjectConfig } from '../../config/subjectConfig';
import type { Subject } from './types';

interface SubjectButtonProps {
  subject: Subject;
  isSelected: boolean;
  onSelect: () => void;
}

export const SubjectButton: React.FC<SubjectButtonProps> = ({
  subject,
  isSelected,
  onSelect
}) => {
  const config = getSubjectConfig(subject.name);
  const Icon = config.icon;
  
  return (
    <motion.button
      whileHover={{ x: 4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      className={`w-full p-4 rounded-xl flex items-center gap-3 transition-all duration-300
                backdrop-blur-sm border border-transparent
                ${isSelected 
                  ? `bg-gradient-to-br ${config.gradient} text-white shadow-lg border-white/20` 
                  : 'bg-white/60 hover:bg-white/80 text-gray-700 hover:shadow-md'}`}
      style={{
        backgroundImage: isSelected ? undefined : config.decorativePattern
      }}
    >
      <motion.div
        whileHover={{ rotate: 15 }}
        className={isSelected ? 'text-white' : config.accent}
      >
        <Icon className="w-5 h-5" />
      </motion.div>
      <div className="flex-1 text-left">
        <div className="font-medium">{subject.name}</div>
        <div className={`text-sm ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
          {subject.level}
        </div>
      </div>
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.div>
      )}
    </motion.button>
  );
};