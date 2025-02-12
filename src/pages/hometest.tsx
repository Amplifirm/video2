import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Book, Users, Clock, Award, ChevronDown, Menu, X,
  Phone, Mail, MapPin, Facebook, Instagram, Linkedin,
  Globe, Calendar, Shield
} from 'lucide-react';

const HomeTestPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black">
      {/* Background Grid */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[#010101]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, #4ade80 1px, transparent 1px), linear-gradient(to bottom, #4ade80 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(circle at 50% 50%, black, transparent)'
          }} />
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="/" className="flex items-center space-x-4">
              <span className="font-poppins text-white text-xl font-light">
                Global Language Academy
              </span>
            </a>

            <div className="hidden md:flex space-x-8">
              {['Programs', 'Student Life', 'About Us', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="font-poppins text-white/90 text-sm hover:text-green-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            <button className="hidden md:block px-6 py-2 bg-green-400 text-black font-poppins font-medium rounded-lg hover:bg-green-300 transition-colors">
              Start Your Journey
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg">
            <div className="px-4 pt-2 pb-6 space-y-3">
              {['Programs', 'Student Life', 'About Us', 'Contact'].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="block px-4 py-3 text-base text-white/90 hover:text-green-400 font-poppins hover:bg-white/5 rounded-lg transition-colors"
                >
                  {item}
                </a>
              ))}
              <button className="w-full px-4 py-3 bg-green-400 text-black font-poppins font-medium rounded-lg hover:bg-green-300 transition-colors">
                Start Your Journey
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Hero Text */}
          <div className="text-center mb-20">
            <h1 className="font-poppins text-5xl md:text-7xl font-light text-white mb-8 leading-tight">
              Learn the language
              <br />
              <span className="text-green-400">Live the culture</span>
              <br />
              Love the journey
            </h1>

            <p className="font-poppins text-xl text-white/80 max-w-2xl mx-auto mb-12">
              Your Ultimate Two-Week English Summer Experience in the UK 
              for students aged 11-17!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-green-400 rounded-lg text-black font-poppins font-medium hover:bg-green-300 transition-colors">
                Explore Programs
              </button>
              <button className="px-8 py-4 border border-white/20 text-white rounded-lg font-poppins hover:bg-white/5 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Book className="w-8 h-8" />,
                title: "Expert Teachers",
                description: "Learn from qualified language professionals with years of experience"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Small Classes",
                description: "Maximum 15 students per class for personalized attention"
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "Flexible Schedule",
                description: "Programs that fit your timeline with multiple start dates"
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Certification",
                description: "Internationally recognized qualifications and certificates"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:border-green-400/50 transition-colors">
                <div className="text-green-400 mb-4">{feature.icon}</div>
                <h3 className="font-poppins text-white text-lg font-medium mb-2">{feature.title}</h3>
                <p className="font-poppins text-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program Details Section */}
      <section className="bg-black/95 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-poppins text-white text-center mb-12">
            Program Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Calendar className="w-5 h-5" />,
                title: "Program Information",
                items: [
                  "Two-week intensive program",
                  "Ages 11-17 welcome",
                  "20 lessons (14.7 hrs) per week",
                  "Maximum 15 students per class"
                ]
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "Safety & Support",
                items: [
                  "Dedicated welfare officer",
                  "24/7 emergency support",
                  "Secure campus environment",
                  "Regular health & safety checks"
                ]
              },
              {
                icon: <Globe className="w-5 h-5" />,
                title: "Cultural Activities",
                items: [
                  "Historical landmark visits",
                  "Interactive workshops",
                  "Sports and team activities",
                  "Cultural exchange events"
                ]
              }
            ].map((section, index) => (
              <div key={index} className="p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-xl font-poppins text-white mb-4 flex items-center">
                  <span className="text-green-400 mr-2">{section.icon}</span>
                  {section.title}
                </h3>
                <ul className="space-y-3 text-white/70">
                  {section.items.map((item, i) => (
                    <li key={i}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-poppins text-white text-center mb-12">
            Why Choose GLA?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { issue: "Large Class Sizes", solution: "We maintain small, focused groups" },
              { issue: "Unfulfilled Promises", solution: "We deliver on every commitment" },
              { issue: "Poor Teaching Quality", solution: "Expert native teachers only" },
              { issue: "Management Issues", solution: "Professional, responsive staff" },
              { issue: "Boring Activities", solution: "Engaging, varied programs" },
              { issue: "Limited Cultural Mix", solution: "Diverse international community" }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors"
              >
                <h3 className="text-red-400 font-poppins mb-2">{item.issue}</h3>
                <p className="text-green-400 font-poppins">{item.solution}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/95 text-white/70 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h4 className="font-poppins text-white text-lg mb-4">
                Global Language Academy
              </h4>
              <address className="not-italic">
                <div className="flex items-center mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  GLA, St. James Center Road
                  <br />Cambridge, United Kingdom
                </div>
                <div className="flex items-center mb-2">
                  <Phone className="w-4 h-4 mr-2" />
                  +44 (0) 123 456 789
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  info@gla-academy.com
                </div>
              </address>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-poppins text-white text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {['Summer Programs', 'About Us', 'Contact', 'Partner with Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-green-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h4 className="font-poppins text-white text-lg mb-4">Policies</h4>
              <ul className="space-y-2">
                {['Privacy Policy', 'Terms & Conditions', 'Safeguarding Policy', 'Student Welfare'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-green-400 transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-poppins text-white text-lg mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-4">
                {[
                  { icon: <Facebook className="w-6 h-6" />, label: 'Facebook' },
                  { icon: <Instagram className="w-6 h-6" />, label: 'Instagram' },
                  { icon: <Linkedin className="w-6 h-6" />, label: 'LinkedIn' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href="#"
                    className="hover:text-green-400 transition-colors"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
              <p className="text-sm">
                Follow us on social media for updates, student stories, and glimpses into life at GLA.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Global Language Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeTestPage;