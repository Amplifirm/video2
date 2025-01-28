// src/components/SolutionDisplay.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Latex from 'react-latex-next';
import { Solution } from '../types/practice';

interface SolutionDisplayProps {
  solution: Solution;
  useLatex?: boolean;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ 
  solution, 
  useLatex = false 
}) => {
  const renderText = (text: string) => {
    return useLatex ? <Latex>{text}</Latex> : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {solution.solution.explanation && (
        <div className="space-y-2">
          <h4 className="font-medium text-amber-800">Explanation:</h4>
          <div className="text-amber-700">
            {renderText(solution.solution.explanation)}
          </div>
        </div>
      )}
      
      {solution.solution.working && (
        <div className="space-y-2">
          <h4 className="font-medium text-amber-800">Working:</h4>
          <pre className="whitespace-pre-wrap text-sm text-amber-700 
                       font-mono bg-amber-50 p-4 rounded-lg">
            {renderText(solution.solution.working)}
          </pre>
        </div>
      )}
      
      {solution.solution.tips && solution.solution.tips.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-amber-800">Tips:</h4>
          <ul className="list-disc pl-4 text-amber-700 space-y-1">
            {solution.solution.tips.map((tip, index) => (
              <li key={index}>{renderText(tip)}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default SolutionDisplay;