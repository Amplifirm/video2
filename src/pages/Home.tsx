import { useState, useEffect } from 'react';
import StepsSection from './StepsSection';
import Navbar from '../components/Navbar';
import HeroSection from './HeroSection';
import PricingSection from './PricingSection';
import FeaturesSection from './FeaturesSection';
import SubjectsSection from './SubjectsSection';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const options = {
      threshold: 0.3,
      rootMargin: '-80px 0px 0px 0px' // Accounts for navbar height
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => observer.observe(section));

    return () => {
      sections.forEach(section => observer.unobserve(section));
    };
  }, []);

  const scrollToSection = (sectionId: string): void => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const navConfig = {
    activeSection,
    scrollToSection,
    links: [
      { label: 'Features', sectionId: 'features' },
      { label: 'How It Works', sectionId: 'steps' },
      { label: 'Subjects', sectionId: 'subjects' },
      { label: 'Pricing', sectionId: 'pricing' }
    ]
  };

  return (
    <div className="min-h-screen bg-[#0f172a] overflow-hidden">
      <Navbar {...navConfig} />
      
      {/* Hero Section */}
      <section id="hero" className="scroll-mt-20">
        <HeroSection />
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20">
        <FeaturesSection />
      </section>

      {/* Steps Section */}
      <section id="steps" className="scroll-mt-20">
        <StepsSection />
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="scroll-mt-20">
        <SubjectsSection />
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="scroll-mt-20">
        <PricingSection />
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#1e293b]/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
                <span className="font-serif text-lg italic font-bold text-white">x³</span>
              </div>
              <p className="text-gray-400">
                Empowering IB students with AI-powered learning tools
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">
                    Features
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('subjects')} className="hover:text-white transition-colors">
                    Subjects
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('pricing')} className="hover:text-white transition-colors">
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/about" className="hover:text-white transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/careers" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="/help" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="/terms" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} IB Practice. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;