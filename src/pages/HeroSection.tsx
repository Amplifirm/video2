// HeroSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Users, Clock, Award, ChevronDown } from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-green-400/10 rounded-xl blur-xl group-hover:bg-green-400/20 transition-colors" />
    <div className="relative bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 group-hover:border-green-400/50 transition-colors h-full">
      <div className="text-green-400 mb-4">{icon}</div>
      <h3 className="font-poppins text-white text-lg font-medium mb-2">{title}</h3>
      <p className="font-poppins text-white/70 text-sm">
        {description}
      </p>
    </div>
  </div>
);

const HeroSection: React.FC = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-20">
      <div className="w-full max-w-7xl mx-auto text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-poppins text-5xl md:text-7xl font-light text-white mb-8 leading-tight"
        >
          Learn the language.
          <br />
          <span className="text-green-400">
            Live the culture.
          </span>
          <br />
          Love the journey.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-poppins text-xl text-white/80 mb-12 max-w-2xl mx-auto"
        >
          Your Ultimate Two-Week English Summer Experience in the UK for students aged 11-17!
        </motion.p>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-green-400 rounded-lg text-black font-poppins font-medium hover:bg-green-300 transition-colors"
          >
            Start Learning
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-white/20 text-white rounded-lg font-poppins hover:bg-white/5 transition-colors"
          >
            Learn More
          </motion.button>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={<Book className="w-8 h-8" />}
            title="Expert Teachers"
            description="Learn from qualified language professionals with years of experience"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Small Classes"
            description="Maximum 15 students per class for personalized attention"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="Flexible Schedule"
            description="Programs that fit your timeline with multiple start dates"
          />
          <FeatureCard
            icon={<Award className="w-8 h-8" />}
            title="Certification"
            description="Internationally recognized qualifications and certificates"
          />
        </div>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <ChevronDown className="w-8 h-8" />
      </motion.div>
    </div>
  );
};

export default HeroSection;