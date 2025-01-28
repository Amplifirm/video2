import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import type { SubjectConfig } from '../../config/subjectConfig';

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  config: SubjectConfig;
  comingSoon?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  config,
  comingSoon = false
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-xl 
               shadow-lg border border-white/20 p-6"
    style={{ backgroundImage: config.decorativePattern }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${config.lightGradient}`}>
        <Icon className={`w-5 h-5 ${config.accent}`} />
      </div>
      <h3 className="font-medium text-gray-700">{title}</h3>
      {comingSoon && (
        <span className="px-2 py-1 text-xs font-medium text-white bg-gradient-to-br from-purple-500 
                      to-indigo-500 rounded-full ml-auto shadow-md">
          Soon
        </span>
      )}
    </div>
    <p className="text-2xl font-bold bg-gradient-to-br from-gray-800 to-gray-600 bg-clip-text text-transparent">
      {value}
    </p>
  </motion.div>
);