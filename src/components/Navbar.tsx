// src/components/Navbar.tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight } from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Work', href: '#work' },
    { name: 'Services', href: '#services' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <motion.nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-white/80 backdrop-blur-lg border-b border-gray-200/20 shadow-sm' 
            : 'py-6 bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a 
              href="/"
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500"
              whileHover={{ scale: 1.05 }}
            >
              studio
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative text-gray-600 hover:text-gray-900 transition-colors font-medium"
                  whileHover={{ y: -2 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.2 }}
                  />
                </motion.a>
              ))}
            </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              <motion.button
                className="px-6 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-900" />
              ) : (
                <Menu className="w-6 h-6 text-gray-900" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-lg"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <motion.div 
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-yellow-500"
                    >
                      studio
                    </motion.div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg hover:bg-gray-100"
                    >
                      <X className="w-6 h-6 text-gray-900" />
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {navItems.map((item) => (
                      <motion.a
                        key={item.name}
                        href={item.href}
                        className="flex items-center justify-between w-full p-4 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                        whileHover={{ x: 4 }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span className="font-medium">{item.name}</span>
                        <ChevronRight className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="mt-auto p-6 border-t border-gray-100">
                  <motion.button
                    className="w-full py-3 px-6 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;