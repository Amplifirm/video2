import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  X,
  Sparkles,
  Star,
  Brain,
  Zap,
  Crown,
  Users,
  Bot,
  Target,
  ArrowRight
} from 'lucide-react';
import ComingSoonModal from '../components/ComingSoonModal';

interface PricingFeature {
  name: string;
  free: boolean | string;
  pro: boolean | string;
  icon: React.FC<{ className?: string }>;
  description?: string;
}

const PricingSection: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredPlan, setHoveredPlan] = useState<'free' | 'pro' | null>(null);

  const pricingFeatures: PricingFeature[] = [
    {
      name: "Daily Practice Questions",
      free: "5/day",
      pro: "Unlimited",
      icon: Target,
      description: "Access to our library of IB-aligned practice questions"
    },
    {
      name: "AI-Powered Learning",
      free: "Basic",
      pro: "Advanced",
      icon: Brain,
      description: "Personalized learning paths and adaptive difficulty"
    },
    {
      name: "Subject Access",
      free: "1 Subject",
      pro: "All Subjects",
      icon: Bot,
      description: "Access to different IB subjects and topics"
    },
    {
      name: "Performance Analytics",
      free: "Basic",
      pro: true,
      icon: Zap,
      description: "Track your progress and identify areas for improvement"
    },
    {
      name: "Study Groups",
      free: "Limited",
      pro: true,
      icon: Users,
      description: "Collaborate with other IB students"
    },
    {
      name: "24/7 Support",
      free: false,
      pro: true,
      icon: Crown,
      description: "Priority support and assistance"
    }
  ];

  return (
    <div className="py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] 
                     bg-[size:24px_24px]" />
        
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 -right-48 w-96 h-96 bg-blue-500/30 rounded-full 
                   blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-48 -left-48 w-96 h-96 bg-indigo-500/30 
                   rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-6 mb-16"
        >
          {/* Icon */}
          <div className="relative mx-auto w-24 h-24">
            {/* Rotating rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-2 border-blue-500/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-2 border-indigo-500/20"
            />
            {/* Center Icon */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-4 rounded-xl bg-gradient-to-r from-blue-500 
                       to-indigo-500 flex items-center justify-center"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Title */}
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 
                         bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Start for free, upgrade when you're ready
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 pt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors 
                       ${isAnnual ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            >
              Annual
              <span className="ml-2 text-xs text-green-400">Save 20%</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-colors 
                       ${!isAnnual ? 'bg-white/10 text-white' : 'text-gray-400'}`}
            >
              Monthly
            </motion.button>
          </div>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Free Plan */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredPlan('free')}
            onHoverEnd={() => setHoveredPlan(null)}
            className={`relative p-8 rounded-2xl border border-white/10 
                     ${hoveredPlan === 'free' ? 'bg-[#1e293b]/70' : 'bg-[#1e293b]/40'} 
                     backdrop-blur-xl transition-colors duration-300`}
          >
            <div className="space-y-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">Free</h3>
                  <p className="text-gray-400">Perfect for getting started</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-gray-500 
                           to-gray-600 flex items-center justify-center"
                >
                  <Zap className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">$0</span>
                <span className="text-gray-400">/forever</span>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {pricingFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`mt-1 ${
                      feature.free ? 'text-green-400' : 'text-gray-500'
                    }`}>
                      {feature.free ? (
                        typeof feature.free === 'string' ? (
                          <div className="flex items-center gap-2">
                            <Check className="w-5 h-5" />
                            <span className="text-sm text-gray-400">
                              {feature.free}
                            </span>
                          </div>
                        ) : (
                          <Check className="w-5 h-5" />
                        )
                      ) : (
                        <X className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-300">{feature.name}</div>
                      {feature.description && (
                        <div className="text-sm text-gray-500">
                          {feature.description}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 rounded-xl bg-white/5 text-white 
                         hover:bg-white/10 transition-colors"
              >
                Start Free
              </motion.button>
            </div>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onHoverStart={() => setHoveredPlan('pro')}
            onHoverEnd={() => setHoveredPlan(null)}
            className={`relative p-8 rounded-2xl border-2 border-blue-500/20 
                     ${hoveredPlan === 'pro' ? 'bg-[#1e293b]/80' : 'bg-[#1e293b]/60'} 
                     backdrop-blur-xl transition-colors duration-300`}
          >
            {/* Recommended Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 
                         to-indigo-500 text-white text-sm font-medium"
              >
                Recommended
              </motion.div>
            </div>

            <div className="space-y-6">
              {/* Plan Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold text-white">Pro</h3>
                  <p className="text-gray-400">For serious IB students</p>
                </div>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 
                           to-indigo-500 flex items-center justify-center"
                >
                  <Crown className="w-6 h-6 text-white" />
                </motion.div>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold text-white">
                  ${isAnnual ? '7.99' : '9.99'}
                </span>
                <span className="text-gray-400">/month</span>
                {isAnnual && (
                  <span className="ml-2 px-2 py-1 rounded-full bg-green-500/20 
                               text-green-400 text-sm">
                    Save 20%
                  </span>
                )}
              </div>

              {/* Features */}
              <div className="space-y-4">
                {pricingFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1 text-green-400">
                      {typeof feature.pro === 'string' ? (
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5" />
                          <span className="text-sm text-gray-400">
                            {feature.pro}
                          </span>
                        </div>
                      ) : (
                        <Check className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-gray-300">{feature.name}</div>
                      {feature.description && (
                        <div className="text-sm text-gray-500">
                          {feature.description}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* CTA Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModalOpen(true)}
                className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 
                         to-indigo-500 text-white font-medium flex items-center 
                         justify-center gap-2 group"
              >
                Get Started
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </div>

            {/* Animated border glow */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 
                       to-indigo-500/20 -z-10 blur"
            />
          </motion.div>
        </div>

        {/* Compare Features Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex gap-8 items-center text-gray-400">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-5 h-5 text-yellow-500" />
            </motion.div>
            <span>
              Start with our free plan, upgrade anytime
            </span>
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-5 h-5 text-yellow-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {[
              {
                question: "Can I switch plans anytime?",
                answer: "Yes! You can upgrade to Pro or cancel your subscription at any time."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards and debit cards."
              },
              {
                question: "Is there a student discount?",
                answer: "Yes, we offer special pricing for school groups. Contact us for details."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl bg-[#1e293b]/40 border border-white/10 
                         hover:bg-[#1e293b]/60 transition-colors"
              >
                <h4 className="text-lg font-medium text-white mb-2">{faq.question}</h4>
                <p className="text-gray-400">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Coming Soon Modal */}
      <ComingSoonModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default PricingSection;