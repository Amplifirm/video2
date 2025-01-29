import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, MotionValue } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Users,
  Sparkles,
  Star,
  Brain,
  Target
} from 'lucide-react';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

interface StyleProps {
  rotateX: MotionValue;
  rotateY: MotionValue;
}

const HeroSection = () => {
  const navigate = useNavigate();
  
  // Parallax effect for logo
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-500, 500], [15, -15]);
  const rotateY = useTransform(x, [-500, 500], [-15, 15]);



  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      x.set(clientX - centerX);
      y.set(clientY - centerY);
      
     
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [x, y]);

  // Floating icons configuration
  const floatingIcons = [
    { Icon: Brain, color: 'text-blue-500', size: 24 },
    { Icon: Target, color: 'text-purple-500', size: 20 },
    { Icon: Star, color: 'text-amber-500', size: 16 },
    { Icon: Sparkles, color: 'text-indigo-500', size: 22 }
  ];

  return (
    <div className="relative min-h-screen pt-32 lg:pt-40 overflow-hidden">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            x: useTransform(x, [-500, 500], [-50, 50]),
            y: useTransform(y, [-500, 500], [-30, 30])
          }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-blue-500/30 
                   rounded-full blur-3xl mix-blend-screen"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            x: useTransform(x, [-500, 500], [50, -50]),
            y: useTransform(y, [-500, 500], [30, -30])
          }}
          className="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-indigo-500/30 
                   rounded-full blur-3xl mix-blend-screen"
        />

        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
                     bg-[size:24px_24px]">
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
          />
        </div>

        {/* Floating elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.5, 1],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}

        {/* Floating icons */}
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: [0.5, 1, 0.5],
              y: [0, -20, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              delay: index * 0.5
            }}
            className={`absolute ${item.color}`}
            style={{
              left: `${20 + index * 25}%`,
              top: `${30 + (index % 3) * 20}%`
            }}
          >
            <item.Icon size={item.size} />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="text-center space-y-8"
        >
          {/* Enhanced Logo Animation */}
          <motion.div
            style={{
              perspective: 1000,
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d'
            } as StyleProps}
            className="space-y-4"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.1 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 200
              }}
              className="relative w-24 h-24 mx-auto group cursor-pointer"
            >
              {/* Glowing background effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 
                         to-indigo-500 blur-xl group-hover:blur-2xl transition-all"
              />
              
              {/* Main logo container */}
              <motion.div
                className="relative w-full h-full rounded-2xl bg-gradient-to-r 
                         from-blue-500 to-indigo-500 flex items-center justify-center 
                         shadow-lg shadow-blue-500/20 border border-white/10"
              >
                <span className="font-serif text-4xl italic font-bold text-white 
                              group-hover:scale-110 transition-transform">x³</span>
              </motion.div>
            </motion.div>

            {/* Title Section */}
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-6xl md:text-7xl font-bold bg-clip-text"
            >
              <span className="text-white inline-block">Master Your </span>
              <motion.span 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 
                         bg-clip-text text-transparent relative inline-block"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                IB Journey
                
                {/* Animated underline */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r 
                           from-blue-500 to-indigo-500 transform origin-left"
                />
              </motion.span>
            </motion.h1>

            {/* Enhanced Description */}
            <motion.p 
              variants={itemVariants}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto"
            >
              Experience the future of IB learning with our{' '}
              <motion.span
                whileHover={{ scale: 1.1 }}
                className="text-blue-400 inline-block cursor-pointer"
              >
                AI-powered
              </motion.span>{' '}
              practice platform. Master your subjects with personalized feedback and real-time analytics.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/signup')}
              className="group relative px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-gradient-to-r 
                       from-blue-500 to-indigo-500 text-white font-semibold 
                       text-base sm:text-lg shadow-lg shadow-blue-500/20 overflow-hidden"
            >
              {/* Button glow effect */}
              <motion.div
                animate={{
                  x: [-100, 200],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: 1
                }}
                className="absolute inset-0 w-full h-full bg-gradient-to-r 
                         from-transparent via-white/20 to-transparent skew-x-12"
              />
              
              <span className="relative z-10 flex items-center gap-2">
                Start Free Trial
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/demo')}
              className="group px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/5 text-white 
                       font-semibold text-base sm:text-lg border border-white/10 
                       hover:bg-white/10 transition-all relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/20 
                         to-indigo-500/20 opacity-0 group-hover:opacity-100 
                         transition-opacity"
              />
              <span className="relative z-10 flex items-center gap-2">
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </span>
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-8"
          >
            {[
              { icon: CheckCircle2, text: "14-Day Free Trial", color: "text-green-500" },
              { icon: Users, text: "10,000+ Students", color: "text-blue-500" },
              { icon: Sparkles, text: "AI-Powered Learning", color: "text-amber-500" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                className="relative group"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
                           to-indigo-500/10 rounded-full blur opacity-0 
                           group-hover:opacity-100 transition-opacity"
                />
                <div className="relative flex items-center gap-2 bg-white/5 
                             px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${item.color}`} />
                  <span className="text-sm sm:text-base text-gray-400">{item.text}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;