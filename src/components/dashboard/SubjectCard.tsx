import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Trophy, LineChart, Info } from 'lucide-react';
import { getSubjectConfig } from '../../config/subjectConfig';
import { StatCard } from './StatCard';
import { ActionButton } from './ActionButton';
import type { Subject } from './types';

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const config = getSubjectConfig(subject.name);
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Subject Header */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 
                   rounded-xl shadow-xl p-8 text-white"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ rotate: 15 }}
            className={`p-4 rounded-xl bg-gradient-to-br ${config.gradient} shadow-lg`}
          >
            <Icon className="w-8 h-8" />
          </motion.div>
          <div>
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold"
            >
              {subject.name}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 mt-1"
            >
              {subject.level} • Group {subject.group}
            </motion.p>
          </div>
        </div>

        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.2) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`
          }} />
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Questions Generated"
          value="0"
          icon={Brain}
          config={config}
          comingSoon
        />
        <StatCard
          title="Practice Papers"
          value="0"
          icon={Trophy}
          config={config}
          comingSoon
        />
        <StatCard
          title="Average Score"
          value="N/A"
          icon={LineChart}
          config={config}
          comingSoon
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionButton
          icon={Brain}
          title="Generate Questions"
          description="AI-powered IB practice questions"
          config={config}
        />
        <ActionButton
          icon={Trophy}
          title="Practice Papers"
          description="Full exam simulation"
          config={config}
        />
      </div>

      {/* Coming Soon Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-xl 
                   shadow-lg border border-white/20 p-6"
        style={{ backgroundImage: config.decorativePattern }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${config.lightGradient}`}>
            <Info className={`w-5 h-5 ${config.accent}`} />
          </div>
          <h3 className="font-medium text-gray-900">More Features Coming Soon</h3>
        </div>
        <div className="h-40 flex items-center justify-center border border-dashed rounded-lg">
          <p className="text-gray-500">
            We're working on more tools to help with your IB journey!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};