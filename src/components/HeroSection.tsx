import { useEffect, useState } from 'react';

const HeroSection = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Sky Background Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/SKY.svg')`, // Replace with sky image
          transform: `translateY(${scrollY * 0.1}px)`,
        }}
      />

      {/* DISCOVER Text Layer */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      >
        <h1 className="text-[20vw] font-['Anton'] text-white opacity-20 select-none leading-none">
          DISCOVER
        </h1>
      </div>

      {/* EGYPT Text Layer */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <h2 className="text-[15vw] font-['Anton'] text-white select-none leading-none mt-32">
          EGYPT
        </h2>
      </div>

      {/* Pyramids Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-bottom"
        style={{
          backgroundImage: `url('/NONSKY.svg')`, // Replace with isolated pyramids
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      {/* Subtle shadow overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

      {/* Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded transition-all">
          Explore
        </button>
        <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm rounded transition-all">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default HeroSection;