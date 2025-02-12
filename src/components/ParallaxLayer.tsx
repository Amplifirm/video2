// src/components/ParallaxLayer.tsx
import React from 'react';
import { ParallaxLayerProps } from '../types';

const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ 
  children, 
  depth,
  translateY = 0,
  className = "" 
}) => {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{ transform: `translateY(${translateY}px)` }}
      data-depth={depth}
    >
      {children}
    </div>
  );
};

export default ParallaxLayer;