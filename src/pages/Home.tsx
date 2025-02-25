import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from 'framer-motion';
import { 
  FaPlay, 
  FaCheck, 
  FaClock, 
  FaStar, 
  FaQuoteLeft, 
  FaArrowRight, 
  FaTimes, 
  FaBars,
  FaLightbulb,
  FaRocket,
  FaVideo,
  FaEdit,
  FaMagic,
  FaInstagram,
  FaYoutube
} from 'react-icons/fa';

// Types
interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface PortfolioItemType {
  id: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl: string;
}

interface TestimonialType {
  id: string;
  name: string;
  company: string;
  quote: string;
  image: string;
  rating: number;
}

interface FaqType {
  id: string;
  question: string;
  answer: string;
}

// Custom Hook for mouse spotlight effect
const useMouseSpotlight = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return { mouseX, mouseY };
};

// Magnetic Button Component
const MagneticButton: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '',
  disabled = false
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 relative overflow-hidden';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-orange-500',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500',
    gradient: 'text-white shadow-lg hover:shadow-xl focus:ring-blue-500 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8'
  };
  
  // Magnetic effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current || disabled) return;
    
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - left - width / 2;
    const y = e.clientY - top - height / 2;
    const magneticPull = 0.4; // Adjust the strength of the magnetic effect
    
    setPosition({ 
      x: x * magneticPull, 
      y: y * magneticPull 
    });
  };
  
  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };
  
  const buttonVariants = {
    rest: { 
      x: 0,
      y: 0,
      scale: 1
    },
    hover: { 
      x: position.x,
      y: position.y,
      scale: 1.05,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 15
      }
    },
    tap: { 
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 15
      }
    }
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className} ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      onClick={disabled ? undefined : onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      {variant === 'gradient' && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
      
      <motion.span className="relative z-10 flex items-center gap-2">
        {children}
      </motion.span>
    </motion.button>
  );
};

