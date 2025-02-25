import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { FaPlay, FaCheck, FaClock, FaStar, FaQuoteLeft, FaArrowRight, FaTimes, FaBars } from 'react-icons/fa';

// Types
interface ServiceType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
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
}

interface FaqType {
  id: string;
  question: string;
  answer: string;
}

// Reusable Button Component (inline)
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  onClick, 
  className = '' 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-orange-500',
    outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500'
  };
  
  const sizeStyles = {
    sm: 'text-sm py-2 px-4',
    md: 'text-base py-3 px-6',
    lg: 'text-lg py-4 px-8'
  };
  
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};


// Clean Grid Background
const GridBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
    </div>
  );
};

// Enhanced Service Card Component with clean design
const ServiceCard: React.FC<{
  service: ServiceType;
  index: number;
}> = ({ service, index }) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: false, amount: 0.3 });
  
  return (
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
      whileHover={{ y: -10, scale: 1.03 }}
      className="bg-white shadow-lg border border-gray-100 text-gray-800 rounded-xl p-6 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
          <div className="text-2xl">{service.icon}</div>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="mt-auto">
          <motion.a 
            href="#" 
            className="text-blue-600 inline-flex items-center group-hover:text-blue-800 transition-colors duration-300"
            whileHover={{ x: 5 }}
          >
            Learn more <FaArrowRight className="ml-2" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

// Clean VideoPlayer Component
const VideoPlayer: React.FC<{
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
}> = ({ thumbnailUrl, videoUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="relative rounded-xl overflow-hidden group shadow-lg">
      {!isPlaying ? (
        <>
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={thumbnailUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(true)}
              className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center"
            >
              <FaPlay className="text-xl ml-1" />
            </motion.button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-white font-bold">{title}</h3>
          </div>
        </>
      ) : (
        <div className="aspect-video w-full">
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
    </div>
  );
};

// Clean Testimonial Card Component
const TestimonialCard: React.FC<{
  testimonial: TestimonialType;
  index: number;
}> = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ scale: 1.03 }}
      className="bg-white shadow-lg border border-gray-100 text-gray-800 rounded-xl p-6 transition-all duration-300 relative overflow-hidden group"
    >
      <div className="relative z-10">
        <FaQuoteLeft className="text-blue-400 text-3xl mb-4" />
        <p className="text-gray-600 italic mb-6">{testimonial.quote}</p>
        <div className="flex items-center">
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
  );
};

