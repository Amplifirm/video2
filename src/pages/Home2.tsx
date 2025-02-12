import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Menu, X, ChevronDown, ArrowRight, Check, Book, Users, Heart, School,
  MapPin, Calendar, GraduationCap, Globe 
} from 'lucide-react';
import Navbar from '../components/Navbar';


const HeroSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const painPoints = [
    "Issues with Class Size?",
    "Low Quality Teaching?",
    "Boring Activities?",
    "Poor Cultural Mix?",
    "Broken Promises?"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % painPoints.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'moveGrid 20s linear infinite'
          }}
        />
      </div>

      {/* Floating Elements */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400/20 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
          }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        {/* Pain Points Carousel */}
        <div className="mb-12 h-20">
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-2xl text-white/90"
            >
              Have you experienced...
              <br />
              <span className="text-green-400 font-medium">
                {painPoints[activeIndex]}
              </span>
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-5xl md:text-7xl font-medium text-white mb-6">
            Transform Your Future
            <br />
            <span className="text-green-400">Through Language</span>
          </h1>
          
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Your Ultimate Two-Week English Summer Experience in the UK
            for students aged 11-17
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </div>
    </div>
  );
};

const StatsSection: React.FC = () => {
  const stats = [
    { value: "95%", label: "Success Rate" },
    { value: "50+", label: "Partner Schools" },
    { value: "1000+", label: "Students Taught" },
    { value: "10+", label: "Years Experience" }
  ];

  return (
    <div className="py-20 bg-green-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl font-medium text-green-600 mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Expert Teaching",
      description: "Learn from qualified professionals"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cultural Immersion",
      description: "Experience British culture firsthand"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Premium Locations",
      description: "Study at prestigious institutions"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Programs",
      description: "Choose the perfect schedule"
    }
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-medium text-gray-900 mb-4">
            Why Choose GLA?
          </h2>
          <p className="text-xl text-gray-600">
            Experience excellence in language education
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="bg-white p-6 rounded-xl shadow-lg transition-shadow group-hover:shadow-xl">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Continue with more sections...
const WhyChooseSection: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const reasons = [
      {
        icon: <Book className="w-12 h-12" />,
        title: "Expert Teaching",
        description: "Learn from highly qualified teachers with years of experience in language education"
      },
      {
        icon: <Users className="w-12 h-12" />,
        title: "Small Class Sizes",
        description: "Maximum attention with our small group policy - never more than 15 students per class"
      },
      {
        icon: <Globe className="w-12 h-12" />,
        title: "Cultural Immersion",
        description: "Experience British culture firsthand through carefully planned activities and excursions"
      },
      {
        icon: <School className="w-12 h-12" />,
        title: "Premium Facilities",
        description: "Study at prestigious UK educational institutions with state-of-the-art facilities"
      },
      {
        icon: <Heart className="w-12 h-12" />,
        title: "Dedicated Support",
        description: "24/7 pastoral care and support to ensure your comfort and well-being"
      }
    ];
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reasons.length);
      }, 4000);
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-gray-900 mb-16"
          >
            Why Choose GLA?
          </motion.h2>
  
          <div className="relative h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center text-center"
              >
                <motion.div 
                  className="text-green-600 mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {reasons[currentIndex].icon}
                </motion.div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {reasons[currentIndex].title}
                </h3>
                <p className="text-gray-600 max-w-2xl">
                  {reasons[currentIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>
  
            {/* Navigation Dots */}
            <div className="absolute bottom-0 flex space-x-2">
              {reasons.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-green-500 w-6' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Add more sections...
  const ProgramHighlights: React.FC = () => {
    const programs = [
      {
        title: "Summer Intensive",
        duration: "2-4 weeks",
        features: [
          "15 hours of English per week",
          "Cultural activities",
          "Weekend excursions",
          "Full board accommodation"
        ]
      },
      {
        title: "Academic Year",
        duration: "1-3 terms",
        features: [
          "25 hours of English per week",
          "Exam preparation",
          "University visits",
          "Host family stays"
        ]
      },
      {
        title: "Special Programs",
        duration: "1-2 weeks",
        features: [
          "Themed courses",
          "Project-based learning",
          "Industry visits",
          "Specialized workshops"
        ]
      }
    ];
  
    return (
      <div className="py-24 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Programs</h2>
            <p className="text-gray-400">Choose the perfect program for your needs</p>
          </motion.div>
  
          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((program, index) => (
              <motion.div
                key={program.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors"
              >
                <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                <p className="text-green-400 mb-4">{program.duration}</p>
                <ul className="space-y-2">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-300">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition-colors"
                >
                  Learn More
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const StudentLife: React.FC = () => {
    return (
      <div className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Student Life at GLA</h2>
            <p className="text-gray-600">Experience a transformative journey</p>
          </motion.div>
  
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-green-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Activities & Excursions</h3>
                <p className="text-gray-600">From historic castle visits to modern city adventures</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Accommodation</h3>
                <p className="text-gray-600">Comfortable stays in carefully selected locations</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Support Services</h3>
                <p className="text-gray-600">24/7 care and assistance throughout your stay</p>
              </div>
            </motion.div>
  
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-green-500 to-blue-500 rounded-full opacity-20 absolute inset-0" />
              <img 
                src="/api/placeholder/600/600" 
                alt="Student Life"
                className="relative z-10 rounded-xl shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    );
  };
  
  // Use these components in your HomePage
  const HomePage: React.FC = () => {
    return (
      <div className="min-h-screen">
        <Navbar />
        <HeroSection />
        <WhyChooseSection />
        <ProgramHighlights />
        <StudentLife />
        {/* Add more sections as needed */}
      </div>
    );
  };
  
  export default HomePage;