import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, AnimatePresence } from 'framer-motion';
import {
  UserPlus,
  Layout,
  Brain,
  LineChart,
  ArrowRight,
  CheckCircle2,
  Target,
  Sparkles,
  
  BookOpen,

  Zap,

  LucideIcon
} from 'lucide-react';

// Interfaces for type safety
interface StatItem {
  label: string;
  value: string;
  growth?: string;
}

interface PreviewData {
  title: string;
  stats: StatItem[];
  graphData?: { x: number; y: number; }[];
  demoContent?: React.ReactNode;
}

interface Feature {
  text: string;
  icon: LucideIcon;
  animation?: string;
}

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  features: Feature[];
  preview: PreviewData;
}

// Define steps array with proper typing
const steps: Step[] = [
  {
    icon: UserPlus,
    title: "Create Your Profile",
    description: "Set up your personalized learning journey in minutes",
    color: "from-blue-500 to-indigo-500",
    features: [
      { text: "Choose your IB subjects", icon: BookOpen },
      { text: "Set your target scores", icon: Target },
      { text: "Customize study schedule", icon: Layout },
      { text: "Select focus areas", icon: Brain }
    ],
    preview: {
      title: "Profile Setup",
      stats: [
        { label: "Subjects", value: "6" },
        { label: "Study Hours", value: "25/week" },
        { label: "Target Score", value: "42/45" }
      ]
    }
  },
  {
    icon: Layout,
    title: "Access Dashboard",
    description: "Your personalized command center for IB mastery",
    color: "from-purple-500 to-pink-500",
    features: [
      { text: "Real-time progress tracking", icon: LineChart },
      { text: "AI-powered recommendations", icon: Brain },
      { text: "Study streak monitoring", icon: Zap },
      { text: "Performance analytics", icon: Target }
    ],
    preview: {
      title: "Dashboard Overview",
      stats: [
        { label: "Progress", value: "78%", growth: "+12%" },
        { label: "Streak", value: "12 days" },
        { label: "Score", value: "6.8/7" }
      ]
    }
  },
  {
    icon: Brain,
    title: "Start Practice",
    description: "Dive into AI-guided practice sessions",
    color: "from-amber-500 to-orange-500",
    features: [
      { text: "Adaptive difficulty", icon: Target },
      { text: "Step-by-step solutions", icon: CheckCircle2 },
      { text: "Real-time feedback", icon: Zap },
      { text: "Mastery tracking", icon: LineChart }
    ],
    preview: {
      title: "Practice Session",
      stats: [
        { label: "Questions", value: "150+" },
        { label: "Topics", value: "25" },
        { label: "Time", value: "45 min" }
      ]
    }
  },
  {
    icon: LineChart,
    title: "Track Progress",
    description: "Watch your improvement with detailed analytics",
    color: "from-green-500 to-emerald-500",
    features: [
      { text: "Performance metrics", icon: LineChart },
      { text: "Skill gap analysis", icon: Target },
      { text: "Progress predictions", icon: Brain },
      { text: "Custom study plans", icon: Layout }
    ],
    preview: {
      title: "Analytics Dashboard",
      stats: [
        { label: "Growth", value: "+27%", growth: "+5%" },
        { label: "Mastered", value: "85" },
        { label: "Hours", value: "120" }
      ]
    }
  }
];

// Type for particle configuration
interface Particle {
  id: number;
  initialX: number;
  initialY: number;
  size: number;
  speed: number;
}

// Props interfaces
interface FeatureItemProps {
  feature: Feature;
  color: string;
  index: number;
}

interface PreviewCardProps {
  data: PreviewData;
  color: string;
  isActive: boolean;
}

