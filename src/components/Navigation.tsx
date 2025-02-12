// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';

const Navigation: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-40 transition-transform duration-1000
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}
    >
      <div className="bg-stone-800/90 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <ul className="flex justify-center space-x-8 py-4">
            {['Home', 'Timeline', 'Monuments', 'Gallery', 'Contact'].map((item) => (
              <li key={item}>
                <a 
                  href={`#${item.toLowerCase()}`}
                  className="text-papyrus-tan hover:text-gold-600 transition-colors
                    relative overflow-hidden group"
                >
                  <span className="relative z-10">{item}</span>
                  <span 
                    className="absolute inset-0 bg-gradient-to-r from-gold-600/20 
                      to-gold-600/0 -translate-x-full group-hover:translate-x-0 
                      transition-transform duration-300"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;