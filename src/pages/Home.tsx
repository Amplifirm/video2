import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  Book, Users, Clock, Award, ChevronDown, Menu, X,
  Phone, Mail, MapPin, Facebook, Instagram, Linkedin,
  Globe, Calendar, Shield, Plane, PenTool, Palette, Twitter,
  Languages, Sparkles, Target, Heart, Map, GraduationCap, Check, Send,
  Lightbulb, Star, Zap, ArrowRight, Quote, Building2
} from 'lucide-react';

import Navbar from '../components/Navbar';
import GallerySection from './GallerySection';

interface FAQ {
    question: string;
    answer: string;
  }
  
  interface FAQItemProps {
    faq: FAQ;
    index: number;
  }

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  

{/* FAQ Item Component */}
const FAQItem: React.FC<FAQItemProps> = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.1 }}
        className="relative"
      >
        <motion.div
          className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden ${
            isOpen ? 'bg-white/10' : ''
          }`}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="text-white font-medium">{faq.question}</span>
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className={`w-5 h-5 ${isOpen ? 'text-green-400' : 'text-white/50'}`} />
            </motion.div>
          </button>
  
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-6 pb-4 text-white/70">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };


  // Update active section based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          setActiveSection(section.id);
        }
      });
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Unified Background With Parallax Effect */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-[#010101]" />
        <motion.div 
          className="absolute inset-0 opacity-10"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        >
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)'
          }} />
        </motion.div>
      </motion.div>

     < Navbar/>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="min-h-screen relative flex items-center justify-center pt-20">
          {/* Animated Gradient Orb */}
          <motion.div
            className="absolute w-[800px] h-[800px] rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              background: 'radial-gradient(circle at center, rgba(74, 222, 128, 0.2), rgba(59, 130, 246, 0.2))',
              filter: 'blur(100px)',
              opacity: 0.5
            }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Plane className="w-16 h-16 text-green-400 mx-auto mb-8" />
            </motion.div>

            <div className="space-y-4 mb-12">
              {["Learn the language", "Live the culture", "Love the journey"].map((text, i) => (
                <motion.h1
                  key={text}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className={`text-5xl md:text-7xl font-light ${
                    i === 1 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {text}
                </motion.h1>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-xl text-white/80 max-w-2xl mx-auto mb-12"
            >
              Your Ultimate Two-Week English Summer Experience in the UK 
              for students aged 11-17!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-400 rounded-lg text-black font-medium relative group overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10 flex items-center">
                  Explore Programs
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border border-white/20 text-white rounded-lg relative group overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/10"
                  initial={{ scale: 0 }}
                  whileHover={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Learn More</span>
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-white/50"
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Programs Section */}
      <section id="programs" className="min-h-screen py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                className="border-[0.5px] border-green-400/10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: i * 0.01 }}
              />
            ))}
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Title */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="text-green-400 text-sm uppercase tracking-wider"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Our Programs
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl text-white mt-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Experience Excellence
            </motion.h2>
          </motion.div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Core English Program",
                description: "Master essential language skills through immersive learning",
                features: ["Small class sizes", "Native speakers", "Weekly assessments"],
                icon: <Book className="w-8 h-8" />,
                color: "from-green-400/20"
              },
              {
                title: "Cultural Experience",
                description: "Explore British culture while improving your English",
                features: ["City tours", "Cultural workshops", "Local interactions"],
                icon: <Globe className="w-8 h-8" />,
                color: "from-blue-400/20"
              },
              {
                title: "Academic Excellence",
                description: "Prepare for international exams and academic success",
                features: ["Exam preparation", "Academic writing", "Study skills"],
                icon: <GraduationCap className="w-8 h-8" />,
                color: "from-purple-400/20"
              }
            ].map((program, index) => (
              <motion.div
                key={index}
                className="relative group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `
                      radial-gradient(
                        600px circle at ${hoveredCard === index ? 'var(--mouse-x, 50%)' : '50%'} ${
                          hoveredCard === index ? 'var(--mouse, 50%)' : '50%'
                        },
                        ${program.color},
                        transparent 40%
                      )
                    `,
                  }}
                />
                
                <motion.div 
                  className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div 
                    className="text-green-400 mb-4"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    {program.icon}
                  </motion.div>
                  
                  <h3 className="text-xl text-white mb-2">{program.title}</h3>
                  <p className="text-white/70 mb-4">{program.description}</p>
                  
                  <ul className="space-y-2">
                    {program.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center text-white/60"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                      >
                        <Star className="w-4 h-4 text-green-400 mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    className="mt-6 px-4 py-2 bg-green-400/10 text-green-400 rounded-lg w-full 
                             hover:bg-green-400 hover:text-black transition-all duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Learn More
                  </motion.button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="min-h-screen py-20 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: 'radial-gradient(circle at center, #4ade80 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Title */}
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl text-white mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              A Day in the Life
            </motion.h2>
            <motion.p
              className="text-white/70 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Experience a perfectly balanced day of learning, culture, and fun
            </motion.p>
          </motion.div>

          {/* Interactive Timeline */}
          <div className="relative">
            {/* Center line */}
            <motion.div
              className="absolute left-1/2 top-0 bottom-0 w-px bg-green-400/20"
              initial={{ height: 0 }}
              whileInView={{ height: '100%' }}
              viewport={{ once: true }}
            />

            {[
              {
                time: "9:00 AM",
                title: "Morning Classes",
                description: "Interactive English lessons with native speakers",
                icon: <Book className="w-6 h-6" />
              },
              {
                time: "11:30 AM",
                title: "Cultural Workshop",
                description: "Hands-on activities exploring British culture",
                icon: <Palette className="w-6 h-6" />
              },
              {
                time: "2:00 PM",
                title: "City Exploration",
                description: "Guided tours of historical landmarks",
                icon: <Map className="w-6 h-6" />
              },
              {
                time: "4:30 PM",
                title: "Social Activities",
                description: "Sports, games, and making international friends",
                icon: <Users className="w-6 h-6" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`flex items-center gap-8 mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <motion.div
                    className="inline-block bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10"
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-green-400 mb-2">{item.time}</div>
                    <h3 className="text-white text-xl mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.description}</p>
                  </motion.div>
                </div>

                <motion.div 
                  className="relative z-10"
                  whileHover={{ scale: 1.2, rotate: 180 }}
                >
                  <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center">
                    {item.icon}
                  </div>
                </motion.div>

                <div className="w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      [Previous code remains the same until stats section...]

{/* Enhanced Stats Section */}
<section className="py-32 relative overflow-hidden">
  {/* Animated Lines Background */}
  <motion.div 
    className="absolute inset-0"
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true }}
  >
    <svg className="w-full h-full">
      <pattern 
        id="grid" 
        width="50" 
        height="50" 
        patternUnits="userSpaceOnUse"
      >
        <motion.path 
          d="M 50 0 L 0 0 0 50" 
          fill="none" 
          stroke="rgba(74, 222, 128, 0.1)" 
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </motion.div>

  <div className="max-w-7xl mx-auto px-4 relative">
    {/* Section Header */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl md:text-5xl text-white mb-4">Our Impact</h2>
      <p className="text-white/70 text-lg">Making a difference in education worldwide</p>
    </motion.div>

    {/* Stats Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          value: 2000,
          suffix: "+",
          label: "Students Enrolled",
          icon: <Users className="w-6 h-6" />,
          color: "from-green-400/20"
        },
        {
          value: 95,
          suffix: "%",
          label: "Success Rate",
          icon: <Target className="w-6 h-6" />,
          color: "from-blue-400/20"
        },
        {
          value: 50,
          suffix: "+",
          label: "Partner Schools",
          icon: <Building2 className="w-6 h-6" />,
          color: "from-purple-400/20"
        },
        {
          value: 30,
          suffix: "+",
          label: "Countries",
          icon: <Globe className="w-6 h-6" />,
          color: "from-red-400/20"
        }
      ].map((stat, index) => (
        <motion.div
          key={index}
          className="relative group"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Background Glow */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${stat.color} to-transparent rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          {/* Stat Card */}
          <motion.div
            className="relative bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl p-8 h-full"
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Icon Circle */}
            <motion.div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400/20 to-transparent flex items-center justify-center mb-4"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-green-400">
                {stat.icon}
              </span>
            </motion.div>

            {/* Counter */}
            <motion.div
              className="text-4xl font-bold text-white mb-2 flex items-end"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {stat.value}
              </motion.span>
              <span className="text-green-400 ml-1">{stat.suffix}</span>
            </motion.div>

            {/* Label */}
            <div className="text-white/70">
              {stat.label}
            </div>

            {/* Decorative Corner */}
            <motion.div
              className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-green-400/30"
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>

    {/* Additional Highlights */}
    <motion.div 
      className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      {[
        {
          title: "Accredited Programs",
          description: "Internationally recognized certifications",
          icon: <Award className="w-6 h-6" />
        },
        {
          title: "Expert Teachers",
          description: "Native speakers with advanced degrees",
          icon: <GraduationCap className="w-6 h-6" />
        },
        {
          title: "Cultural Exchange",
          description: "Diverse international community",
          icon: <Globe className="w-6 h-6" />
        }
      ].map((highlight, index) => (
        <motion.div
          key={index}
          className="relative group"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
            <div className="text-green-400 mb-4">{highlight.icon}</div>
            <h3 className="text-white text-xl mb-2">{highlight.title}</h3>
            <p className="text-white/70">{highlight.description}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
</section>

{/* [Previous Contact Section remains the same...] */}

      {/* Enhanced Student Stories Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated dots */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span 
              className="text-green-400 text-sm uppercase tracking-wider block mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Testimonials
            </motion.span>
            <h2 className="text-4xl md:text-5xl text-white mb-4">Student Stories</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Hear from our global community of learners about their transformative experiences
            </p>
          </motion.div>

          {/* Featured Testimonial */}
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Background Blur */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/10 via-blue-400/10 to-purple-400/10 rounded-2xl blur-3xl"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />

              <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div>
                    <motion.img
                      src="/check.jpg"
                      alt="Featured Student"
                      className="rounded-xl w-full h-64 object-cover"
                      initial={{ scale: 1.2, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                    />
                  </div>
                  <div>
                    <motion.div
                      className="text-green-400 mb-6"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      <Quote className="w-10 h-10" />
                    </motion.div>
                    <motion.p
                      className="text-white/90 text-xl mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      "The experience at GLA wasn't just about learning English – it was about discovering 
                      a new culture, making lifelong friends, and growing as a person. The teachers made 
                      learning fun and engaging, and the cultural activities gave us real-world practice."
                    </motion.p>
                    <div>
                      <motion.div
                        className="text-white font-medium text-lg"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        Sarah Chen
                      </motion.div>
                      <motion.div
                        className="text-white/50"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                      >
                        Student from Singapore
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                content: "The cultural immersion was incredible. I learned so much about British culture while improving my English.",
                name: "Marco B.",
                country: "Italy",
                image: "/download.jpeg",
                rating: 5
              },
              {
                content: "Small class sizes meant I got lots of personal attention. The teachers really care about your progress.",
                name: "Yuki T.",
                country: "Japan",
                image: "/images.jpeg",
                rating: 5
              },
              {
                content: "The friends I made and the experiences we shared will stay with me forever. Truly life-changing!",
                name: "Emma L.",
                country: "France",
                image: "/download(1).jpeg",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
                
                {/* Card Content */}
                <div className="relative bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-6 h-full">
                  {/* Rating Stars */}
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i }}
                      >
                        <Star className="w-5 h-5 text-green-400 fill-green-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Quote */}
                  <motion.p
                    className="text-white/80 mb-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* Author Info */}
                  <div className="flex items-center">
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="ml-4">
                      <div className="text-white font-medium">{testimonial.name}</div>
                      <div className="text-white/50 text-sm">{testimonial.country}</div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 text-green-400/20"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                  >
                    <Quote className="w-8 h-8" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-green-400 rounded-lg text-black font-medium relative group overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative z-10">Join Our Community</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

        


      {/* Pricing Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Animated Gradient Stripes */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px w-full bg-gradient-to-r from-transparent via-green-400/20 to-transparent"
              style={{ top: `${20 * i}%` }}
              animate={{
                x: [-1000, 1000],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.span className="text-green-400 text-sm uppercase tracking-wider block mb-2">
              Pricing Plans
            </motion.span>
            <h2 className="text-4xl md:text-5xl text-white mb-4">Choose Your Experience</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Flexible options to suit your learning journey
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Essential",
                price: "£1,999",
                description: "Perfect for first-time language learners",
                features: [
                  "2 weeks accommodation",
                  "20 lessons per week",
                  "Basic cultural activities",
                  "Airport transfers",
                  "Course materials"
                ],
                highlight: false
              },
              {
                name: "Premium",
                price: "£2,499",
                description: "Our most popular program",
                features: [
                  "2 weeks accommodation",
                  "25 lessons per week",
                  "Extended cultural program",
                  "Airport transfers",
                  "Course materials",
                  "One-to-one tutoring"
                ],
                highlight: true
              },
              {
                name: "Elite",
                price: "£2,999",
                description: "The ultimate language experience",
                features: [
                  "2 weeks accommodation",
                  "30 lessons per week",
                  "Premium cultural activities",
                  "Private airport transfers",
                  "All materials included",
                  "Daily one-to-one sessions",
                  "Weekend excursions"
                ],
                highlight: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                className={`relative group ${plan.highlight ? 'md:-mt-8' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Glow Effect */}
                <motion.div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    plan.highlight ? 'bg-green-400/20' : 'bg-white/10'
                  } blur-xl`}
                />

                {/* Card Content */}
                <div className={`relative h-full bg-black/40 backdrop-blur-sm rounded-2xl p-8 border ${
                  plan.highlight ? 'border-green-400/50' : 'border-white/10'
                }`}>
                  {plan.highlight && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl text-white mb-2">{plan.price}</div>
                    <p className="text-white/70">{plan.description}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <motion.li
                        key={i}
                        className="flex items-center text-white/70"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                      >
                        <Check className="w-5 h-5 text-green-400 mr-2" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>

                  <motion.button
                    className={`w-full py-4 rounded-lg font-medium transition-colors ${
                      plan.highlight 
                        ? 'bg-green-400 text-black hover:bg-green-300' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Select Plan
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black" />
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage: 'radial-gradient(circle at center, #4ade80 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-4 relative">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl text-white mb-4">Common Questions</h2>
            <p className="text-white/70 text-lg">
              Everything you need to know about our programs
            </p>
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div className="space-y-4">
            {[
              {
                question: "What's included in the program fee?",
                answer: "Our program fees cover accommodation, meals, classes, course materials, cultural activities, and airport transfers. Additional excursions and one-to-one tutoring are available in premium packages."
              },
              {
                question: "How are students grouped in classes?",
                answer: "Students are grouped based on their English proficiency level, determined by a placement test. We maintain small class sizes of maximum 15 students to ensure personalized attention."
              },
              {
                question: "What accommodation options are available?",
                answer: "We offer carefully selected homestay accommodations with local families, all of whom have been thoroughly vetted. Premium packages include the option for residential accommodation."
              },
              {
                question: "What safety measures are in place?",
                answer: "We have 24/7 student support, regular health and safety checks, and dedicated welfare officers. All staff are DBS checked and we maintain strict safeguarding policies."
              }
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

     <GallerySection/>


      {/* Contact Section */}
      <section className="py-20 relative overflow-hidden" id="contact">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black" />
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at center, #4ade80 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            opacity: 0.1
          }} />
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:pr-12"
            >
              <h2 className="text-4xl text-white mb-6">Start Your Journey</h2>
              <p className="text-white/70 mb-8">
                Ready to embark on an unforgettable educational adventure? Get in touch with us today.
              </p>

              <div className="space-y-6">
                {[
                  { icon: <Mail />, text: "info@gla-academy.com" },
                  { icon: <Phone />, text: "+44 (0) 123 456 789" },
                  { icon: <MapPin />, text: "Cambridge, United Kingdom" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-4 text-white/70 group"
                    whileHover={{ x: 10, color: '#4ade80' }}
                  >
                    <span className="text-green-400">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-xl blur-xl"
                animate={{
                  scale: [1, 1.02, 1],
                  rotate: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
              <div className="relative bg-black/50 backdrop-blur-xl rounded-xl p-8 border border-white/10">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['First Name', 'Last Name', 'Email', 'Phone'].map((field, index) => (
                      <motion.div
                        key={field}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <input
                          type={field.includes('Email') ? 'email' : field.includes('Phone') ? 'tel' : 'text'}
                          placeholder={field}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all outline-none"
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.select
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all outline-none"
                  >
                    <option value="" className="bg-black">Who are you?</option>
                    <option value="student" className="bg-black">Student</option>
                    <option value="parent" className="bg-black">Parent</option>
                    <option value="agent" className="bg-black">Agent</option>
                    <option value="school" className="bg-black">School</option>
                  </motion.select>

                  <motion.textarea
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    rows={4}
                    placeholder="Your Message"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all outline-none"
                  />

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-green-400 text-black font-medium rounded-lg hover:bg-green-300 transition-colors relative group overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-white"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative z-10">Send Message</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Enhanced Footer */}
        <footer className="bg-black/90 backdrop-blur-lg border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-4 mb-6">
                <Plane className="w-8 h-8 text-green-400" />
                <span className="text-white text-xl font-light">
                  Global Language Academy
                </span>
              </div>
              <p className="text-white/70 mb-6">
                Transforming lives through immersive language education and cultural exchange.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <MapPin className="w-5 h-5" />, text: "Cambridge, UK" },
                  { icon: <Phone className="w-5 h-5" />, text: "+44 (0) 123 456 789" },
                  { icon: <Mail className="w-5 h-5" />, text: "info@gla-academy.com" }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 text-white/70"
                    whileHover={{ x: 10, color: '#4ade80' }}
                  >
                    <span className="text-green-400">{item.icon}</span>
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="text-white text-lg mb-6">Quick Links</h3>
              <ul className="space-y-4">
                {[
                  'Programs',
                  'About Us',
                  'Student Life',
                  'Admissions',
                  'Contact'
                ].map((link, index) => (
                  <motion.li
                    key={link}
                    whileHover={{ x: 10 }}
                  >
                    <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                      {link}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Resources */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-white text-lg mb-6">Resources</h3>
              <ul className="space-y-4">
                {[
                  'Student Handbook',
                  'Parent Guide',
                  'Accommodation',
                  'Visa Support',
                  'FAQs'
                ].map((link, index) => (
                  <motion.li
                  key={link}
                  whileHover={{ x: 10 }}
                >
                  <a href="#" className="text-white/70 hover:text-green-400 transition-colors">
                    {link}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white text-lg mb-6">Stay Updated</h3>
            <p className="text-white/70 mb-4">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <form className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/50 focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all outline-none"
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-400 rounded-md text-black"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: <Facebook className="w-5 h-5" />, label: 'Facebook' },
                { icon: <Instagram className="w-5 h-5" />, label: 'Instagram' },
                { icon: <Twitter className="w-5 h-5" />, label: 'Twitter' },
                { icon: <Linkedin className="w-5 h-5" />, label: 'LinkedIn' }
              ].map((social, index) => (
                <motion.a
                  key={social.label}
                  href="#"
                  className="p-2 bg-white/5 rounded-lg text-white/70 hover:text-green-400 hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>


        

        {/* Bottom Bar */}
        <motion.div
          className="mt-12 pt-8 border-t border-white/10 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-white/50 text-sm">
              © {new Date().getFullYear()} Global Language Academy. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {[
                'Privacy Policy',
                'Terms of Service',
                'Cookie Policy'
              ].map((link) => (
                <motion.a
                  key={link}
                  href="#"
                  className="text-white/50 text-sm hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
      </main>
    </div>
  );
};


export default HomePage;