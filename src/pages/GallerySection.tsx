import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Expand, X } from 'lucide-react';

interface GalleryImage {
  src: string;
  title: string;
  category: string;
  size?: 'large' | 'medium' | 'small';
}

const GallerySection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const galleryImages: GalleryImage[] = [
    { 
      src: 'p1.jpg', 
      title: 'Campus Life', 
      category: 'Experience',
      size: 'large'
    },
    { 
      src: 'p2.jpg', 
      title: 'Learning Together', 
      category: 'Classes',
      size: 'medium'
    },
    { 
      src: 'p3.jpg', 
      title: 'Cultural Activities', 
      category: 'Culture',
      size: 'medium'
    },
    { 
      src: 'p4.jpg', 
      title: 'Student Life', 
      category: 'Community',
      size: 'large'
    },
    { 
      src: 'p5.jpg', 
      title: 'Exploration', 
      category: 'Activities',
      size: 'medium'
    },
    { 
      src: 'p6.jpg', 
      title: 'Academic Excellence', 
      category: 'Education',
      size: 'large'
    }
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/5 to-black" />
      </motion.div>

      <div className="max-w-[1400px] mx-auto px-4 relative">
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
            Our Community
          </motion.span>
          <h2 className="text-4xl md:text-5xl text-white mb-4">Life at GLA</h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Experience the vibrant atmosphere and diverse community that makes GLA unique
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-12 gap-4">
          {galleryImages.map((image: GalleryImage, index: number) => {
            const colSpan = image.size === 'large' ? 'col-span-12 md:col-span-8' 
                         : image.size === 'medium' ? 'col-span-12 md:col-span-4' 
                         : 'col-span-12 md:col-span-4';
            
            const height = image.size === 'large' ? 'h-[600px]' 
                        : image.size === 'medium' ? 'h-[400px]' 
                        : 'h-[300px]';

            return (
              <motion.div
                key={index}
                className={`relative group ${colSpan}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`relative ${height} rounded-2xl overflow-hidden`}>
                  {/* Image */}
                  <motion.img
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-700"
                    initial={{ scale: 1.2 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                  />

                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <motion.h3
                        className="text-white text-2xl font-medium mb-2"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        {image.title}
                      </motion.h3>
                      <motion.p
                        className="text-white/70"
                        initial={{ y: 20, opacity: 0 }}
                        whileHover={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {image.category}
                      </motion.p>
                      
                      {/* Expand Button */}
                      <motion.button
                        onClick={() => setSelectedImage(image)}
                        className="absolute top-4 right-4 p-2 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Expand className="w-5 h-5 text-white" />
                      </motion.button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative max-w-7xl w-full"
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  className="w-full h-auto rounded-lg"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-2xl font-medium mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-white/70">{selectedImage.category}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View More Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center justify-center">
              View More Photos
              <motion.span
                className="ml-2"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;