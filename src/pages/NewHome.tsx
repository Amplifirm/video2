import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';

// ==================
// Custom Hooks
// ==================

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);
  
  return position;
};

// ==================
// Utility Components
// ==================

// Magnetic element component
const MagneticElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  strength?: number;
}> = ({ 
  children, 
  className = "", 
  strength = 25 
}) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [elementPosition, setElementPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return;
      
      const { left, top, width, height } = elementRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
      const radius = Math.max(width, height) / 2;
      
      if (distance < radius * 2) {
        const pull = 1 - Math.min(distance / (radius * 2), 1);
        const moveX = distanceX * pull * strength / 20;
        const moveY = distanceY * pull * strength / 20;
        
        setElementPosition({ x: moveX, y: moveY });
      } else {
        setElementPosition({ x: 0, y: 0 });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [strength]);
  
  return (
    <motion.div 
      ref={elementRef}
      animate={{ x: elementPosition.x, y: elementPosition.y }}
      transition={{ type: "spring", stiffness: 350, damping: 15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Button component
const Button: React.FC<{
  children: React.ReactNode;
  primary?: boolean;
  onClick?: () => void;
  className?: string;
  outlined?: boolean;
}> = ({ 
  children, 
  primary = true, 
  onClick, 
  className = "", 
  outlined = false 
}) => {
  return (
    <MagneticElement strength={40} className={`inline-block ${className}`}>
      <motion.button
        onClick={onClick}
        className={`relative px-7 py-3.5 rounded-lg font-medium text-sm z-10 overflow-hidden
                  ${outlined 
                    ? 'border border-white/20 hover:border-white/40 text-white' 
                    : primary 
                      ? 'bg-black text-white border border-zinc-800'
                      : 'bg-white text-black'
                  }`}
        whileHover={{ y: -4 }}
        whileTap={{ y: -2 }}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        <motion.div 
          className={`absolute inset-0 ${outlined ? 'bg-white/5' : primary ? 'bg-zinc-800' : 'bg-white/90'}`}
          initial={{ x: "100%" }}
          whileHover={{ x: "0%" }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </motion.button>
    </MagneticElement>
  );
};

// Reveal text animation component
const RevealText: React.FC<{ 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  threshold?: number;
  once?: boolean;
}> = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up",
  threshold = 0.5,
  once = true
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [once, threshold]);
  
  // Direction based animations
  const animations = {
    up: { y: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 },
    down: { y: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 },
    left: { x: isVisible ? 0 : 20, opacity: isVisible ? 1 : 0 },
    right: { x: isVisible ? 0 : -20, opacity: isVisible ? 1 : 0 },
    none: { opacity: isVisible ? 1 : 0 }
  };
  
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: direction === "up" ? 20 : direction === "down" ? -20 : 0, x: direction === "left" ? 20 : direction === "right" ? -20 : 0 }}
      animate={animations[direction]}
      transition={{ 
        duration: 0.8, 
        delay: delay,
        ease: [0.25, 0.1, 0.25, 1] // Custom easing
      }}
    >
      {children}
    </motion.div>
  );
};

// Split text animation component


// Section title component
const SectionTitle: React.FC<{
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}> = ({ 
  title, 
  subtitle, 
  centered = true, 
  className = "" 
}) => {
  return (
    <div className={`mb-16 ${centered ? 'text-center' : 'text-left'} ${className}`}>
      <RevealText>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-white mb-4">
          {title}
        </h2>
      </RevealText>
      
      {subtitle && (
        <RevealText delay={0.15} className="max-w-2xl mx-auto">
          <p className="text-lg text-white/60">
            {subtitle}
          </p>
        </RevealText>
      )}
    </div>
  );
};

// ==================
// Main Components
// ==================

