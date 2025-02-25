// src/components/ServicesSection.tsx
import { motion } from 'framer-motion';
import { Play, Edit, Sparkles, Star, Clock, Zap } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: <Edit />,
      title: "Professional Editing",
      description: "Transform raw footage into polished content that captivates your audience",
      color: "from-purple-600 to-purple-400"
    },
    {
      icon: <Star />,
      title: "Motion Graphics",
      description: "Eye-catching animations and effects that bring your videos to life",
      color: "from-yellow-500 to-yellow-300"
    },
    {
      icon: <Clock />,
      title: "Quick Turnaround",
      description: "24-hour delivery for standard projects, rush service available",
      color: "from-purple-500 to-yellow-400"
    }
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124, 58, 237, 0.05) 0%, transparent 25%), radial-gradient(circle at 80% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 25%)',
          }}
        />
        <div className="absolute -left-1/4 top-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute -right-1/4 bottom-1/4 w-1/2 h-1/2 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">What we offer</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            Services that make your content shine
          </h2>
          <p className="text-lg text-gray-600">
            Professional video editing services tailored to your needs. From basic cuts to complex effects, we've got you covered.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <motion.div 
                className="relative z-10 p-8 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/10"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Service Icon */}
                <motion.div 
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6`}
                  whileHover={{ rotate: 5 }}
                >
                  {service.icon}
                </motion.div>

                {/* Service Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                {/* Learn More Link */}
                <motion.a
                  href="#"
                  className="inline-flex items-center text-purple-600 font-medium hover:text-purple-700"
                  whileHover={{ x: 5 }}
                >
                  Learn more 
                  <Zap className="w-4 h-4 ml-2" />
                </motion.a>
              </motion.div>

              {/* Decorative gradient behind each card */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-yellow-100/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.button
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-4 h-4" />
            View Our Work
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;