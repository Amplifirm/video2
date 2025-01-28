import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { SubjectConfig } from '../../config/subjectConfig';


interface ActionButtonProps {
  icon: LucideIcon;
  title: string;
  description: string;
  config: SubjectConfig;
  onClick?: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  title,
  description,
  config,
  onClick
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    className="group relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-xl 
               shadow-lg border border-white/20 p-6 w-full text-left"
    style={{ backgroundImage: config.decorativePattern }}
  >
    <div className="flex items-center gap-4">
      <motion.div
        whileHover={{ rotate: 15 }}
        className={`p-3 rounded-xl bg-gradient-to-br ${config.lightGradient} 
                   transition-transform duration-300 group-hover:scale-110`}
      >
        <Icon className={`w-6 h-6 ${config.accent}`} />
      </motion.div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </div>
  </motion.button>
);