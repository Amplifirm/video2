import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [logoPhase, setLogoPhase] = useState('hidden');
  const [currentText, setCurrentText] = useState('');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [showButton, setShowButton] = useState(false);
  const [showSkipHint, setShowSkipHint] = useState(false);
  const [showBackground, setShowBackground] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  
  const messages = [
    "Mathematics shapes the way we understand our world.",
    "From simple equations to complex theories.",
    "Your mathematical journey begins here.",
  ];



  // Mathematical elements with more varied positions and sizes
  const mathElements = [
    { symbol: '∫', pos: 'top-20 left-1/4', size: 'text-7xl', rotation: '15deg', delay: 0 },
    { symbol: 'π', pos: 'top-32 right-1/4', size: 'text-6xl', rotation: '-10deg', delay: 0.2 },
    { symbol: '∑', pos: 'bottom-24 left-1/3', size: 'text-8xl', rotation: '5deg', delay: 0.4 },
    { symbol: '∞', pos: 'top-1/3 right-1/4', size: 'text-7xl', rotation: '-5deg', delay: 0.6 },
    { symbol: '√', pos: 'bottom-1/3 left-1/4', size: 'text-6xl', rotation: '8deg', delay: 0.8 },
    { symbol: 'θ', pos: 'bottom-1/4 right-1/3', size: 'text-7xl', rotation: '-8deg', delay: 1 }
  ];

  // Enhanced equations with more mathematical depth
  const equations = [
    { text: 'e = mc²', pos: 'top-1/4 left-20', size: 'text-2xl', delay: 0.3 },
    { text: 'a² + b² = c²', pos: 'bottom-1/4 right-20', size: 'text-2xl', delay: 0.6 },
    { text: 'eiπ + 1 = 0', pos: 'top-1/3 right-24', size: 'text-2xl', delay: 0.9 },
    { text: 'F = ma', pos: 'bottom-1/3 left-16', size: 'text-2xl', delay: 1.2 },
    { text: '∮ E·dl = 0', pos: 'top-1/4 right-16', size: 'text-2xl', delay: 1.5 }
  ];

  const skipAnimation = () => {
    if (isSkipping) return;
    setIsSkipping(true);
    setLogoPhase('visible');
    setShowBackground(true);
    
    // Ensure the last message appears completely
    setTimeout(() => {
      setCurrentMessageIndex(messages.length - 1);
      setCurrentText(messages[messages.length - 1]);
      
      // Show button after the text is displayed
      setTimeout(() => {
        setShowButton(true);
      }, 500);
    }, 300);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !showButton) {
        event.preventDefault();
        skipAnimation();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showButton]);
  
  useEffect(() => {
    if (!isSkipping) {
      setTimeout(() => setShowSkipHint(true), 1000);
      
      setTimeout(() => {
        setLogoPhase('flash');
        setTimeout(() => {
          setLogoPhase('visible');
          setShowBackground(true);
          setCurrentMessageIndex(0);
        }, 1500);
      }, 1000);
    }
  }, [isSkipping]);

  useEffect(() => {
    if (currentMessageIndex >= 0 && currentMessageIndex < messages.length && !isSkipping) {
      const currentMessage = messages[currentMessageIndex];
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= currentMessage.length) {
          setCurrentText(currentMessage.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            if (currentMessageIndex < messages.length - 1) {
              setCurrentMessageIndex(prev => prev + 1);
              setCurrentText('');
            } else {
              setShowButton(true);
            }
          }, 1500);
        }
      }, 50);

      return () => clearInterval(typingInterval);
    }
  }, [currentMessageIndex, isSkipping]);

  return (
    <div className="h-screen bg-white flex items-center justify-center relative overflow-hidden">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--rotation)); }
          50% { transform: translateY(-20px) rotate(calc(var(--rotation) + 2deg)); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0) rotate(var(--rotation)); }
          50% { transform: translateY(-15px) rotate(calc(var(--rotation) - 2deg)); }
        }

        @keyframes fadeFloat {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 0.08; transform: translateY(0); }
        }
        
        .math-element {
          animation: float 6s ease-in-out infinite;
          opacity: 0;
          transition: opacity 1.5s ease-out;
        }

        .equation {
          animation: floatReverse 8s ease-in-out infinite;
          opacity: 0;
          transition: opacity 1.5s ease-out;
        }
        
        .active-math {
          opacity: 0.08;
        }

        .skip-hint {
          animation: fadeInOut 2s infinite;
        }
        
        @keyframes fadeInOut {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }

        .start-button {
          background: linear-gradient(45deg, #000, #222);
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .start-button:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.2);
          background: linear-gradient(45deg, #222, #000);
        }

        .text-container {
          transform-style: preserve-3d;
          perspective: 1000px;
        }

        .text-animation {
          transition: transform 0.5s ease, opacity 0.5s ease;
        }

        .text-animation.entering {
          transform: translateZ(-100px);
          opacity: 0;
        }
      `}</style>

      {/* Floating Math Elements with staggered animations */}
{mathElements.map((element, index) => (
  <div
    key={index}
    className={`math-element absolute ${element.pos} ${element.size} font-serif italic
               ${showBackground ? 'active-math' : ''}`}
    style={{
      animationDelay: `${element.delay}s`,
      '--rotation': element.rotation,
    } as React.CSSProperties & { '--rotation': string }} // Adding type for custom CSS property
  >
    {element.symbol}
  </div>
))}

{/* Floating Equations with staggered animations */}
{equations.map((eq, index) => (
  <div
    key={index}
    className={`equation absolute ${eq.pos} ${eq.size} font-serif italic
               ${showBackground ? 'active-math' : ''}`}
    style={{
      animationDelay: `${eq.delay}s`,
      '--rotation': `${index % 2 ? 5 : -5}deg`,
    } as React.CSSProperties & { '--rotation': string }} // Adding type for custom CSS property
  >
    {eq.text}
  </div>
))}


      <div className="flex flex-col items-center justify-center gap-16 max-w-3xl px-8 z-10">
        {/* Logo */}
        <div
          className={`text-9xl font-bold italic transition-all duration-1000 font-serif`}
          style={{
            opacity: logoPhase === 'hidden' ? 0 : 1,
            transform: logoPhase === 'flash' 
              ? 'scale(1.3) translateY(-10px)' 
              : 'scale(1)',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          x³
        </div>

        {/* Text Container */}
        <div className="h-32 flex items-center justify-center text-container">
          <p className="text-4xl text-center leading-relaxed font-serif text-animation">
            {currentText}
          </p>
        </div>

        {/* Button Container */}
        <div className="h-24 flex items-center justify-center">
          {showButton && (
            <button 
              onClick={() => navigate('/login')}
              className="start-button text-white px-12 py-6 rounded-full text-2xl font-serif">
              Begin Your Journey
            </button>
          )}
        </div>
      </div>

      {/* Skip Hint */}
      {showSkipHint && !showButton && (
        <div className="skip-hint absolute bottom-8 left-1/2 -translate-x-1/2 
                      text-gray-500 text-base font-serif">
          Press Space to Skip
        </div>
      )}
    </div>
  );
};

export default WelcomeScreen;