import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";


const ComingSoonModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
  
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 
                       w-full max-w-lg"
            >
              <div className="relative mx-4 p-8 rounded-2xl bg-[#1e293b] border border-white/10 
                           overflow-hidden">
                {/* Background elements */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-indigo-500/10" />
                <div className="absolute inset-0">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0.2, 0.5, 0.2],
                        scale: [1, 1.5, 1],
                        x: [Math.random() * 100, Math.random() * -100],
                        y: [Math.random() * 100, Math.random() * -100],
                      }}
                      transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                      }}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
  
                {/* Content */}
                <div className="relative">
                  {/* Header */}
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 360, 0]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 
                               mx-auto flex items-center justify-center mb-4"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-2">Coming Soon!</h3>
                    <p className="text-gray-400">
                      We're working hard to bring you the full Pro experience. 
                      Join our waitlist to be first in line!
                    </p>
                  </motion.div>
  
                  {/* Email Input */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="relative max-w-sm mx-auto mb-6"
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 
                               text-white placeholder:text-gray-500 focus:outline-none 
                               focus:ring-2 focus:ring-blue-500/50"
                    />
                    <div className="absolute inset-px rounded-[11px] bg-gradient-to-r from-blue-500/20 
                                 to-indigo-500/20 opacity-0 focus-within:opacity-100 transition-opacity" />
                  </motion.div>
  
                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 
                               to-indigo-500 text-white font-medium"
                      onClick={() => {
                        // Handle waitlist signup
                      }}
                    >
                      Join Waitlist
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onClose}
                      className="px-6 py-3 rounded-xl bg-white/5 text-white font-medium 
                               hover:bg-white/10 transition-colors"
                    >
                      Maybe Later
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  };
  
  export default ComingSoonModal;