// src/components/HeroSection.tsx
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const HeroSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonHovered, setButtonHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <motion.div 
        className="absolute inset-0 bg-[#FCFCFC]"
        style={{ y: backgroundY }}
      >
        {/* Grid Pattern */}
        <motion.div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(124, 58, 237, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(124, 58, 237, 0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Gradient Blobs */}
        <motion.div 
          className="absolute top-1/4 -left-64 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 -right-64 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center">
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-12 sm:mb-16"
          >
            <motion.div 
              className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-gray-50 border border-gray-100"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles className="w-5 h-5 text-purple-600" />
              </motion.div>
              <span className="text-gray-600 font-medium">
                Your vision, our expertise
              </span>
            </motion.div>
          </motion.div>

          {/* Main Title */}
          <motion.div
            className="max-w-5xl mx-auto mb-12 sm:mb-16"
            style={{ y }}
          >
            <motion.h1 
              className="text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.1] tracking-tight mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.span 
                className="block text-gray-900 mb-4"
                whileInView={{
                  opacity: [0.5, 1],
                  x: [-20, 0],
                }}
                transition={{ duration: 1 }}
              >
                Transform your content
              </motion.span>
              <motion.span 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-yellow-500 to-purple-600 bg-[length:200%_auto]"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                into video magic
              </motion.span>
            </motion.h1>

            <motion.p 
              className="text-[clamp(1.1rem,2.5vw,1.3rem)] text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Professional editing that makes your content stand out. 
              Fast turnaround times with unlimited revisions.
            </motion.p>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Primary CTA */}
            <motion.button
              className="group relative overflow-hidden inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setButtonHovered(true)}
              onHoverEnd={() => setButtonHovered(false)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-yellow-500"
                initial={{ x: "100%" }}
                animate={{ x: buttonHovered ? "0%" : "100%" }}
                transition={{ duration: 0.3 }}
              />
              <motion.span className="relative z-10 flex items-center gap-2">
                Get Started
                <motion.div
                  animate={buttonHovered ? { x: 5 } : { x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.span>
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              className="group inline-flex items-center gap-3 px-8 py-4 text-gray-600 hover:text-gray-900 rounded-2xl text-lg font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="w-10 h-10 rounded-full bg-gray-100 grid place-items-center"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Play className="w-4 h-4" />
              </motion.div>
              Watch Reel
            </motion.button>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            className="inline-flex flex-wrap justify-center gap-x-12 gap-y-4 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-100 px-8 py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            transition={{ delay: 0.5 }}
          >
            {[
              { value: "24h", label: "Delivery" },
              { value: "100%", label: "Satisfaction" },
              { value: "∞", label: "Revisions" }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className="text-center px-4"
                whileHover={{ y: -2 }}
              >
                <motion.div 
                  className="text-2xl font-bold text-gray-900 mb-1"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
                >
                  {stat.value}
                </motion.div>
                <div className="text-sm text-gray-500">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;