// Enhanced FAQ Accordion Component
const FaqItem: React.FC<{
  faq: FaqType;
  isOpen: boolean;
  toggleOpen: () => void;
  index: number;
}> = ({ faq, isOpen, toggleOpen, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="border-b border-gray-200 last:border-b-0 relative overflow-hidden"
    >
      <button
        onClick={toggleOpen}
        className="w-full py-4 px-2 flex justify-between items-center text-left focus:outline-none group"
      >
        <h3 className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{faq.question}</h3>
        <motion.span 
          className="text-blue-500 ml-4"
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes /> : <FaArrowRight />}
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden relative"
          >
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500 rounded-full" />
            <div className="py-3 px-4 text-gray-600">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Creative Section Header
const SectionHeader: React.FC<{
  title: string;
  subtitle: string;
  align?: 'left' | 'center' | 'right';
}> = ({ title, subtitle, align = 'center' }) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };
  
  return (
    <div className={`mb-16 ${alignClasses[align]}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="relative">
            <span className="relative z-10">{title}</span>
            <span className="absolute -bottom-2 left-0 right-0 h-3 bg-blue-100 -z-10 skew-x-3"></span>
          </span>
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </motion.div>
    </div>
  );
};

// Creative Shape Elements for background
const ShapeElements: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-orange-50 rounded-full opacity-70"></div>
      <div className="absolute bottom-40 left-20 w-40 h-40 bg-blue-50 rotate-45 opacity-70"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-orange-50 rounded-full opacity-70"></div>
    </div>
  );
};

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
  
  const servicesInView = useInView(servicesRef, { once: false, amount: 0.2 });
  const portfolioInView = useInView(portfolioRef, { once: false, amount: 0.2 });

  
  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const heroY = useTransform(smoothScrollProgress, [0, 0.3], [0, -50]);
  
  // Service data
  const services: ServiceType[] = [
    {
      id: 'reels',
      title: 'Reels & Short-form Editing',
      description: 'Engaging, scroll-stopping content optimized for social media platforms.',
      icon: <FaPlay />
    },
    {
      id: 'youtube',
      title: 'YouTube Video Editing',
      description: 'Professional long-form content that keeps viewers engaged until the end.',
      icon: <FaPlay />
    },
    {
      id: 'corporate',
      title: 'Corporate & Business Editing',
      description: 'Polished, professional videos that elevate your brand image.',
      icon: <FaPlay />
    },
    {
      id: 'podcast',
      title: 'Podcast Editing',
      description: 'Crisp audio and engaging video for your podcast content.',
      icon: <FaPlay />
    },
    {
      id: 'animations',
      title: 'Custom Animations & Motion Graphics',
      description: 'Eye-catching visuals that bring your ideas to life.',
      icon: <FaPlay />
    }
  ];
  
  // Portfolio data
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
  
  // Testimonial data
  const testimonials: TestimonialType[] = [
    {
      id: 'testimonial1',
      name: 'Sarah Johnson',
      company: 'Tech Innovations Inc.',
      quote: 'The team delivered our videos ahead of schedule and the quality exceeded our expectations. Our engagement has increased by 200% since implementing their edited content.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 'testimonial2',
      name: 'Michael Chen',
      company: 'Growth Marketing Agency',
      quote: 'Weve worked with many video editors, but this team stands out. They understand marketing psychology and create videos that actually convert.',
      image: '/api/placeholder/100/100'
    },
    {
      id: 'testimonial3',
      name: 'Elena Rodriguez',
      company: 'Content Creator',
      quote: 'Since hiring this agency, my channel has grown from 10K to 500K subscribers in just 8 months. Their editing style is exactly what my audience loves.',
      image: '/api/placeholder/100/100'
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
      {/* Clean Grid Background with Shaped Elements */}
      <GridBackground />
      <ShapeElements />
      
      {/* Navigation - Bright and Clean */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <a href="#" className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="text-blue-600 mr-1">Video</span>
                Editors
              </a>
            </motion.div>
            
            {/* Desktop Navigation */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:flex items-center space-x-8"
            >
              <a href="#" className="text-gray-800 hover:text-blue-600 transition-colors">Home</a>
              <a href="#services" className="text-gray-800 hover:text-blue-600 transition-colors">Services</a>
              <a href="#portfolio" className="text-gray-800 hover:text-blue-600 transition-colors">Portfolio</a>
              <a href="#about" className="text-gray-800 hover:text-blue-600 transition-colors">About</a>
              <a href="#contact" className="text-gray-800 hover:text-blue-600 transition-colors">Contact</a>
              <Button variant="primary" size="sm">
                Get a Free Consultation
              </Button>
            </motion.nav>
            
            {/* Mobile menu button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:hidden text-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <FaBars className="text-2xl" />
            </motion.button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white shadow-lg"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  <a href="#" className="text-gray-800 hover:text-blue-600 transition-colors py-2">Home</a>
                  <a href="#services" className="text-gray-800 hover:text-blue-600 transition-colors py-2">Services</a>
                  <a href="#portfolio" className="text-gray-800 hover:text-blue-600 transition-colors py-2">Portfolio</a>
                  <a href="#about" className="text-gray-800 hover:text-blue-600 transition-colors py-2">About</a>
                  <a href="#contact" className="text-gray-800 hover:text-blue-600 transition-colors py-2">Contact</a>
                  <Button variant="primary" size="sm" className="w-full">
                    Get a Free Consultation
                  </Button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      
      {/* Enhanced Hero Section with more creative elements */}
<motion.section
  ref={heroRef}
  style={{ y: heroY }}
  className="relative min-h-screen flex items-center justify-center z-10 pt-24 overflow-hidden"
>
  {/* Creative background with animated shapes */}
  <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-blue-50 z-0">
    <motion.div 
      className="absolute top-20 right-20 w-64 h-64 rounded-full bg-gradient-to-r from-blue-100 to-blue-50 opacity-60"
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 10, 0],
        y: [0, -15, 0]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.div 
      className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-gradient-to-r from-orange-100 to-yellow-50 opacity-50"
      animate={{ 
        scale: [1, 1.1, 1],
        rotate: [0, -10, 0],
        x: [0, 15, 0]
      }}
      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="absolute inset-0 bg-grid-pattern opacity-30"></div>
  </div>

  {/* Decorative elements */}
  <div className="absolute top-1/3 left-10 md:left-20 w-40 h-40 bg-blue-100 rounded-md rotate-12 opacity-30 backdrop-blur-sm"></div>
  <div className="absolute bottom-1/4 right-10 md:right-20 w-28 h-28 bg-orange-100 rounded-full opacity-40 backdrop-blur-sm"></div>
  <div className="absolute top-1/4 right-1/4 w-10 h-20 bg-blue-200 rounded-md rotate-45 opacity-30"></div>
  <div className="absolute bottom-1/3 left-1/4 w-16 h-16 bg-yellow-100 rounded-full opacity-40"></div>

  <div className="container mx-auto px-4 flex flex-col items-center relative z-10">
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-5xl text-center"
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
        ></motion.div>
        <motion.div 
          className="absolute -right-5 top-1/2 w-5 h-32 bg-orange-200 rounded-l-lg hidden md:block"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        ></motion.div>
        
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <motion.span 
            className="block text-gray-800"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            The Last
          </motion.span>
          <motion.span 
            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500 relative inline-block"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Video Editing Agency
            <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 600 12" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                  <stop offset="0.5" stopColor="#F97316" />
                  <stop offset="1" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
            </svg>
          </motion.span>
          <motion.span 
            className="block text-gray-800"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            You'll Ever Hire.
          </motion.span>
        </h1>
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
              className="absolute -bottom-2 left-0 right-0 h-1 bg-blue-100 rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            ></motion.span>
          </span>
        </p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.1 }}
        className="flex flex-wrap gap-6 justify-center"
      >
        <Button 
          variant="primary" 
          size="lg"
          className="relative group overflow-hidden"
        >
          <motion.span 
            className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          ></motion.span>
          <span className="relative z-10 flex items-center">
            Get a Free Consultation
            <motion.span
              className="ml-2 inline-flex"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaArrowRight />
            </motion.span>
          </span>
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          className="relative group overflow-hidden"
        >
          <motion.span 
            className="absolute inset-0 w-0 bg-blue-50 group-hover:w-full transition-all duration-300"
          ></motion.span>
          <span className="relative z-10">View Our Work</span>
        </Button>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 1.4 }}
        className="mt-20 flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16"
      >
        <motion.div 
          className="flex items-center bg-white p-4 pr-6 rounded-full shadow-md"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
        >
          <div className="flex -space-x-4">
            <motion.div 
              className="w-12 h-12 rounded-full border-2 border-blue-200 overflow-hidden bg-white z-30"
              whileHover={{ scale: 1.1, zIndex: 40 }}
            >
              <img src="/api/placeholder/100/100" alt="Client" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              className="w-12 h-12 rounded-full border-2 border-blue-200 overflow-hidden bg-white z-20"
              whileHover={{ scale: 1.1, zIndex: 40 }}
            >
              <img src="/api/placeholder/100/100" alt="Client" className="w-full h-full object-cover" />
            </motion.div>
            <motion.div 
              className="w-12 h-12 rounded-full border-2 border-blue-200 overflow-hidden bg-white z-10"
              whileHover={{ scale: 1.1, zIndex: 40 }}
            >
              <img src="/api/placeholder/100/100" alt="Client" className="w-full h-full object-cover" />
            </motion.div>
          </div>
          <span className="ml-4 text-gray-600">
            <span className="font-bold text-gray-800">100+</span> happy clients
          </span>
        </motion.div>
        
        <motion.div 
          className="flex items-center bg-white p-4 pr-6 rounded-full shadow-md"
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1), 0 8px 10px -6px rgba(59, 130, 246, 0.1)" }}
        >
          <div className="flex">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <motion.div 
                key={index}
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1, delay: index * 0.2, repeat: Infinity, repeatDelay: 5 }}
              >
                <FaStar className="text-xl text-yellow-400" />
              </motion.div>
            ))}
          </div>
          <span className="ml-2 text-gray-600">
            <span className="font-bold text-gray-800">4.9/5</span> rating
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
  
  {/* Scrolling indicator */}
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
      <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center pt-2">
        <motion.div 
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-1.5 h-1.5 bg-blue-500 rounded-full"
        />
      </div>
    </motion.div>
  </motion.div>
</motion.section>
      
      {/* Why Choose Us Section - Creative with diagonal elements */}
      <section className="relative z-10 py-20 bg-white overflow-hidden">
        {/* Diagonal element */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-blue-50 transform -skew-y-2"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-blue-50 transform skew-y-2"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader 
            title="Why Choose Us?" 
            subtitle="We combine technical expertise with creative vision to deliver videos that exceed expectations."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-blue-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <FaClock className="text-blue-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">Fast Turnaround</h3>
                <p className="text-gray-600">
                  Most projects delivered within 48-72 hours. Need it faster? Ask about our rush delivery options.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <FaCheck className="text-blue-500 mr-2" /> 24-hour rush delivery
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-blue-500 mr-2" /> Weekend availability
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-blue-500 mr-2" /> Real-time progress updates
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-orange-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-orange-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                  <FaStar className="text-orange-500 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-orange-500 transition-colors duration-300">Premium Quality</h3>
                <p className="text-gray-600">
                  Professional color grading, sound design, and motion graphics that elevate your content.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <FaCheck className="text-orange-500 mr-2" /> Cinema-grade color correction
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-orange-500 mr-2" /> Professional sound mixing
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-orange-500 mr-2" /> Custom motion graphics
                  </li>
                </ul>
              </div>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-green-500 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -mr-10 -mt-10 opacity-50"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <FaPlay className="text-green-600 text-2xl" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-green-600 transition-colors duration-300">Engagement Focused</h3>
                <p className="text-gray-600">
                  Editing techniques proven to increase watch time, shares, and conversion rates.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <FaCheck className="text-green-600 mr-2" /> Data-driven editing approaches
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-green-600 mr-2" /> Audience retention optimization
                  </li>
                  <li className="flex items-center">
                    <FaCheck className="text-green-600 mr-2" /> Platform-specific strategies
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Services Section - Creative with alternating patterns */}
      <section 
        id="services"
        ref={servicesRef}
        className="relative z-10 py-20 bg-gradient-to-r from-white to-blue-50"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <svg className="absolute top-0 right-0 text-blue-100" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg className="absolute bottom-0 left-0 text-blue-100" width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa28" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-blue-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa28)" />
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
            <Button variant="primary" size="lg">
              View All Services <FaArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Portfolio Section - Creative with overlapping elements */}
      <section 
        id="portfolio"
        ref={portfolioRef}
        className="relative z-10 py-20 bg-white"
      >
        <div className="absolute top-0 right-0 w-1/3 h-32 bg-orange-50 rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-32 bg-blue-50 rounded-tr-full"></div>
        
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
                whileHover={{ scale: 1.03 }}
                className="rounded-xl overflow-hidden shadow-lg"
              >
                <VideoPlayer 
                  thumbnailUrl={item.thumbnailUrl}
                  videoUrl={item.videoUrl}
                  title={item.title}
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
            <Button variant="secondary" size="lg">
              View Full Portfolio <FaArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      {/* Stats Section - Creative with grid pattern */}
      <section className="relative z-10 py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="absolute inset-0 bg-grid-blue-pattern opacity-10"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center bg-white p-8 rounded-xl shadow-md"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-5xl font-bold text-blue-600 mb-2"
              >
                500+
              </motion.div>
              <p className="text-gray-600">Projects Completed</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center bg-white p-8 rounded-xl shadow-md"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-5xl font-bold text-orange-500 mb-2"
              >
                98%
              </motion.div>
              <p className="text-gray-600">Client Satisfaction</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center bg-white p-8 rounded-xl shadow-md"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-5xl font-bold text-blue-600 mb-2"
              >
                24h
              </motion.div>
              <p className="text-gray-600">Fastest Turnaround</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: false, amount: 0.3 }}
              className="text-center bg-white p-8 rounded-xl shadow-md"
            >
              <motion.div
                initial={{ scale: 1 }}
                whileInView={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: false, amount: 0.3 }}
                className="text-5xl font-bold text-orange-500 mb-2"
              >
                20+
              </motion.div>
              <p className="text-gray-600">Industries Served</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section - Creative carousel style */}
      <section 
        ref={testimonialsRef}
        className="relative z-10 py-20 bg-white"
      >
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-blue-50 rounded-r-full"></div>
        <div className="absolute right-0 top-1/4 w-32 h-32 bg-orange-50 rounded-l-full"></div>
        
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
        </div>
      </section>
      
      {/* FAQ Section - Creative accordion style */}
      <section 
        ref={faqRef}
        className="relative z-10 py-20 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Frequently Asked Questions" 
            subtitle="Everything you need to know about our video editing services."
          />
          
          <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-orange-500 to-blue-500"></div>
            
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
          </div>
        </div>
      </section>
      
      {/* CTA Section - Creative with wave pattern */}
      <section className="relative z-10 py-20 bg-blue-600 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-0">
          <svg className="relative block w-full h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
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
                  <svg className="absolute -bottom-2 left-0 w-full" height="6" viewBox="0 0 600 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 3C100 1 200 5 300 3C400 1 500 5 600 3" stroke="#FFF" strokeWidth="2"/>
                  </svg>
                </span>?
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Book a free consultation call with our team to discuss your project needs and goals.
              </p>
              <div className="flex flex-col md:flex-row justify-center items-center gap-6">
                <Button variant="secondary" size="lg">
                  Get a Free Consultation <FaArrowRight className="ml-2" />
                </Button>
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform rotate-180">
          <svg className="relative block w-full h-10 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
          </svg>
        </div>
      </section>
      
      {/* Footer - Clean and Bright */}
      <footer className="relative z-10 bg-white border-t border-gray-200 pt-16 pb-8">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <span className="text-blue-600 mr-1">Video</span>
                <span className="text-gray-800">Editors</span>
              </h3>
              <p className="text-gray-600 mb-4">
                The last video editing agency you'll ever hire. Professional editing services for creators, brands, and businesses.
              </p>
              <div className="flex space-x-4">
                {/* Social Media Icons with Hover Effects */}
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <motion.a 
                    key={social}
                    href="#" 
                    className="text-gray-400 hover:text-blue-600 transition-colors"
                    whileHover={{ scale: 1.2 }}
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      {social === 'facebook' && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />}
                      {social === 'twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                      {social === 'instagram' && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                      {social === 'youtube' && <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8v-8l8 3.993-8 4.007z" />}
                    </svg>
                  </motion.a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                {['Reels & Short-form', 'YouTube Videos', 'Corporate Videos', 'Podcast Editing', 'Motion Graphics'].map((item) => (
                  <li key={item}>
                    <motion.a 
                      href="#" 
                      className="text-gray-600 hover:text-blue-600 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                {['About Us', 'Portfolio', 'Pricing', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <motion.a 
                      href="#" 
                      className="text-gray-600 hover:text-blue-600 transition-colors inline-block"
                      whileHover={{ x: 5 }}
                    >
                      {item}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-gray-800 font-bold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li className="text-gray-600">hello@videoeditors.com</li>
                <li className="text-gray-600">+1 (555) 123-4567</li>
                <li className="text-gray-600">123 Creative St, Suite 101<br />Los Angeles, CA 90021</li>
              </ul>
              <div className="mt-6">
                <Button variant="outline" size="sm">
                  Contact Us
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-500 text-sm mb-4 md:mb-0">
                © 2025 VideoEditors. All rights reserved.
              </p>
              <div className="flex space-x-6">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                  <motion.a 
                    key={item}
                    href="#" 
                    className="text-gray-500 hover:text-blue-600 text-sm transition-colors"
                    whileHover={{ scale: 1.05 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      
    </div>
  );
};

export default Home;