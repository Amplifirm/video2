// src/components/ParallaxContainer.tsx
import React, { useEffect, useState, ReactElement } from 'react';
import { ParallaxLayerProps } from '../types';

interface ParallaxContainerProps {
  children: ReactElement<ParallaxLayerProps> | ReactElement<ParallaxLayerProps>[];
  className?: string;
}

const ParallaxContainer: React.FC<ParallaxContainerProps> = ({ 
  children, 
  className = "" 
}) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const childrenWithProps = React.Children.map(children, child => {
    if (React.isValidElement<ParallaxLayerProps>(child)) {
      return React.cloneElement(child, {
        ...child.props,
        translateY: scrollY * child.props.depth
      });
    }
    return child;
  });

  return (
    <div className={`relative min-h-screen overflow-hidden ${className}`}>
      {childrenWithProps}
    </div>
  );
};

export default ParallaxContainer;