// Components with proper typing
const ParticleSystem: React.FC = () => {
  const generateParticles = (count: number): Particle[] => 
    Array.from({ length: count }, (_, i) => ({
      id: i,
      initialX: Math.random() * window.innerWidth,
      initialY: Math.random() * window.innerHeight,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1
    }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {generateParticles(50).map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          style={{
            width: particle.size,
            height: particle.size
          }}
          animate={{
            x: [particle.initialX, particle.initialX + 100, particle.initialX],
            y: [particle.initialY, particle.initialY - 100, particle.initialY],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 10 / particle.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const FeatureItem: React.FC<FeatureItemProps> = ({ feature, color, index }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
      className="group relative"
    >
      <motion.div
        className={`flex items-center gap-3 p-3 rounded-xl border border-white/5 
                   bg-[#1e293b]/30 backdrop-blur-sm hover:bg-[#1e293b]/50 
                   transition-colors duration-300`}
      >
        <motion.div
          whileHover={{ rotate: 360 }}
          className={`w-10 h-10 rounded-lg bg-gradient-to-r ${color} 
                   flex items-center justify-center relative group`}
        >
          <Icon className="w-5 h-5 text-white relative z-10" />
        </motion.div>
        <span className="text-gray-300 group-hover:text-white transition-colors">
          {feature.text}
        </span>
      </motion.div>
    </motion.div>
  );
};

const CustomCursor: React.FC<{ mousePosition: { x: number; y: number } }> = ({ mousePosition }) => (
    <motion.div
      className="pointer-events-none absolute w-4 h-4 z-50"
      animate={{
        x: mousePosition.x - 8,
        y: mousePosition.y - 8,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5
      }}
    >
      {/* Outer ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-white/30"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      />
      {/* Inner dot */}
      <motion.div
        className="absolute inset-[6px] rounded-full bg-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
      />
    </motion.div>
  );
  
  const PreviewCard: React.FC<PreviewCardProps> = ({ data, color, isActive }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
  
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
  
    return (
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`relative p-6 rounded-2xl backdrop-blur-xl border border-white/10 
                   ${isActive ? 'bg-[#0f172a]/90' : 'bg-[#0f172a]/70'}
                   overflow-hidden cursor-none`} // Hide default cursor
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-white font-medium">{data.title}</h4>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`w-8 h-8 rounded-full bg-gradient-to-r ${color} 
                     flex items-center justify-center`}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
        </div>
  
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {data.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: i * 0.1 }}
              className="text-center space-y-1"
            >
              <motion.div
                className={`text-2xl font-bold bg-gradient-to-r ${color} 
                         bg-clip-text text-transparent`}
              >
                {stat.value}
              </motion.div>
              <div className="text-sm text-gray-500">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
  
        {/* Preview Area */}
        <motion.div
          className="relative h-32 rounded-xl bg-[#1e293b]/30 border border-white/5 
                     overflow-hidden group"
        >
          {/* Grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
                       bg-[size:16px_16px]" />
  
          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 
                       transition-opacity duration-500"
            style={{
              background: `linear-gradient(45deg, ${color.split(' ')[1]}/10 25%, transparent 25%, transparent 75%, ${color.split(' ')[1]}/10 75%)`
            }}
          />
  
          {/* Interactive content area */}
          <div className="relative h-full flex items-center justify-center">
            <motion.div
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-gray-400"
            >
              Hover to interact
            </motion.div>
          </div>
        </motion.div>
  
        {/* Custom cursor */}
        <AnimatePresence>
          {isHovering && <CustomCursor mousePosition={mousePosition} />}
        </AnimatePresence>
  
        {/* Radial gradient that follows cursor */}
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, ${color.split(' ')[1]}/10, transparent)`
          }}
        />
      </motion.div>
    );
  };
   

// Main StepsSection component
const StepsSection = () => {
  const [activeStep] = useState(0);
  const containerRef = useRef(null);
  const mouseY = useMotionValue(0);
  const mouseX = useMotionValue(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      mouseX.set(clientX - centerX);
      mouseY.set(clientY - centerY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0">
        <ParticleSystem />
        
        {/* Responsive grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
                     bg-[size:24px_24px]">
          <motion.div
            style={{ opacity: smoothProgress }}
            className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-purple-500/10 
                     to-pink-500/10"
          />
        </div>

        {/* Mouse-following gradient */}
        <motion.div
          style={{
            x: useTransform(mouseX, [-500, 500], [-100, 100]),
            y: useTransform(mouseY, [-500, 500], [-100, 100])
          }}
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 
                   -translate-y-1/2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 
                   rounded-full blur-3xl pointer-events-none mix-blend-screen"
        />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16 lg:mb-24"
        >
          {/* Animated icon */}
          <div className="relative mx-auto w-24 h-24">
            {/* Rotating outer ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-blue-500/20"
            />
            {/* Counter-rotating middle ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-indigo-500/20"
            />
            {/* Pulsing center */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-4 rounded-2xl bg-gradient-to-r from-blue-500 
                       to-indigo-500 flex items-center justify-center"
            >
              <Target className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Animated title */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h2 className="text-4xl lg:text-5xl font-bold">
              <span className="text-white">Your Journey to </span>
              <motion.span
                className="bg-gradient-to-r from-blue-500 to-indigo-500 
                         bg-clip-text text-transparent relative inline-block"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
              >
                IB Excellence
              </motion.span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Follow these simple steps to transform your IB experience with
              our AI-powered platform
            </p>
          </motion.div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid gap-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative"
            >
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  className={`absolute left-10 top-24 w-1 h-[calc(100%+4rem)] 
                           bg-gradient-to-b ${step.color}/20 origin-top hidden lg:block`}
                />
              )}

              {/* Step content */}
              <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Left column: Info */}
                <div className="space-y-8">
                  {/* Step header */}
                  <div className="flex items-center gap-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${step.color} 
                               flex items-center justify-center relative group`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute inset-0 bg-white/20 rounded-2xl 
                                 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                      <span className="text-3xl font-bold text-white">
                        {index + 1}
                      </span>
                    </motion.div>

                    <div className="space-y-1">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-2xl font-bold text-white"
                      >
                        {step.title}
                      </motion.h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  {/* Features grid */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {step.features.map((feature, i) => (
                      <FeatureItem
                        key={i}
                        feature={feature}
                        color={step.color}
                        index={i}
                      />
                    ))}
                  </div>
                </div>

                {/* Right column: Preview */}
                <div className="relative">
                  <PreviewCard
                    data={step.preview}
                    color={step.color}
                    isActive={index === activeStep}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-4 rounded-xl bg-gradient-to-r 
                     from-blue-500 to-indigo-500 text-white font-semibold text-lg"
          >
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r 
                       from-indigo-500 to-blue-500 opacity-0 group-hover:opacity-100 
                       transition-opacity"
            />
            <span className="relative flex items-center gap-2">
              Start Your Journey
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StepsSection;