// Animated Text Reveal Component
const AnimatedTextReveal: React.FC<{
  text: string;
  className?: string;
  wordClassName?: string;
  charClassName?: string;
  once?: boolean;
}> = ({ text, className = '', wordClassName = '', charClassName = '', once = false }) => {
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once, amount: 0.5 });
  
  // Split text into words and characters
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.03, delayChildren: 0.04 * i },
    }),
  };
  
  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  };
  
  return (
    <motion.div
      ref={textRef}
      className={`${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {words.map((word, wordIndex) => (
        <span key={`word-${wordIndex}`} className={`inline-block ${wordClassName}`}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={`char-${charIndex}`}
              variants={child}
              className={`inline-block ${charClassName}`}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && ' '}
        </span>
      ))}
    </motion.div>
  );
};

// Enhanced 3D Tilt Card Component
const TiltCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  tiltStrength?: number;
  glareEnabled?: boolean;
  glareColor?: string;
  perspective?: number;
}> = ({ 
  children, 
  className = '', 
  tiltStrength = 10, 
  glareEnabled = true,
  glareColor = 'rgba(255, 255, 255, 0.4)',
  perspective = 1000
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    
    // Calculate the mouse position relative to the card center (from -1 to 1)
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;
    
    // Apply tilt values (multiply by tilt strength)
    setPosition({ 
      x: -x * tiltStrength, 
      y: y * tiltStrength 
    });
    
    // Update glare position
    setGlarePosition({ 
      x: e.clientX - left, 
      y: e.clientY - top 
    });
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
  };
  
  return (
    <motion.div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`
      }}
    >
      <motion.div
        style={{
          rotateX: position.y,
          rotateY: position.x,
          transformStyle: 'preserve-3d'
        }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 300,
          mass: 0.8
        }}
        className="w-full h-full"
      >
        {children}
        
        {/* Glare effect */}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}px ${glarePosition.y}px, ${glareColor} 0%, transparent 70%)`,
              opacity: isHovering ? 1 : 0,
              transition: 'opacity 0.3s ease'
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

// Animated Service Card Component with hover effects
const ServiceCard: React.FC<{
  service: ServiceType;
  index: number;
}> = ({ service, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  const iconColors: Record<string, string> = {
    blue: 'text-blue-600 group-hover:text-white',
    orange: 'text-orange-500 group-hover:text-white',
    green: 'text-green-600 group-hover:text-white',
    purple: 'text-purple-600 group-hover:text-white',
    red: 'text-red-500 group-hover:text-white',
  };
  
  const iconBgColors: Record<string, string> = {
    blue: 'bg-blue-100 group-hover:bg-blue-600',
    orange: 'bg-orange-100 group-hover:bg-orange-500',
    green: 'bg-green-100 group-hover:bg-green-600',
    purple: 'bg-purple-100 group-hover:bg-purple-600',
    red: 'bg-red-100 group-hover:bg-red-500',
  };
  
  const borderColors: Record<string, string> = {
    blue: 'border-blue-200 group-hover:border-blue-500',
    orange: 'border-orange-200 group-hover:border-orange-500',
    green: 'border-green-200 group-hover:border-green-500',
    purple: 'border-purple-200 group-hover:border-purple-600',
    red: 'border-red-200 group-hover:border-red-500',
  };
  
  return (
    <TiltCard
      className="rounded-xl h-full"
      tiltStrength={5}
      perspective={2000}
    >
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100 
        }}
        className={`h-full bg-white shadow-lg border-2 ${borderColors[service.color]} text-gray-800 rounded-xl p-6 transition-all duration-300 relative overflow-hidden group hover:shadow-xl`}
      >
        {/* Background decoration */}
        <div className="absolute -bottom-16 -right-16 w-40 h-40 bg-gray-50 rounded-full opacity-30 group-hover:opacity-50 transition-all duration-500 group-hover:scale-150"></div>
        
        <div className="relative z-10 h-full flex flex-col">
          <div className={`flex items-center justify-center w-16 h-16 rounded-full ${iconBgColors[service.color]} mb-6 transition-all duration-300 group-hover:shadow-lg`}>
            <div className={`text-2xl ${iconColors[service.color]} transition-all duration-300`}>{service.icon}</div>
          </div>
          
          <h3 className={`text-xl font-bold mb-3 text-gray-800 group-hover:text-${service.color}-600 transition-colors duration-300`}>{service.title}</h3>
          
          <p className="text-gray-600 mb-4 flex-grow">{service.description}</p>
          
          <div className="mt-auto">
            <motion.a 
              href="#" 
              className={`text-${service.color}-600 inline-flex items-center group-hover:text-${service.color}-800 transition-colors duration-300`}
              whileHover={{ x: 5 }}
            >
              Learn more <FaArrowRight className="ml-2" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
};

// Enhanced VideoPlayer Component with advanced hover effects
const VideoPlayer: React.FC<{
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
  category: string;
}> = ({ thumbnailUrl, videoUrl, title, category }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);
  
  const containerVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.02, transition: { duration: 0.3, ease: 'easeInOut' } }
  };
  
  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.7, ease: 'easeInOut' } }
  };
  
  const overlayVariants = {
    rest: { backgroundColor: 'rgba(0, 0, 0, 0.3)' },
    hover: { backgroundColor: 'rgba(0, 0, 0, 0.5)', transition: { duration: 0.3 } }
  };
  
  const buttonVariants = {
    rest: { scale: 1, opacity: 0.9 },
    hover: { 
      scale: 1.1, 
      opacity: 1,
      boxShadow: '0px 0px 20px rgba(59, 130, 246, 0.5)',
      transition: { 
        duration: 0.3, 
        type: 'spring', 
        stiffness: 300,
        yoyo: Infinity,
        repeatDelay: 0.7
      } 
    }
  };
  
  const titleVariants = {
    rest: { y: 10, opacity: 0 },
    hover: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };
  
  const categoryVariants = {
    rest: { x: -10, opacity: 0 },
    hover: { x: 0, opacity: 1, transition: { duration: 0.3, delay: 0.1 } }
  };
  
  return (
    <TiltCard
      className="h-full"
      tiltStrength={3}
      perspective={1500}
    >
      <motion.div 
        className="relative rounded-xl overflow-hidden group shadow-lg h-full bg-gray-800"
        variants={containerVariants}
        initial="rest"
        whileHover="hover"
        animate={isHovering ? "hover" : "rest"}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        ref={videoRef}
      >
        {!isPlaying ? (
          <>
            <div className="aspect-video w-full overflow-hidden">
              <motion.img 
                src={thumbnailUrl} 
                alt={title}
                className="w-full h-full object-cover"
                variants={imageVariants}
              />
            </div>
            
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              variants={overlayVariants}
            >
              <motion.button
                variants={buttonVariants}
                onClick={() => setIsPlaying(true)}
                className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center z-10 group"
              >
                <FaPlay className="text-xl ml-1 group-hover:text-white" />
              </motion.button>
            </motion.div>
            
            <div className="absolute top-4 left-4">
              <motion.span 
                className="bg-blue-600 text-white text-xs font-semibold py-1 px-2 rounded-md uppercase"
                variants={categoryVariants}
              >
                {category}
              </motion.span>
            </div>
            
            <motion.div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
              variants={titleVariants}
            >
              <h3 className="text-white font-bold text-lg">{title}</h3>
              <p className="text-gray-300 text-sm mt-1">Click to play video</p>
            </motion.div>
          </>
        ) : (
          <div className="aspect-video w-full h-full">
            <iframe
              src={videoUrl}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </motion.div>
    </TiltCard>
  );
};

// Enhanced Testimonial Card Component with animated rating stars
const TestimonialCard: React.FC<{
  testimonial: TestimonialType;
  index: number;
}> = ({ testimonial, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  // Generate star animations for each rating star
  const renderStars = () => {
    return Array.from({ length: 5 }).map((_, i) => {
      const isFilled = i < testimonial.rating;
      
      return (
        <motion.div 
          key={i}
          initial={{ rotate: 0, scale: 0 }}
          animate={isInView ? { 
            rotate: [0, 20, 0], 
            scale: 1,
          } : { scale: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1 + i * 0.1,
            type: "spring",
            stiffness: 200
          }}
          className={`text-lg ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
        >
          <FaStar />
        </motion.div>
      );
    });
  };
  
  return (
    <TiltCard className="h-full" tiltStrength={5}>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        className="bg-white shadow-lg border border-gray-100 text-gray-800 rounded-xl p-6 transition-all duration-300 relative overflow-hidden group h-full hover:shadow-xl"
      >
        {/* Background decoration */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-150 transition-all duration-500"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-30 group-hover:scale-150 transition-all duration-500"></div>
        
        <div className="relative z-10 h-full flex flex-col">
          <FaQuoteLeft className="text-blue-400 text-3xl mb-4" />
          
          <div className="flex mb-3">
            {renderStars()}
          </div>
          
          <p className="text-gray-600 italic mb-6 flex-grow">{testimonial.quote}</p>
          
          <div className="flex items-center mt-auto">
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-blue-200">
              <img 
                src={testimonial.image} 
                alt={testimonial.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
              <p className="text-sm text-blue-600">{testimonial.company}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </TiltCard>
  );
};

// Enhanced FAQ Accordion Component with animated content reveal
const FaqItem: React.FC<{
  faq: FaqType;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}> = ({ faq, isOpen, toggleOpen, index }) => {
  const faqRef = useRef(null);
  const isInView = useInView(faqRef, { once: true, amount: 0.3 });
  
  const questionVariants = {
    closed: { color: '#1F2937' },
    open: { color: '#2563EB' }
  };
  
  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 90 }
  };
  
  const contentVariants = {
    closed: { 
      height: 0, 
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: { 
      height: 'auto', 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        when: 'beforeChildren',
        staggerChildren: 0.05
      }
    }
  };
  
  const contentTextVariants = {
    closed: { 
      opacity: 0, 
      y: 10,
      transition: {
        duration: 0.2
      }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: 0.1
      }
    }
  };
  
  return (
    <motion.div
      ref={faqRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="border-b border-gray-200 last:border-b-0 relative overflow-hidden"
    >
      <motion.button
        onClick={toggleOpen}
        className="w-full py-4 px-2 flex justify-between items-center text-left focus:outline-none group"
        whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
        transition={{ duration: 0.2 }}
      >
        <motion.h3 
          className="text-lg font-medium transition-colors duration-300"
          variants={questionVariants}
          animate={isOpen ? 'open' : 'closed'}
        >
          {faq.question}
        </motion.h3>
        <motion.span 
          className="text-blue-500 ml-4"
          variants={iconVariants}
          animate={isOpen ? 'open' : 'closed'}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes /> : <FaArrowRight />}
        </motion.span>
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={contentVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="overflow-hidden relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-full" />
            <motion.div 
              className="py-3 px-4 text-gray-600"
              variants={contentTextVariants}
            >
              {faq.answer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Creative Section Header with animated underline
const SectionHeader: React.FC<{
  title: string;
  subtitle: string;
  align?: 'left' | 'center' | 'right';
}> = ({ title, subtitle, align = 'center' }) => {
  const headerRef = useRef(null);
  const isInView = useInView(headerRef, { once: false, amount: 0.3 });
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  };
  
  const titleVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring", 
        stiffness: 100
      }
    }
  };
  
  const subtitleVariants = {
    hidden: { 
      opacity: 0, 
      y: 20 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        type: "spring", 
        stiffness: 100
      }
    }
  };
  
  const underlineVariants = {
    hidden: { 
      scaleX: 0,
      originX: 0
    },
    visible: { 
      scaleX: 1,
      transition: {
        duration: 0.6,
        delay: 0.4,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  return (
    <div className={`mb-16 ${alignClasses[align]}`} ref={headerRef}>
      <div className="relative">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-4 relative inline-block"
          variants={titleVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="relative z-10">{title}</span>
          <motion.span 
            className="absolute -bottom-2 left-0 right-0 h-4 bg-blue-100 -z-10 skew-x-3"
            variants={underlineVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          ></motion.span>
        </motion.h2>
      </div>
      <motion.p 
        className="text-xl text-gray-600 max-w-2xl mx-auto"
        variants={subtitleVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {subtitle}
      </motion.p>
    </div>
  );
};


// Animated Blob Background
const BlobBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
      <svg 
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 1000 1000" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M794.7,513.3C794.7,680,680,794.7,513.3,794.7C346.7,794.7,232,680,232,513.3C232,346.7,346.7,232,513.3,232C680,232,794.7,346.7,794.7,513.3Z"
          fill="#3B82F6"
          initial={{ scale: 1, x: -100, y: -100 }}
          animate={{ 
            scale: [1, 1.05, 1],
            x: [-100, -110, -100],
            y: [-100, -90, -100],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M773.3,673.3C773.3,840,658.7,954.7,492,954.7C325.3,954.7,210.7,840,210.7,673.3C210.7,506.7,325.3,392,492,392C658.7,392,773.3,506.7,773.3,673.3Z"
          fill="#F97316"
          initial={{ scale: 1, x: 50, y: 50 }}
          animate={{ 
            scale: [1, 1.1, 1],
            x: [50, 60, 50],
            y: [50, 40, 50],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        <motion.path
          d="M673.3,340C673.3,506.7,558.7,621.3,392,621.3C225.3,621.3,110.7,506.7,110.7,340C110.7,173.3,225.3,58.7,392,58.7C558.7,58.7,673.3,173.3,673.3,340Z"
          fill="#8B5CF6"
          initial={{ scale: 1, x: -50, y: -50 }}
          animate={{ 
            scale: [1, 1.15, 1],
            x: [-50, -60, -50],
            y: [-50, -40, -50],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>
    </div>
  );
};

// Animated Particle Background
const ParticleBackground: React.FC = () => {
  const generateParticles = () => {
    const particles = [];
    const count = 50;
    
    for (let i = 0; i < count; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 5;
      const duration = Math.random() * 10 + 20;
      const color = i % 2 === 0 ? '#3B82F6' : '#F97316';
      
      particles.push(
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            opacity: 0.3
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay
          }}
        />
      );
    }
    
    return particles;
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {generateParticles()}
    </div>
  );
};

// Animated 3D Rotating Cube
const RotatingCube: React.FC<{
  size: number;
  position: { top?: string; bottom?: string; left?: string; right?: string };
  color?: string;
  speed?: number;
}> = ({ 
  size = 100, 
  position, 
  color = '#3B82F6', 
  speed = 10 
}) => {
  // Calculate half size for transforms
  const halfSize = size / 2;
  
  // Position styling
  const positionStyle: React.CSSProperties = {
    ...position,
    width: `${size}px`,
    height: `${size}px`,
    position: 'absolute',
    transformStyle: 'preserve-3d',
    opacity: 0.2
  };
  
  // Face styling
  const faceStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: color,
    opacity: 0.6,
    border: '1px solid rgba(255, 255, 255, 0.3)'
  };
  
  return (
    <motion.div 
      style={positionStyle}
      animate={{ 
        rotateX: [0, 360], 
        rotateY: [0, 360], 
        rotateZ: [0, 360]
      }}
      transition={{ 
        duration: speed, 
        repeat: Infinity, 
        ease: "linear" 
      }}
    >
      {/* Front face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateZ(${halfSize}px)`
        }}
      />
      {/* Back face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateZ(-${halfSize}px) rotateY(180deg)`
        }}
      />
      {/* Left face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateX(-${halfSize}px) rotateY(-90deg)`
        }}
      />
      {/* Right face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateX(${halfSize}px) rotateY(90deg)`
        }}
      />
      {/* Top face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateY(-${halfSize}px) rotateX(90deg)`
        }}
      />
      {/* Bottom face */}
      <div 
        style={{
          ...faceStyle,
          transform: `translateY(${halfSize}px) rotateX(-90deg)`
        }}
      />
    </motion.div>
  );
};

// Animated Numbers Component
const AnimatedCounter: React.FC<{
  value: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}> = ({ 
  value, 
  decimals = 0, 
  duration = 2, 
  prefix = '', 
  suffix = '',
  className = '' 
}) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, amount: 0.5 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        const currentValue = progress * value;
        
        setDisplayValue(currentValue);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [isInView, isAnimating, value, duration]);
  
  return (
    <span ref={nodeRef} className={className}>
      {prefix}{isAnimating ? displayValue.toFixed(decimals) : '0'}{suffix}
    </span>
  );
};



// Advanced Mouse-following Cursor Effect
const MouseCursor: React.FC = () => {
  const { mouseX, mouseY } = useMouseSpotlight();
  
  const cursorX = useTransform(mouseX, (value) => value - 12);
  const cursorY = useTransform(mouseY, (value) => value - 12);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  
  return (
    <motion.div
      className="fixed w-6 h-6 rounded-full pointer-events-none z-50 border-2 border-blue-500 mix-blend-difference"
      style={{
        left: cursorXSpring,
        top: cursorYSpring,
        backgroundColor: 'transparent'
      }}
    >
      <motion.div 
        className="absolute inset-0 bg-white rounded-full"
        initial={{ scale: 0.5, opacity: 0.5 }}
        animate={{ 
          scale: [0.5, 0.8, 0.5],
          opacity: [0.5, 0.2, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Glowing Button with Spotlight Effect
const GlowButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const { left, top} = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    setPosition({ x, y });
  };
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <motion.button
      ref={buttonRef}
      className={`relative overflow-hidden bg-blue-600 text-white font-medium rounded-lg px-6 py-3 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isHovering 
            ? `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.4) 0%, transparent 60%)`
            : 'none',
          opacity: isHovering ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div 
        className="absolute inset-0 opacity-50 pointer-events-none"
        animate={{ 
          boxShadow: isHovering 
            ? '0 0 20px 5px rgba(59, 130, 246, 0.7)' 
            : '0 0 0px 0px rgba(59, 130, 246, 0)'
        }}
        transition={{ duration: 0.3 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Animated Gradient Border
const GradientBorder: React.FC<{
  children: React.ReactNode;
  className?: string;
  borderWidth?: number;
  animate?: boolean;
  colors?: string[];
}> = ({ 
  children, 
  className = '', 
  borderWidth = 3,
  animate = true,
  colors = ['#3B82F6', '#F97316', '#8B5CF6', '#10B981']
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);
  const [gradientAngle, setGradientAngle] = useState(0);
  
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      if (!isHovering.current) {
        setGradientAngle(prev => (prev + 1) % 360);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [animate]);
  
  const handleMouseEnter = () => {
    isHovering.current = true;
  };
  
  const handleMouseLeave = () => {
    isHovering.current = false;
  };
  
  const gradientStyle = {
    background: `linear-gradient(${gradientAngle}deg, ${colors.join(', ')})`,
    padding: borderWidth
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        className="absolute inset-0 rounded-xl"
        style={gradientStyle}
      />
      <div className="relative bg-white dark:bg-gray-900 rounded-xl h-full w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// Home Component
const Home: React.FC = () => {
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for active FAQ
  const [activeFaqId, setActiveFaqId] = useState<string | null>(null);
  
  // Refs for scroll animations
  const heroRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const portfolioRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  
  // Mouse spotlight hook
  const { mouseX, mouseY } = useMouseSpotlight();
  
  // In-view states
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.2 });
  const portfolioInView = useInView(portfolioRef, { once: false, amount: 0.2 });
  const testimonialsInView = useInView(testimonialsRef, { once: false, amount: 0.2 });
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const heroY = useTransform(smoothScrollProgress, [0, 0.3], [0, -100]);
  const heroScale = useTransform(smoothScrollProgress, [0, 0.3], [1, 0.9]);
  const heroOpacity = useTransform(smoothScrollProgress, [0, 0.3], [1, 0.6]);
  
  // Mouse spotlight for hero section
  const spotlightX = useTransform(mouseX, (value) => value);
  const spotlightY = useTransform(mouseY, (value) => value);
  
  // Transform for mouse-following elements
  const mouseXRange = useTransform(mouseX, (value) => (value - window.innerWidth / 2) * 0.05);
  const mouseYRange = useTransform(mouseY, (value) => (value - window.innerHeight / 2) * 0.05);
  
  // Service data with enhanced icons and colors
  const services: ServiceType[] = [
    {
      id: 'reels',
      title: 'Reels & Short-form',
      description: 'Engaging, scroll-stopping content optimized for Instagram, TikTok, and YouTube Shorts.',
      icon: <FaInstagram />,
      color: 'blue'
    },
    {
      id: 'youtube',
      title: 'YouTube Videos',
      description: 'Professional long-form content that keeps viewers engaged through storytelling and pacing.',
      icon: <FaYoutube />,
      color: 'red'
    },
    {
      id: 'corporate',
      title: 'Corporate Videos',
      description: 'Polished, professional videos that elevate your brand image and communicate your message.',
      icon: <FaVideo />,
      color: 'blue'
    },
    {
      id: 'podcast',
      title: 'Podcast Editing',
      description: 'Crisp audio and engaging video elements for your podcast content across platforms.',
      icon: <FaEdit />,
      color: 'purple'
    },
    {
      id: 'animations',
      title: 'Motion Graphics',
      description: 'Eye-catching animations and graphics that bring your ideas and brand to life visually.',
      icon: <FaMagic />,
      color: 'orange'
    }
  ];
  
  // Enhanced portfolio data
  const portfolioItems: PortfolioItemType[] = [
    {
      id: 'portfolio1',
      title: 'Brand Campaign for XYZ Company',
      category: 'Corporate',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: '/api/placeholder/600/340'
    },
    {
      id: 'portfolio2',
      title: 'Lifestyle Content for Fitness Brand',
      category: 'Social Media',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: '/api/placeholder/600/340'
    },
    {
      id: 'portfolio3',
      title: 'Product Launch Video',
      category: 'Marketing',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: '/api/placeholder/600/340'
    }
  ];
  
  // Enhanced testimonial data with ratings
  const testimonials: TestimonialType[] = [
    {
      id: 'testimonial1',
      name: 'Sarah Johnson',
      company: 'Tech Innovations Inc.',
      quote: 'The team delivered our videos ahead of schedule and the quality exceeded our expectations. Our engagement has increased by 200% since implementing their edited content.',
      image: '/api/placeholder/100/100',
      rating: 5
    },
    {
      id: 'testimonial2',
      name: 'Michael Chen',
      company: 'Growth Marketing Agency',
      quote: 'Weve worked with many video editors, but this team stands out. They understand marketing psychology and create videos that actually convert.',
      image: '/api/placeholder/100/100',
      rating: 5
    },
    {
      id: 'testimonial3',
      name: 'Elena Rodriguez',
      company: 'Content Creator',
      quote: 'Since hiring this agency, my channel has grown from 10K to 500K subscribers in just 8 months. Their editing style is exactly what my audience loves.',
      image: '/api/placeholder/100/100',
      rating: 4
    }
  ];
  
  // FAQ data
  const faqs: FaqType[] = [
    {
      id: 'faq1',
      question: 'What is your typical turnaround time?',
      answer: 'Our standard turnaround time is 48-72 hours for most projects. For complex edits or rush delivery, we offer premium options with 24-hour turnaround.'
    },
    {
      id: 'faq2',
      question: 'How does the revision process work?',
      answer: 'All packages include 2-3 rounds of revisions. We have a simple feedback system where you can add timestamped comments directly on your video draft.'
    },
    {
      id: 'faq3',
      question: 'Do you provide raw footage organization?',
      answer: 'Yes! We offer raw footage organization as an add-on service. Well sort, label, and organize all your clips to make the editing process smoother.'
    },
    {
      id: 'faq4',
      question: 'What video formats do you deliver in?',
      answer: 'We deliver in all major formats including MP4, MOV, and custom formats for specific platforms. We also optimize aspect ratios for different social media platforms.'
    },
    {
      id: 'faq5',
      question: 'Do you offer subscription packages?',
      answer: 'Yes, we have monthly subscription packages that include a set number of videos per month at a discounted rate. Perfect for creators and businesses with regular content needs.'
    }
  ];
  
  // Toggle FAQ open/closed
  const toggleFaq = (id: string) => {
    setActiveFaqId(activeFaqId === id ? null : id);
  };
  
  return (
    <div className="relative bg-white text-gray-800 min-h-screen">
      {/* Interactive cursor effect */}
      <MouseCursor />
      
      {/* Background elements */}
      <BlobBackground />
      <ParticleBackground />
      
      {/* 3D rotating elements */}
      <RotatingCube size={150} position={{ top: '15%', left: '10%' }} color="#3B82F6" speed={20} />
      <RotatingCube size={100} position={{ bottom: '20%', right: '15%' }} color="#F97316" speed={15} />
      
     {/* Enhanced Navigation with animation and effects */}
<header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-md">
  <div className="container mx-auto px-4 py-4">
    <div className="flex justify-between items-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <a href="#" className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="relative">
            <span className="text-blue-600 mr-1 relative z-10">Video</span>
            <motion.span 
              className="absolute -bottom-1 left-0 right-0 h-2 bg-blue-100"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            />
          </span>
          <span>Editors</span>
        </a>
      </motion.div>
      
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden md:flex items-center space-x-8"
      >
        {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item, index) => (
          <motion.a 
            key={item}
            href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
            className="text-gray-800 hover:text-blue-600 transition-colors relative group"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index + 0.3 }}
            whileHover={{ scale: 1.05 }}
          >
            {item}
            <motion.span 
              className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.a>
        ))}
        
        <MagneticButton 
          variant="gradient" 
          size="sm" 
          className="ml-4"
          onClick={() => window.location.href = '/newhome'}
        >
          Get a Free Consultation
        </MagneticButton>
      </motion.nav>
      
      {/* Mobile menu button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="md:hidden text-gray-800 p-2"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaBars className="text-2xl" />
      </motion.button>
    </div>
  </div>
  
  {/* Enhanced Mobile Navigation */}
  <AnimatePresence>
    {mobileMenuOpen && (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white/95 backdrop-blur-sm shadow-lg"
      >
        <div className="container mx-auto px-4 py-4">
          <motion.nav 
            className="flex flex-col space-y-4"
            variants={{
              open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
              closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
            }}
            initial="closed"
            animate="open"
          >
            {['Home', 'Services', 'Portfolio', 'About', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={item === 'Home' ? '#' : `#${item.toLowerCase()}`}
                className="text-gray-800 hover:text-blue-600 transition-colors py-2 pl-4 border-l-2 border-transparent hover:border-blue-500"
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: -20 }
                }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {item}
              </motion.a>
            ))}
            
            <motion.div
              variants={{
                open: { opacity: 1, y: 0 },
                closed: { opacity: 0, y: 20 }
              }}
              className="pt-2"
            >
              <MagneticButton 
                variant="gradient" 
                size="sm" 
                className="w-full"
                onClick={() => window.location.href = '/newhome'}
              >
                Get a Free Consultation
              </MagneticButton>
            </motion.div>
          </motion.nav>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</header>
      
      {/* Enhanced Hero Section with parallax and spotlight effects */}
      <motion.section
        ref={heroRef}
        style={{ 
          y: heroY,
          scale: heroScale,
          opacity: heroOpacity
        }}
        className="relative min-h-screen flex items-center justify-center z-10 pt-24 overflow-hidden"
      >
        {/* Creative background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50 z-0">
          {/* Mouse spotlight effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-100/30 to-purple-100/30 mix-blend-overlay"
            style={{
              background: useMotionTemplate`radial-gradient(circle at ${spotlightX}px ${spotlightY}px, rgba(59, 130, 246, 0.15) 0%, transparent 50%)`
            }}
          />
          
          <motion.div 
            className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-200 to-blue-100 opacity-60"
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0],
              y: [0, -15, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-orange-200 to-yellow-100 opacity-50"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -10, 0],
              x: [0, 15, 0]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <motion.div 
            className="absolute top-1/3 left-1/4 w-32 h-32 rounded-full bg-gradient-to-r from-purple-200 to-purple-100 opacity-40 blur-xl"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        </div>
        
        {/* Floating 3D elements that react to mouse movement */}
        <motion.div 
          className="absolute top-1/4 left-1/6 w-20 h-20 bg-blue-100 rounded-xl opacity-70 backdrop-blur-sm"
          style={{ rotateX: mouseYRange, rotateY: mouseXRange }}
          animate={{ rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute bottom-1/4 right-1/6 w-16 h-16 bg-orange-100 rounded-full opacity-70 backdrop-blur-sm"
          style={{ rotateX: mouseYRange, rotateY: mouseXRange }}
          animate={{ rotate: [0, -10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
          <motion.div
            className="max-w-5xl text-center"
            style={{ rotateX: mouseYRange, rotateY: mouseXRange }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mb-8 relative"
            >
              {/* Animated accent lines */}
              <motion.div 
                className="absolute -left-5 top-1/2 w-5 h-32 bg-blue-200 rounded-r-lg hidden md:block"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              
              <motion.div 
                className="absolute -right-5 top-1/2 w-5 h-32 bg-orange-200 rounded-l-lg hidden md:block"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
              
              <motion.h1 
                className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
              >
                <AnimatedTextReveal
                  text="The Last"
                  className="block text-gray-800"
                  once={true}
                />
                
                <motion.span 
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 relative inline-block"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <AnimatedTextReveal
                    text="Video Editing Agency"
                    once={true}
                  />
                  
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full" 
                    height="12" 
                    viewBox="0 0 600 12" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <motion.path 
                      d="M0 5C100 2 200 8 300 5C400 2 500 8 600 5" 
                      stroke="url(#gradient)" 
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1 }}
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0" y1="0" x2="600" y2="0" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#3B82F6" />
                        <stop offset="0.5" stopColor="#8B5CF6" />
                        <stop offset="1" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                  </motion.svg>
                </motion.span>
                
                <AnimatedTextReveal
                  text="You'll Ever Hire."
                  className="block text-gray-800"
                  once={true}
                />
              </motion.h1>
            </motion.div>
            
            <motion.div 
              className="relative z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto relative">
                <span className="relative">
                  High-quality, fast-turnaround video editing for brands, creators, and businesses.
                  <motion.span 
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                </span>
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.1 }}
              className="flex flex-wrap gap-6 justify-center"
            >
              <GlowButton className="group">
                <span className="flex items-center">
                  Get a Free Consultation
                  <motion.span
                    className="ml-2 inline-flex"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <FaArrowRight />
                  </motion.span>
                </span>
              </GlowButton>
              
              <MagneticButton variant="outline" size="lg">
                View Our Work
              </MagneticButton>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.4 }}
              className="mt-20 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16"
            >
              <motion.div 
                className="flex items-center bg-white/80 backdrop-blur-sm p-4 pr-6 rounded-full shadow-md"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((_, idx) => (
                    <motion.div 
                      key={idx}
                      className="w-12 h-12 rounded-full border-2 border-blue-200 overflow-hidden bg-white z-30"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 + idx * 0.1 }}
                      whileHover={{ scale: 1.1, zIndex: 40 }}
                    >
                      <img src="/api/placeholder/100/100" alt="Client" className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                </div>
                <span className="ml-4 text-gray-600">
                  <span className="font-bold text-gray-800">
                    <AnimatedCounter value={100} suffix="+" className="font-bold" duration={1.5} />
                  </span> happy clients
                </span>
              </motion.div>
              
              <motion.div 
                className="flex items-center bg-white/80 backdrop-blur-sm p-4 pr-6 rounded-full shadow-md"
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.2), 0 8px 10px -6px rgba(59, 130, 246, 0.2)" }}
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((_, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, rotate: -30, scale: 0 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      transition={{ delay: 1.8 + index * 0.1, type: "spring" }}
                    >
                      <FaStar className="text-xl text-yellow-400" />
                    </motion.div>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  <span className="font-bold text-gray-800">
                    <AnimatedCounter value={4.9} decimals={1} suffix="/5" className="font-bold" duration={1.5} />
                  </span> rating
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Enhanced scroll indicator with animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex flex-col items-center"
          >
            <span className="text-gray-500 mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center pt-2 relative overflow-hidden">
              <motion.div 
                animate={{ 
                  y: [0, 16, 0],
                  opacity: [1, 0.2, 1]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1.5 h-1.5 bg-blue-500 rounded-full"
              />
              
              <motion.div 
                className="absolute top-0 left-0 right-0 h-full"
                animate={{
                  boxShadow: ["0 0 5px rgba(59, 130, 246, 0)", "0 0 10px rgba(59, 130, 246, 0.5)", "0 0 5px rgba(59, 130, 246, 0)"]
                }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Why Choose Us Section with enhanced hover effects */}
      <section className="relative z-10 py-20 bg-white overflow-hidden">
        {/* Enhanced diagonal elements with animations */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-blue-50 transform -skew-y-2">
          <motion.div 
            className="absolute inset-0 bg-blue-100 opacity-30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundSize: "10px 10px",
              backgroundImage: "linear-gradient(45deg, rgba(59, 130, 246, 0.2) 25%, transparent 25%, transparent 50%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.2) 75%, transparent 75%, transparent)"
            }}
          />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-50 transform skew-y-2">
          <motion.div 
            className="absolute inset-0 bg-blue-100 opacity-30"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{
              backgroundSize: "10px 10px",
              backgroundImage: "linear-gradient(45deg, rgba(59, 130, 246, 0.2) 25%, transparent 25%, transparent 50%, rgba(59, 130, 246, 0.2) 50%, rgba(59, 130, 246, 0.2) 75%, transparent 75%, transparent)"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="Why Choose Us?" 
            subtitle="We combine technical expertise with creative vision to deliver videos that exceed expectations."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <TiltCard className="group" tiltStrength={5} perspective={1000}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-full bg-white shadow-lg rounded-xl p-8 border-t-4 border-blue-500 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 bg-blue-100 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-all duration-500"
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 w-40 h-40 bg-blue-50 rounded-full -ml-20 -mb-20 opacity-30 group-hover:scale-150 transition-all duration-500"
                />
                
                <div className="relative z-10 h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300 rounded-full flex items-center justify-center mb-6 group-hover:shadow-lg shadow-blue-300/50"
                    whileHover={{ rotate: 5 }}
                  >
                    <FaClock className="text-blue-600 group-hover:text-white text-2xl transition-colors duration-300" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Fast Turnaround</h3>
                  
                  <p className="text-gray-600 mb-4">
                    Most projects delivered within 48-72 hours. Need it faster? Ask about our rush delivery options.
                  </p>
                  
                  <ul className="mt-4 space-y-3 flex-grow">
                    {['24-hour rush delivery', 'Weekend availability', 'Real-time progress updates'].map((item, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <motion.span 
                          className="text-blue-500 mr-2 flex-shrink-0"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaCheck />
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </TiltCard>
            
            {/* Feature 2 */}
            <TiltCard className="group" tiltStrength={5} perspective={1000}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-white shadow-lg rounded-xl p-8 border-t-4 border-orange-500 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 bg-orange-100 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-all duration-500"
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 w-40 h-40 bg-orange-50 rounded-full -ml-20 -mb-20 opacity-30 group-hover:scale-150 transition-all duration-500"
                />
                
                <div className="relative z-10 h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-orange-100 group-hover:bg-orange-500 transition-colors duration-300 rounded-full flex items-center justify-center mb-6 group-hover:shadow-lg shadow-orange-300/50"
                    whileHover={{ rotate: 5 }}
                  >
                    <FaStar className="text-orange-500 group-hover:text-white text-2xl transition-colors duration-300" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-orange-500 transition-colors duration-300">Premium Quality</h3>
                  
                  <p className="text-gray-600 mb-4">
                    Professional color grading, sound design, and motion graphics that elevate your content.
                  </p>
                  
                  <ul className="mt-4 space-y-3 flex-grow">
                    {['Cinema-grade color correction', 'Professional sound mixing', 'Custom motion graphics'].map((item, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <motion.span 
                          className="text-orange-500 mr-2 flex-shrink-0"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaCheck />
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </TiltCard>
            
            {/* Feature 3 */}
            <TiltCard className="group" tiltStrength={5} perspective={1000}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full bg-white shadow-lg rounded-xl p-8 border-t-4 border-green-500 relative overflow-hidden group"
              >
                <motion.div 
                  className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -mr-20 -mt-20 opacity-50 group-hover:scale-150 transition-all duration-500"
                />
                
                <motion.div 
                  className="absolute bottom-0 left-0 w-40 h-40 bg-green-50 rounded-full -ml-20 -mb-20 opacity-30 group-hover:scale-150 transition-all duration-500"
                />
                
                <div className="relative z-10 h-full flex flex-col">
                  <motion.div 
                    className="w-16 h-16 bg-green-100 group-hover:bg-green-600 transition-colors duration-300 rounded-full flex items-center justify-center mb-6 group-hover:shadow-lg shadow-green-300/50"
                    whileHover={{ rotate: 5 }}
                  >
                    <FaRocket className="text-green-600 group-hover:text-white text-2xl transition-colors duration-300" />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">Engagement Focused</h3>
                  
                  <p className="text-gray-600 mb-4">
                    Editing techniques proven to increase watch time, shares, and conversion rates.
                  </p>
                  
                  <ul className="mt-4 space-y-3 flex-grow">
                    {['Data-driven editing approaches', 'Audience retention optimization', 'Platform-specific strategies'].map((item, idx) => (
                      <motion.li 
                        key={idx}
                        className="flex items-center"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                      >
                        <motion.span 
                          className="text-green-600 mr-2 flex-shrink-0"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                        >
                          <FaCheck />
                        </motion.span>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </div>
      </section>
      
      {/* Services Section with enhanced animations and effects */}
      <section 
        id="services"
        ref={servicesRef}
        className="relative z-10 py-20 bg-gradient-to-r from-white to-blue-50"
      >
        {/* Background pattern animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute top-0 right-0 text-blue-100" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="dots-1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <motion.rect 
                  x="0" 
                  y="0" 
                  width="4" 
                  height="4" 
                  className="text-blue-200" 
                  fill="currentColor"
                  animate={{ opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#dots-1)" />
          </svg>
          
          <svg className="absolute bottom-0 left-0 text-blue-100" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="dots-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <motion.rect 
                  x="0" 
                  y="0" 
                  width="4" 
                  height="4" 
                  className="text-blue-200" 
                  fill="currentColor"
                  animate={{ opacity: [0.3, 0.6, 0.3] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#dots-2)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="Professional Video Editing" 
            subtitle="From short-form social media content to long-form YouTube videos and corporate presentations."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <GlowButton>
              <span className="flex items-center">
                View All Services <FaArrowRight className="ml-2" />
              </span>
            </GlowButton>
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Section with enhanced video players and 3D card effects */}
      <section 
        id="portfolio"
        ref={portfolioRef}
        className="relative z-10 py-20 bg-white"
      >
       {/* Enhanced background decoration */}
       <motion.div 
          className="absolute top-0 right-0 w-1/3 h-32 bg-orange-50 rounded-bl-full"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        />
        
        <motion.div 
          className="absolute bottom-0 left-0 w-1/3 h-32 bg-blue-50 rounded-tr-full"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false }}
        />
        
        
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="Our Latest Work" 
            subtitle="Browse through our recent projects and see the quality we deliver to our clients."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                animate={portfolioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                className="h-full"
              >
                <VideoPlayer 
                  thumbnailUrl={item.thumbnailUrl}
                  videoUrl={item.videoUrl}
                  title={item.title}
                  category={item.category}
                />
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={portfolioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <MagneticButton variant="secondary" size="lg">
              View Full Portfolio <FaArrowRight className="ml-2" />
            </MagneticButton>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced Stats Section with animated counters */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="absolute inset-0 bg-grid-blue-pattern opacity-10"></div>
        
        {/* Animated particles in background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, index) => (
            <motion.div
              key={index}
              className="absolute bg-blue-300 rounded-full opacity-30"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, label: 'Projects Completed', color: 'blue', icon: <FaVideo /> },
              { value: 98, label: 'Client Satisfaction', suffix: '%', color: 'orange', icon: <FaStar /> },
              { value: 24, label: 'Fastest Turnaround', suffix: 'h', color: 'blue', icon: <FaClock /> },
              { value: 20, label: 'Industries Served', suffix: '+', color: 'orange', icon: <FaLightbulb /> }
            ].map((stat, index) => (
              <TiltCard key={index} className="h-full" tiltStrength={5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: false, amount: 0.3 }}
                  className="text-center bg-white p-8 rounded-xl shadow-md h-full flex flex-col items-center justify-center hover:shadow-xl transition-shadow duration-300"
                >
                  <motion.div
                    className={`text-${stat.color}-500 mb-4 text-3xl`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      delay: 0.2 * index
                    }}
                  >
                    {stat.icon}
                  </motion.div>
                  
                  <motion.div
                    className={`text-5xl font-bold text-${stat.color}-600 mb-2 flex items-center justify-center`}
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{ delay: 0.3 * index }}
                  >
                    <AnimatedCounter 
                      value={stat.value} 
                      suffix={stat.suffix || ''} 
                      className="font-bold" 
                      duration={1.5}
                    />
                  </motion.div>
                  
                  <p className="text-gray-600">{stat.label}</p>
                </motion.div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with enhanced cards and animations */}
      <section 
        ref={testimonialsRef}
        className="relative z-10 py-20 bg-white"
      >
        <motion.div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-blue-50 rounded-r-full"
          animate={{ x: [-10, 0, -10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div 
          className="absolute right-0 top-1/4 w-32 h-32 bg-orange-50 rounded-l-full"
          animate={{ x: [10, 0, 10] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="What Our Clients Say" 
            subtitle="Don't just take our word for it. Hear from the brands and creators we've helped."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
          
          {/* Testimonial call-to-action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 text-center"
          >
            <GradientBorder borderWidth={2} className="inline-block rounded-full p-0.5">
              <motion.a 
                href="#"
                className="text-gray-700 hover:text-blue-700 transition-colors duration-300 py-2 px-5 rounded-full block"
                whileHover={{ scale: 1.05 }}
              >
                View All Testimonials <FaArrowRight className="inline-block ml-2" />
              </motion.a>
            </GradientBorder>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced FAQ Section with animated accordions */}
      <section 
        ref={faqRef}
        className="relative z-10 py-20 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Frequently Asked Questions" 
            subtitle="Everything you need to know about our video editing services."
          />
          
          <motion.div 
            className="max-w-3xl mx-auto bg-white shadow-xl rounded-xl p-6 md:p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
            
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-10 -mt-10 opacity-50"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              
              <motion.div 
                className="absolute bottom-0 left-0 w-32 h-32 bg-orange-50 rounded-full -ml-10 -mb-10 opacity-50"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.3, 0.5] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
            
            <div className="relative z-10">
              {faqs.map((faq, index) => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  isOpen={activeFaqId === faq.id}
                  toggleOpen={() => toggleFaq(faq.id)}
                  index={index}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Enhanced CTA Section with advanced effects */}
      <section className="relative z-10 py-20 bg-blue-600 text-white overflow-hidden">
        {/* Enhanced wave patterns */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
          <svg className="relative block w-full h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
        
        {/* Background effects */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 opacity-50"
            animate={{ 
              background: [
                'linear-gradient(to bottom right, #2563eb, #7c3aed)',
                'linear-gradient(to bottom right, #1d4ed8, #6d28d9)',
                'linear-gradient(to bottom right, #2563eb, #7c3aed)'
              ] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="absolute inset-0 backdrop-blur-[2px]">
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 6 + 2,
                  height: Math.random() * 6 + 2,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.3,
                }}
                animate={{
                  y: [0, -50],
                  opacity: [0, 0.3, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="absolute -top-10 right-10 w-32 h-32 bg-orange-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-10 left-10 w-32 h-32 bg-blue-800 rounded-full opacity-20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false, amount: 0.3 }}
            className="max-w-4xl mx-auto text-center relative"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your{' '}
                <span className="relative">
                  Video Content
                  <motion.svg 
                    className="absolute -bottom-2 left-0 w-full" 
                    height="6" 
                    viewBox="0 0 600 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 1 }}
                  >
                    <path d="M0 3C100 1 200 5 300 3C400 1 500 5 600 3" stroke="#FFF" strokeWidth="2"/>
                  </motion.svg>
                </span>?
              </h2>
              
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Book a free consultation call with our team to discuss your project needs and goals.
              </p>
              
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <GlowButton className="bg-orange-500 hover:bg-orange-600">
                  <span className="flex items-center">
                    Get a Free Consultation <FaArrowRight className="ml-2" />
                  </span>
                </GlowButton>
                
                <MagneticButton variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-blue-700/30">
                  View Pricing
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
          <svg className="relative block w-full h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <motion.path 
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
              fill="currentColor"
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>
        </div>
      </section>
      
      {/* Enhanced Footer with animations and hover effects */}
      <footer className="relative z-10 bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-blue-600 mr-1">Video</span>
                <span className="text-gray-800">Editors</span>
              </h3>
              
              <p className="text-gray-600 mb-4">
                The last video editing agency you'll ever hire. Professional editing services for creators, brands, and businesses.
              </p>
              
              <div className="flex space-x-4">
                {/* Social Media Icons with Enhanced Hover Effects */}
                {['facebook', 'twitter', 'instagram', 'youtube', 'tiktok'].map((social, index) => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                      {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                      {social === 'youtube' && <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />}
                      {social === 'tiktok' && <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z" />}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-gray-800 font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Reels & Short-form', 'YouTube Videos', 'Corporate Videos', 'Podcast Editing', 'Motion Graphics'].map((item, idx) => (
                  <motion.li 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + idx * 0.05 }}
                  >
                    <motion.a 
                      href="#" 
                      className="text-gray-600 hover:text-blue-600 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-gray-800 font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About Us', 'Portfolio', 'Pricing', 'Careers', 'Contact'].map((item, idx) => (
                  <motion.li 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <motion.a 
                      href="#" 
                      className="text-gray-600 hover:text-blue-600 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-gray-800 font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <motion.li 
                  className="text-gray-600"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  hello@videoeditors.com
                </motion.li>
                <motion.li 
                 className="text-gray-600"
                 initial={{ opacity: 0, x: -10 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.35 }}
               >
                 +1 (555) 123-4567
               </motion.li>
               <motion.li 
                 className="text-gray-600"
                 initial={{ opacity: 0, x: -10 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.4 }}
               >
                 123 Creative St, Suite 101<br />Los Angeles, CA 90021
               </motion.li>
             </ul>
             <motion.div 
               className="mt-6"
               initial={{ opacity: 0, y: 10 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.45 }}
             >
               <MagneticButton variant="outline" size="sm">
                 Contact Us
               </MagneticButton>
             </motion.div>
           </motion.div>
         </div>
         
         <motion.div 
           className="border-t border-gray-200 pt-8"
           initial={{ opacity: 0 }}
           whileInView={{ opacity: 1 }}
           viewport={{ once: true }}
           transition={{ delay: 0.5 }}
         >
           <div className="flex flex-col md:flex-row justify-between items-center">
             <motion.p 
               className="text-gray-500 text-sm mb-4 md:mb-0"
               initial={{ opacity: 0, y: 5 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.55 }}
             >
               © {new Date().getFullYear()} VideoEditors. All rights reserved.
             </motion.p>
             
             <div className="flex space-x-6">
               {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, idx) => (
                 <motion.a 
                   key={item}
                   href="#" 
                   className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                   initial={{ opacity: 0, y: 5 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.6 + idx * 0.05 }}
                   whileHover={{ scale: 1.05 }}
                 >
                   {item}
                 </motion.a>
               ))}
             </div>
           </div>
         </motion.div>
       </div>
       
       {/* Scroll to top button */}
       <motion.button
         className="fixed bottom-8 right-8 bg-blue-600 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-blue-700 transition-colors"
         onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{ delay: 1 }}
         whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
       >
         <svg 
           xmlns="http://www.w3.org/2000/svg" 
           className="h-6 w-6" 
           fill="none" 
           viewBox="0 0 24 24" 
           stroke="currentColor"
         >
           <path 
             strokeLinecap="round" 
             strokeLinejoin="round" 
             strokeWidth={2} 
             d="M5 15l7-7 7 7" 
           />
         </svg>
       </motion.button>
     </footer>
   </div>
 );
};

export default Home;