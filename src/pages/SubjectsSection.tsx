import React from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Target,
  BookOpen,
  LineChart,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const SubjectsSection: React.FC = () => {
  const subjects = [
    {
      name: "Mathematics AA/AI",
      icon: Brain,
      description: "Master both Analysis & Approaches and Applications & Interpretation",
      color: "from-blue-500 to-indigo-500"
    },
    {
      name: "Physics",
      icon: Target,
      description: "From mechanics to quantum physics, ace every topic",
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Chemistry",
      icon: BookOpen,
      description: "Perfect your understanding from organic to inorganic chemistry",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Biology",
      icon: LineChart,
      description: "Explore life sciences with comprehensive practice",
      color: "from-amber-500 to-orange-500"
    },
    {
      name: "Economics",
      icon: Users,
      description: "Navigate through micro and macroeconomics with confidence",
      color: "from-red-500 to-rose-500"
    },
    {
      name: "Business Management",
      icon: Sparkles,
      description: "Develop strategic thinking and analytical skills",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 -right-48 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center space-y-4 mb-16 relative"
      >
        <h2 className="text-4xl font-bold text-white">
          Explore Our <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Subjects</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Comprehensive coverage across all major IB subjects with customized practice sessions
        </p>
      </motion.div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {subjects.map((subject, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            className="group"
          >
            <div className="p-8 rounded-2xl bg-[#1e293b]/40 border border-white/10 hover:bg-[#1e293b]/60 transition-all duration-300">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${subject.color} flex items-center justify-center mb-6`}
              >
                <subject.icon className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-semibold text-white mb-3">{subject.name}</h3>
              <p className="text-gray-400 mb-4">{subject.description}</p>
              <motion.button
                whileHover={{ x: 4 }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SubjectsSection;