// Navbar Component
const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation items
  const navItems = ['Work', 'Services', 'Process', 'Pricing', 'Blog'];
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 bg-black/80 backdrop-blur-xl' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <motion.a 
          href="#"
          className="text-white flex items-center gap-2 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 bg-black rounded-full"></div>
            <div className="absolute inset-0 w-6 h-6 m-1">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <path d="M4 8V4m0 4h4m-4 0L7 5M4 16v4m0-4h4m-4 0l3 3m8-11V4m0 4h4m-4 0l3-3m-3 11v4m0-4h4m-4 0l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <span className="text-xl tracking-tight">FRAME<span className="font-bold">CUT</span></span>
        </motion.a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-x-8">
          {navItems.map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white/70 hover:text-white text-sm transition-colors relative"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              whileHover={{ y: -2 }}
            >
              {item}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          ))}
          
          <Button>
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Button>
        </nav>
        
        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
          onClick={() => setMenuOpen(!menuOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          aria-label="Menu"
        >
          <motion.span 
            className="w-5 h-0.5 bg-white block"
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 3 : 0 }}
          />
          <motion.span 
            className="w-5 h-0.5 bg-white block"
            animate={{ opacity: menuOpen ? 0 : 1 }}
          />
          <motion.span 
            className="w-5 h-0.5 bg-white block"
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -3 : 0 }}
          />
        </motion.button>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-5">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item, index) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-white/70 hover:text-white py-2 text-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item}
                  </motion.a>
                ))}
                <Button className="mt-2" onClick={() => setMenuOpen(false)}>
                  Get Started
                </Button>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// Hero Section Component
