// components/subjects/GraphDrawing.tsx
import React from 'react';
import { EditorProps } from '../../types/practice';

const GraphDrawing: React.FC<EditorProps> = ({
  className
}) => {
  return (
    <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
      <div className="text-gray-400">Graph Drawing Tool Placeholder</div>
    </div>
  );
};

export default GraphDrawing;

