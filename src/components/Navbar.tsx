import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Plane, Menu, X, ChevronRight, Globe, Sparkles, Book, Users } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  highlight?: boolean;
  subItems?: {
    name: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }[];
}

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  const navItems: NavItem[] = [
    {
      name: 'Programs',
      href: '#programs',
      icon: <Book className="w-4 h-4" />,
      highlight: true,
      subItems: [
        {
          name: 'Summer Intensive',
          href: '#summer',
          description: 'Accelerated learning in an immersive environment',
          icon: <Sparkles className="w-4 h-4" />
        },
        {
          name: 'Cultural Exchange',
          href: '#cultural',
          description: 'Experience British culture while learning',
          icon: <Globe className="w-4 h-4" />
        },
        {
          name: 'Group Classes',
          href: '#group',
          description: 'Learn together in small, focused groups',
          icon: <Users className="w-4 h-4" />
        }
      ]
    },
    {
      name: 'About',
      href: '#about',
      icon: <Globe className="w-4 h-4" />
    },
    {
      name: 'Experience',
      href: '#experience',
      icon: <Sparkles className="w-4 h-4" />
    }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
            : 'bg-transparent'
        }`}
      >
        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-[1px] bg-gradient-to-r from-green-400/0 via-green-400 to-green-400/0"
          style={{
            width: scrollY
          }}
        />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a 
              href="/"
              className="flex items-center space-x-4 group"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <motion.div
                  className="relative z-10 p-2 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.7 }}
                >
                  <Plane className="w-6 h-6 text-green-400" />
                </motion.div>
                <motion.div
                  className="absolute inset-0 bg-green-400/20 rounded-xl blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-light group-hover:text-green-400 transition-colors">
                  Global Language Academy
                </span>
                <span className="text-white/50 text-xs">Experience Excellence</span>
              </div>
            </motion.a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <div 
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <motion.a
                    href={item.href}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 relative group ${
                      item.highlight ? 'text-green-400' : 'text-white/90'
                    }`}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  >
                    {item.icon && (
                      <motion.span
                        initial={{ y: 0 }}
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {item.icon}
                      </motion.span>
                    )}
                    <span>{item.name}</span>
                    {item.subItems && (
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === item.name ? 'rotate-90' : ''
                      }`} />
                    )}
                    
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-400"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.a>

                  {/* Mega Dropdown */}
                  {item.subItems && activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 pt-4 w-80"
                    >
                      <div className="bg-black/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl shadow-black/20 overflow-hidden">
                        <div className="p-4">
                          {item.subItems.map((subItem, index) => (
                            <motion.a
                              key={subItem.name}
                              href={subItem.href}
                              className="block p-3 rounded-lg hover:bg-white/5 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-white/5 rounded-lg">
                                  {subItem.icon}
                                </div>
                                <div>
                                  <div className="text-white font-medium">
                                    {subItem.name}
                                  </div>
                                  {subItem.description && (
                                    <div className="text-white/50 text-sm">
                                      {subItem.description}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Contact Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="ml-4 px-6 py-2 rounded-lg relative group overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500"
                  initial={{ x: '100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.2, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-300">
                  Contact Us
                </span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10"
            >
              <div className="bg-black/95 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <a
                        href={item.href}
                        className="flex items-center space-x-2 text-lg text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.icon && <span className="text-green-400">{item.icon}</span>}
                        <span>{item.name}</span>
                      </a>
                      
                      {item.subItems && (
                        <div className="pl-6 space-y-2">
                          {item.subItems.map((subItem, subIndex) => (
                            <motion.a
                              key={subItem.name}
                              href={subItem.href}
                              className="block p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (index * 0.1) + ((subIndex + 1) * 0.05) }}
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-2">
                                {subItem.icon && <span className="text-green-400">{subItem.icon}</span>}
                                <span>{subItem.name}</span>
                              </div>
                              {subItem.description && (
                                <span className="block text-sm text-white/50 mt-1">
                                  {subItem.description}
                                </span>
                              )}
                            </motion.a>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navItems.length * 0.1 + 0.2 }}
                    className="w-full p-4 bg-gradient-to-r from-green-400 to-emerald-500 text-black font-medium rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Backdrop */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;