const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const mousePosition = useMousePosition();
  
  // References for parallax effects
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseInContainer, setMouseInContainer] = useState(false);
  
  // State for video modal
  const [showVideo, setShowVideo] = useState(false);
  
  // Calculate spotlight effect based on mouse position
  const calculateSpotlightPosition = () => {
    if (!containerRef.current || !mouseInContainer) return { x: '50%', y: '50%' };
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = mousePosition.x - rect.left;
    const y = mousePosition.y - rect.top;
    
    return {
      x: `${(x / rect.width) * 100}%`,
      y: `${(y / rect.height) * 100}%`
    };
  };
  
  const spotlightPosition = calculateSpotlightPosition();
  
  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden pt-32 pb-20 bg-black"
      ref={containerRef}
      onMouseEnter={() => setMouseInContainer(true)}
      onMouseLeave={() => setMouseInContainer(false)}
    >
      {/* Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.8)_100%)]">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>
      
      {/* Spotlight effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: mouseInContainer
            ? `radial-gradient(circle at ${spotlightPosition.x} ${spotlightPosition.y}, rgba(255, 255, 255, 0.15) 0%, transparent 50%)`
            : 'none'
        }}
      />
      
      {/* Noise texture */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />
      
      {/* Floating orbs/gradients */}
      <motion.div 
        className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div 
        className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 blur-3xl"
        animate={{ 
          y: [0, 30, 0],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 18, 
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      
      <motion.div
        style={{ y, opacity, scale }}
        className="container mx-auto px-6 pt-8 relative z-10"
      >
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Hero Content */}
          <div className="lg:w-1/2">
            <RevealText delay={0.2} className="mb-4">
              <span className="inline-flex items-center text-xs bg-white/5 backdrop-blur-sm text-white/70 py-1.5 px-3 border border-white/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-2"></span>
                Video editing subscription
              </span>
            </RevealText>
            
            <h1 className="text-6xl lg:text-7xl font-medium text-white leading-[1.1]">
              <RevealText delay={0.3}>
                The only
              </RevealText>
              <RevealText delay={0.4}>
                <span className="font-light italic text-white/90">video editing</span>
              </RevealText>
              <RevealText delay={0.5}>
                you need
              </RevealText>
            </h1>
            
            <RevealText delay={0.6} className="text-white/60 text-lg my-8 max-w-md">
              We're all about taking your visual content to the next level with premium editing, color grading, and motion graphics.
            </RevealText>
            
            <RevealText delay={0.7} className="flex flex-wrap gap-4">
              <Button primary={false}>
                View pricing
              </Button>
              
              <Button outlined={true} onClick={() => setShowVideo(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch showreel
              </Button>
            </RevealText>
            
            <RevealText delay={0.9} className="mt-12">
              <div className="flex flex-wrap items-center text-sm text-white/50">
                <span className="inline-flex items-center mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1 text-red-400">
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                  </svg>
                  We're thrilled to share
                </span>
                <span className="font-medium text-white mr-1">Paytent</span>
                has raised an
                <span className="font-medium text-white mx-1">impressive $95.5 million</span>
                <a href="#" className="text-blue-400 underline ml-1">View case study</a>
              </div>
            </RevealText>
          </div>
          
          {/* Hero Image/Video */}
          <div className="lg:w-1/2 mt-12 lg:mt-0">
            <RevealText delay={0.7} className="relative">
              {/* Main visual */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/3]">
                <img 
                  src="/api/placeholder/800/600?text=Video+Studio" 
                  alt="Video editing showcase" 
                  className="w-full h-full object-cover"
                />
                
                {/* Play button overlay */}
                <div 
                  className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer group"
                  onClick={() => setShowVideo(true)}
                >
                  <motion.div
                    className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white ml-1">
                      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                </div>
                
                {/* Floating logo overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                    <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" />
                    <circle cx="12" cy="12" r="4" fill="white" fillOpacity="0.2" />
                    <circle cx="12" cy="12" r="2" fill="white" />
                  </svg>
                  <span className="text-2xl font-medium tracking-wide">FRAMECUT</span>
                </div>
              </div>
              
              {/* Floating elements */}
              <motion.div 
                className="absolute -top-8 -left-8 bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-xl z-10 shadow-xl"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, 2, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Premium Editing</p>
                    <p className="text-white/60 text-xs">Cinematic quality</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl z-10 shadow-xl"
                animate={{ 
                  y: [0, 6, 0],
                  rotate: [0, -2, 0]
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center border border-white/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">48hr Delivery</p>
                    <p className="text-white/60 text-xs">Express editing</p>
                  </div>
                </div>
              </motion.div>
            </RevealText>
          </div>
        </div>
      </motion.div>
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <motion.span 
          className="text-white/50 text-xs mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll to explore
        </motion.span>
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white/50">
            <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </motion.div>
      
      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && (
          <motion.div 
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowVideo(false)}
          >
            <motion.button 
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowVideo(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </motion.button>
            
            <motion.div 
              className="w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Video Showreel"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

// Clients Section Component
const ClientsSection: React.FC = () => {
  const clients = [
    { name: 'Netflix', icon: '#' },
    { name: 'HBO', icon: '#' },
    { name: 'Amazon', icon: '#' },
    { name: 'Apple', icon: '#' },
    { name: 'Sony', icon: '#' },
    { name: 'Warner', icon: '#' }
  ];
  
  return (
    <section className="py-16 bg-zinc-900/70 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-10">
          <RevealText>
            <h3 className="text-white/70 text-sm uppercase tracking-wider mb-2">Trusted by industry leaders</h3>
          </RevealText>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-8">
          {clients.map((client, index) => (
            <RevealText key={client.name} delay={0.1 * index} className="text-white/40 hover:text-white/70 transition-colors">
              <div className="h-8">
                <span className="text-xl font-semibold">{client.name}</span>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section Component
const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 'commercial',
      title: 'Commercial Editing',
      description: 'High-impact commercial videos that drive conversions and elevate your brand with color grading and sound design.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
        </svg>
      )
    },
    {
      id: 'social',
      title: 'Social Media Content',
      description: 'Engaging short-form content optimized for each platform, designed to boost engagement and sharing.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'motion',
      title: 'Motion Graphics',
      description: 'Custom animations and visual effects that communicate complex ideas clearly while enhancing visual appeal.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'corporate',
      title: 'Corporate Videos',
      description: 'Professional business communications that convey your message with clarity, authority, and visual appeal.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M3 2.25a.75.75 0 01.75.75v.54l1.838-.46a9.75 9.75 0 016.725.738l.108.054a8.25 8.25 0 005.58.652l3.109-.732a.75.75 0 01.917.81 47.784 47.784 0 00.005 10.337.75.75 0 01-.574.812l-3.114.733a9.75 9.75 0 01-6.594-.77l-.108-.054a8.25 8.25 0 00-5.69-.625l-2.202.55V21a.75.75 0 01-1.5 0V3A.75.75 0 013 2.25z" clipRule="evenodd" />
        </svg>
      )
    }
  ];
  
  return (
    <section id="services" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Our Services" 
          subtitle="Premium video editing services tailored to your specific needs and goals."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <RevealText key={service.id} delay={0.1 * index} className="h-full">
              <div className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl h-full flex flex-col hover:bg-white/10 transition-colors duration-300">
                <div className="w-12 h-12 bg-black flex items-center justify-center rounded-lg border border-white/20 mb-6">
                  <span className="text-white">{service.icon}</span>
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-4">{service.title}</h3>
                <p className="text-white/60 mb-6 flex-grow">{service.description}</p>
                
                <motion.a
                  href={`#${service.id}`}
                  className="inline-flex items-center text-white/80 hover:text-white transition-colors"
                  whileHover={{ x: 5 }}
                >
                  Learn more
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </motion.a>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};

// Portfolio Section Component
const PortfolioSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  
  const portfolioItems = [
    {
      id: 'p1',
      title: 'Tech Product Launch',
      category: 'commercial',
      image: '/api/placeholder/600/400?text=Tech+Launch'
    },
    {
      id: 'p2',
      title: 'Fashion Brand Story',
      category: 'commercial',
      image: '/api/placeholder/600/400?text=Fashion+Brand'
    },
    {
      id: 'p3',
      title: 'Social Media Campaign',
      category: 'social',
      image: '/api/placeholder/600/400?text=Social+Campaign'
    },
    {
      id: 'p4',
      title: 'Corporate Training',
      category: 'corporate',
      image: '/api/placeholder/600/400?text=Corporate+Training'
    },
    {
      id: 'p5',
      title: 'Animated Infographic',
      category: 'motion',
      image: '/api/placeholder/600/400?text=Animated+Infographic'
    },
    {
      id: 'p6',
      title: 'Promotional Video',
      category: 'commercial',
      image: '/api/placeholder/600/400?text=Promotional+Video'
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'commercial', label: 'Commercial' },
    { id: 'social', label: 'Social Media' },
    { id: 'motion', label: 'Motion Graphics' },
    { id: 'corporate', label: 'Corporate' }
  ];
  
  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);
  
  return (
    <section id="work" className="py-24 bg-zinc-900 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20 mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px",
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Our Work" 
          subtitle="Featured projects showcasing our expertise in video editing and storytelling."
        />
        
        <div className="flex flex-wrap justify-center mb-12 gap-3">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${
                activeFilter === category.id 
                  ? 'bg-white text-black' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <PortfolioItem item={item} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-16 text-center">
          <Button primary={false}>
            View All Projects
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </section>
  );
};

// Portfolio Item Component
const PortfolioItem: React.FC<{
  item: {
    id: string;
    title: string;
    category: string;
    image: string;
  }
}> = ({ item }) => {
  return (
    <RevealText className="h-full">
      <div className="bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 h-full group">
        <div className="relative aspect-[3/2] overflow-hidden">
          <motion.img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <motion.button
              className="px-4 py-2 bg-white text-black rounded-lg font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Project
            </motion.button>
          </div>
        </div>
        
        <div className="p-5">
          <h3 className="text-white font-medium text-lg">{item.title}</h3>
          <p className="text-white/50 text-sm capitalize">{item.category.replace('-', ' ')}</p>
        </div>
      </div>
    </RevealText>
  );
};

// Process Section Component
const ProcessSection: React.FC = () => {
  const steps = [
    {
      id: 1,
      title: 'Creative Brief',
      description: 'We start by understanding your vision, goals, and target audience to create a strategic approach.'
    },
    {
      id: 2,
      title: 'Content Planning',
      description: 'Our team develops a detailed outline and storyboard, ensuring the perfect narrative flow.'
    },
    {
      id: 3,
      title: 'Premium Editing',
      description: 'Expert editors craft your footage with precise cuts, transitions, and pacing to maximize impact.'
    },
    {
      id: 4,
      title: 'Color & Sound',
      description: 'Advanced color grading and sound design elevate the production quality to cinematic standards.'
    },
    {
      id: 5,
      title: 'Review & Refine',
      description: 'We collaborate with you through revision rounds to perfect every detail of your video.'
    },
    {
      id: 6,
      title: 'Final Delivery',
      description: 'Receive your completed project in any format needed for your target platforms and audiences.'
    }
  ];
  
  return (
    <section id="process" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Our Process" 
          subtitle="A strategic approach that ensures consistent results and exceptional quality."
        />
        
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {steps.map((step, index) => (
              <RevealText key={step.id} delay={index * 0.1} className="relative">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-6 text-white font-bold">
                    {step.id}
                  </div>
                  
                  <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                  <p className="text-white/60">{step.description}</p>
                </div>
                
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden md:block absolute top-1/2 -right-7 transform translate-x-1/2 -translate-y-1/2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 12L7 22M17 12L7 2M17 12H3" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                
                {index < steps.length - 1 && index % 2 === 1 && (
                  <div className="hidden md:block absolute top-full left-1/2 transform -translate-x-1/2 translate-y-5">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 17L2 7M12 17L22 7M12 17V3" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </RevealText>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Testimonials Section Component
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 't1',
      name: 'Sarah J.',
      role: 'Marketing Director',
      company: 'TechSolutions',
      quote: 'The team at FrameCut transformed our product demo into a compelling story. The quality of their work is unmatched, and we saw immediate results in our conversion rates.'
    },
    {
      id: 't2',
      name: 'Michael R.',
      role: 'Content Creator',
      company: 'Lifestyle Channel',
      quote: 'Working with this team has been transformative for my channel. Their attention to detail and creative suggestions have helped me grow my audience by over 200% in just six months.'
    },
    {
      id: 't3',
      name: 'Elena K.',
      role: 'CEO',
      company: 'Startup Innovations',
      quote: 'Our investment pitch video edited by FrameCut was instrumental in securing our Series A funding. Their ability to distill complex information into a compelling narrative is remarkable.'
    },
  ];
  
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute left-0 top-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="What Clients Say" 
          subtitle="Don't take our word for it – hear from the brands and creators we've worked with."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <RevealText key={testimonial.id} delay={index * 0.1} className="h-full">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-xl h-full flex flex-col">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6 text-white/40">
                  <path d="M11.25 16.25H5C4.33696 16.25 3.70107 15.9866 3.23223 15.5178C2.76339 15.0489 2.5 14.413 2.5 13.75V8.75C2.5 8.08696 2.76339 7.45107 3.23223 6.98223C3.70107 6.51339 4.33696 6.25 5 6.25H8.75C9.41304 6.25 10.0489 6.51339 10.5178 6.98223C10.9866 7.45107 11.25 8.08696 11.25 8.75V23.75M27.5 16.25H21.25C20.587 16.25 19.9511 15.9866 19.4822 15.5178C19.0134 15.0489 18.75 14.413 18.75 13.75V8.75C18.75 8.08696 19.0134 7.45107 19.4822 6.98223C19.9511 6.51339 20.587 6.25 21.25 6.25H25C25.663 6.25 26.2989 6.51339 26.7678 6.98223C27.2366 7.45107 27.5 8.08696 27.5 8.75V23.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                
                <p className="text-white/80 italic mb-8 flex-grow">{testimonial.quote}</p>
                
                <div>
                <p className="font-medium text-white">{testimonial.name}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </RevealText>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section Component
const PricingSection: React.FC = () => {
  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      description: 'Perfect for social media content and simple videos',
      price: 499,
      features: [
        '1-2 minute video length',
        'Basic color correction',
        'Simple transitions',
        'Background music',
        '2 revision rounds',
        '5-day delivery'
      ]
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Enhanced editing for marketing and brand videos',
      price: 999,
      featured: true,
      features: [
        'Up to 5 minute video length',
        'Advanced color grading',
        'Custom transitions',
        'Sound design & mixing',
        'Basic motion graphics',
        '3 revision rounds',
        '3-day delivery'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Comprehensive package for high-end productions',
      price: 1999,
      features: [
        'Up to 10 minute video length',
        'Cinematic color grading',
        'Advanced motion graphics',
        'Custom sound design',
        'Title & end credits',
        'Unlimited revisions',
        '48-hour delivery'
      ]
    }
  ];
  
  return (
    <section id="pricing" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-0 top-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      </div>
      
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/5 to-purple-500/5 blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Simple, Transparent Pricing" 
          subtitle="Choose the plan that fits your project needs. All plans include high-quality editing and personal support."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <RevealText key={plan.id} delay={index * 0.1} className="h-full">
              <div className={`h-full relative rounded-xl border ${plan.featured ? 'border-white/20' : 'border-white/10'} overflow-hidden flex flex-col`}>
                {plan.featured && (
                  <div className="absolute top-0 left-0 right-0 py-1.5 bg-white text-black text-xs font-medium text-center">
                    MOST POPULAR
                  </div>
                )}
                
                <div className={`p-8 ${plan.featured ? 'pt-12 bg-white/5' : 'bg-white/[0.03]'} flex-grow flex flex-col`}>
                  <h3 className="text-xl font-medium text-white mb-2">{plan.name}</h3>
                  <p className="text-white/60 text-sm mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-white/50 ml-1">per project</span>
                  </div>
                  
                  <div className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white/40 mr-3 flex-shrink-0 mt-0.5">
                          <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                        </svg>
                        <span className="text-white/70">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    primary={false} 
                    className={`w-full justify-center ${plan.featured ? 'bg-white' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                  >
                    Select Plan
                  </Button>
                </div>
              </div>
            </RevealText>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <RevealText delay={0.4}>
            <p className="text-white/60 mb-6">Need a custom solution for your specific project?</p>
            <Button outlined={true}>
              Contact for Custom Quote
            </Button>
          </RevealText>
        </div>
      </div>
    </section>
  );
};

// Call to Action Section Component
const CTASection: React.FC = () => {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      <motion.div 
        className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-black/10 blur-3xl"
        animate={{ 
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <RevealText>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-white mb-6">
              Ready to elevate your video content?
            </h2>
          </RevealText>
          
          <RevealText delay={0.1} className="text-white/60 text-xl mb-12 max-w-2xl mx-auto">
            Let's create videos that capture attention, drive engagement, and deliver results for your brand.
          </RevealText>
          
          <RevealText delay={0.2} className="flex flex-wrap justify-center gap-4">
            <Button primary={false}>
              Start Your Project
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </Button>
            
            <Button outlined={true}>
              View Our Work
            </Button>
          </RevealText>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/5 pt-20 pb-8 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Company Info */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 text-white mb-6">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-black rounded-full"></div>
                <div className="absolute inset-0 w-6 h-6 m-1">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                    <path d="M4 8V4m0 4h4m-4 0L7 5M4 16v4m0-4h4m-4 0l3 3m8-11V4m0 4h4m-4 0l3-3m-3 11v4m0-4h4m-4 0l3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl tracking-tight">FRAME<span className="font-bold">CUT</span></span>
            </a>
            
            <p className="text-white/60 mb-6">
              Premium video editing services for creators, brands, and businesses. Elevate your visual content through expert editing.
            </p>
            
            <div className="flex space-x-4">
              {['Twitter', 'Instagram', 'YouTube', 'LinkedIn'].map((platform) => (
                <a
                  key={platform}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                  aria-label={platform}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-medium mb-6">Services</h3>
            <ul className="space-y-3">
              {['Commercial Editing', 'Social Media Content', 'Motion Graphics', 'Corporate Videos', 'Color Grading'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-6">Company</h3>
            <ul className="space-y-3">
              {['About Us', 'Our Work', 'Pricing', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-medium mb-6">Contact</h3>
            <ul className="space-y-3 text-white/60">
              <li>hello@framecut.studio</li>
              <li>+1 (555) 123-4567</li>
              <li>
                123 Creative Street<br />
                New York, NY 10001
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/40 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} FrameCut Studios. All rights reserved.
          </p>
          
          <div className="flex space-x-8">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Scroll to top button
const ScrollToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-black border border-white/10 text-white flex items-center justify-center z-40 hover:border-white/30 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ y: -5 }}
          whileTap={{ y: 0 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Main Home Page Component
const Home2: React.FC = () => {
  return (
    <div className="font-sans bg-black min-h-screen text-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <ClientsSection />
      <ServicesSection />
      <PortfolioSection />
      <ProcessSection />
      <TestimonialsSection />
      <PricingSection />
      <CTASection />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};


export default Home2;