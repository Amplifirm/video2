import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Facebook, Twitter, Instagram } from 'lucide-react';
import LoadingScreen from './components/LoadingScreen';


const App: React.FC = () => {
  const { scrollY } = useScroll();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  

  // Enhanced parallax effects
  const skyParallax = useTransform(scrollY, [0, 1000], [0, -200]);
  const textParallax = useTransform(scrollY, [0, 500], [0, 100]);
  const pyramidsParallax = useTransform(scrollY, [0, 1000], [0, 50]);
  const contentFade = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Simulate loading delay for smooth entrance
    setTimeout(() => setIsLoaded(true), 500);
  }, []);



  return (
    <div className="relative min-h-screen bg-[#2B1810] overflow-hidden">
      {/* Loading Screen */}
      {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
      
     
      {/* Animated Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-sm bg-black/10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.a 
            href="/"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="flex items-center space-x-2"
          >
            <span className="text-[#E3B04B] text-2xl font-serif">Bastet</span>
            <span className="text-white text-2xl font-light">Experiences</span>
          </motion.a>
          
          <div className="hidden md:flex space-x-12">
            {['Home', 'Explore', 'Videos', 'Guides', 'Blog'].map((item, index) => (
              <motion.a 
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="text-white/80 hover:text-white transition-all duration-300
                  hover:scale-105 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#E3B04B] 
                  group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Layered Hero Section */}
      <div className="relative h-screen">
        {/* Sky Background Layer */}
        <motion.div 
          style={{ y: skyParallax }}
          className="fixed inset-0 z-10"
        >
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1 }}
            src="1.svg" 
            className="w-full h-full object-cover"
            alt="Egyptian sky"
          />
        </motion.div>

        {/* Animated Text Layer */}
        <motion.div 
          style={{ y: textParallax }}
          className="fixed inset-0 z-20 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-center relative"
          >
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-white text-4xl mb-4 font-light tracking-wide"
            >
              Discover
            </motion.p>
            <h1 className="text-[20vw] font-['Anton'] text-[#E3B04B] tracking-[0.2em] leading-none
              drop-shadow-[0_0_30px_rgba(227,176,75,0.3)] relative group">
              <motion.span
                className="absolute -inset-x-8 -inset-y-4 z-0 hidden group-hover:block"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#E3B04B]/0 via-[#E3B04B]/10 to-[#E3B04B]/0
                  animate-shine" />
              </motion.span>
              EGYPT
            </h1>
          </motion.div>
        </motion.div>

        {/* Pyramids Foreground Layer */}
        <motion.div 
          style={{ y: pyramidsParallax }}
          className="fixed inset-0 z-30"
        >
          <motion.img 
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            src="2.svg"
            className="w-full h-full object-cover"
            alt="Egyptian pyramids"
          />
        </motion.div>

        {/* Interactive Content */}
        <motion.div 
          style={{ opacity: contentFade }}
          className="fixed bottom-12 left-0 right-0 px-8 z-40"
        >
          <div className="max-w-7xl mx-auto flex justify-between items-end">
            {/* Enhanced Book Trip Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="bg-black/20 backdrop-blur-md border border-[#E3B04B]/30 
                p-6 rounded-lg max-w-sm group hover:bg-black/30 transition-all duration-300"
            >
              <div className="flex items-center mb-2">
                <span className="text-[#E3B04B] text-4xl font-light mr-3">01</span>
                <h3 className="text-[#E3B04B] text-xl">Begin Your Journey</h3>
              </div>
              <p className="text-white/80 mb-4">
                Embark on an extraordinary adventure through the land of pharaohs. 
                Experience the majesty of ancient Egypt with our curated tours.
              </p>
              <motion.button 
                whileHover={{ x: 10 }}
                className="group flex items-center text-white"
              >
                <span>Explore Tours</span>
                <span className="ml-2 text-[#E3B04B] transition-transform duration-300 
                  group-hover:translate-x-2">
                  →
                </span>
              </motion.button>
            </motion.div>

            {/* About Egypt Preview */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.4 }}
              className="bg-black/20 backdrop-blur-md rounded-lg overflow-hidden
                hover:bg-black/30 transition-all duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img 
                  src="sphinx.jpg" 
                  alt="Great Sphinx of Giza"
                  className="w-64 h-36 object-cover transition-transform duration-500
                    group-hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-white font-semibold">ABOUT EGYPT</h3>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Animated Social Links */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col space-y-6">
          {[Facebook, Twitter, Instagram].map((Icon, index) => (
            <motion.a
              key={index}
              href="#"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.6 + index * 0.1 }}
              whileHover={{ scale: 1.2, x: -5 }}
              className="text-white/70 hover:text-[#E3B04B] transition-colors duration-300"
            >
              <Icon size={20} />
            </motion.a>
          ))}
        </div>

        {/* Copyright */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-4 left-0 right-0 text-center text-white/50 text-sm z-50"
        >
          © 2025 Bastet Experiences. All rights reserved.
        </motion.div>
      </div>
    </div>
  );
};

export default App;