import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  LineChart,
  BookOpen
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Learning",
      description: "Personalized learning paths that adapt to your understanding level. Our AI analyzes your performance to create custom practice sessions."
    },
    {
      icon: Target,
      title: "Topic Focus",
      description: "Master specific topics with targeted practice. Identify weaknesses and transform them into strengths with detailed analytics."
    },
    {
      icon: LineChart,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics. Watch your scores improve as you work through our tailored question sets."
    },
    {
      icon: BookOpen,
      title: "Full IB Coverage",
      description: "Comprehensive coverage across all IB subjects. From Math AA to Business Management, we've got your entire curriculum covered."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 relative"
      >
        <h2 className="text-4xl font-bold text-white">
          Why Choose <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">IB Practice</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Built specifically for IB students, our platform combines AI technology with expert knowledge
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <div className="p-8 rounded-2xl bg-[#1e293b]/40 border border-white/10 hover:bg-[#1e293b]/60 transition-colors duration-300">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center mb-6"
              >
                <feature.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;