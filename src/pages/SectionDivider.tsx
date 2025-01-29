

import { motion } from 'framer-motion';

const SectionDivider = ({ from = "from-blue-500", to = "to-indigo-500" }) => {
    return (
      <div className="relative py-24">
        {/* Animated line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute left-0 right-0 h-px bg-gradient-to-r ${from} ${to}`}
        />
        
        {/* Center decoration */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-12 h-12 rounded-full bg-gradient-to-r ${from} ${to} 
                     flex items-center justify-center`}
        >
          <span className="font-serif text-xl italic font-bold text-white">x³</span>
        </motion.div>
        
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-transparent to-[#0f172a]" />
      </div>
    );
  };
  
  export default SectionDivider;