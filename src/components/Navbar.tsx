import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection, scrollToSection }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: "Features", sectionId: "features" },
    { label: "How It Works", sectionId: "steps" },
    { label: "Subjects", sectionId: "subjects" },
    { label: "Pricing", sectionId: "pricing" }
  ];

  return (
    <div className="w-full px-6 py-6 fixed top-0 left-0 z-50">
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-7xl mx-auto rounded-2xl border border-white/10 
                   ${isScrolled ? 'bg-[#0f172a]/80' : 'bg-[#0f172a]/50'} 
                   backdrop-blur-xl transition-all duration-500`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('hero')}
              className="relative group"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500
                           flex items-center justify-center relative"
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 
                             opacity-40 blur-xl group-hover:opacity-60"
                  />
                  <span className="font-serif text-lg italic font-bold text-white relative">x³</span>
                </motion.div>
                <span className="text-xl font-bold text-white">IB Practice</span>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-1 gap-8">
              {navItems.map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="text-gray-300 hover:text-white transition-colors relative group"
                >
                  {item.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r 
                             from-blue-500 to-indigo-500 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeSection === item.sectionId ? 1 : 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/login')}
              className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-xl 
                        bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium"
            >
              Start Free
              <ExternalLink className="w-4 h-4" />
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-white" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <motion.button
                    key={item.label}
                    onClick={() => {
                      scrollToSection(item.sectionId);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === item.sectionId 
                        ? 'bg-white/10 text-white' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/login')}
                  className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 
                           to-indigo-500 text-white font-medium flex items-center 
                           justify-center gap-2 mt-4"
                >
                  Start Free
                  <ExternalLink className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
};

export default Navbar;