// src/types/index.ts
import { ReactNode } from 'react';

export interface ParallaxLayerProps {
  children: ReactNode;
  depth: number;
  className?: string;
  translateY?: number;
}