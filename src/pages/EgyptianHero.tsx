import  { useState, useEffect } from 'react';

const EgyptianHero = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden bg-gradient-to-b from-orange-400 to-blue-900">
      {/* Sky with stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Moon */}
      <div 
        className="absolute w-24 h-24 bg-yellow-100 rounded-full blur-sm"
        style={{
          right: '10%',
          top: '10%',
          transform: `translateY(${scrollPosition * 0.2}px)`,
        }}
      />

      {/* Pyramids */}
      <div 
        className="absolute bottom-0 w-0 h-0 border-transparent"
        style={{
          left: '20%',
          borderLeft: '200px solid transparent',
          borderRight: '200px solid transparent',
          borderBottom: '300px solid #8B4513',
          transform: `translateY(${scrollPosition * 0.1}px)`,
        }}
      />

      <div 
        className="absolute bottom-0 w-0 h-0 border-transparent"
        style={{
          left: '50%',
          borderLeft: '250px solid transparent',
          borderRight: '250px solid transparent',
          borderBottom: '400px solid #A0522D',
          transform: `translateY(${scrollPosition * 0.15}px)`,
        }}
      />

      {/* Desert ground */}
      <div 
        className="absolute bottom-0 w-full h-1/4 bg-yellow-600"
        style={{
          transform: `translateY(${scrollPosition * 0.05}px)`,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl font-bold text-white text-center">
          Discover Ancient Egypt
        </h1>
      </div>
    </div>
  );
};

export default EgyptianHero;