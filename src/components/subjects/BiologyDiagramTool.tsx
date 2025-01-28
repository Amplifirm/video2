// components/subjects/BiologyDiagramTool.tsx
import React from 'react';
import { EditorProps } from '../../types/practice';

const BiologyDiagramTool: React.FC<EditorProps> = ({
  className
}) => {
  return (
    <div className={`bg-white/5 rounded-xl p-4 ${className}`}>
      <div className="text-gray-400">Biology Diagram Tool Placeholder</div>
    </div>
  );
};

export default BiologyDiagramTool;

