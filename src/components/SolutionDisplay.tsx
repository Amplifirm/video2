import React from 'react';
import { Card } from './ui/card';
import { CardContent } from './ui/card';

import { Solution } from '../types/practice';

interface SolutionDisplayProps {
  solution: Solution;
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ solution }) => {
  if (!solution || !solution.solution) {
    return null;
  }

  const { explanation, working, tips } = solution.solution;

  return (
    <Card className="mt-4 bg-yellow-50">
      <CardContent className="p-4">
        <div className="space-y-4">
          {explanation && (
            <div>
              <h4 className="font-medium text-yellow-800">Explanation:</h4>
              <p className="text-yellow-700">{explanation}</p>
            </div>
          )}
          
          {working && (
            <div>
              <h4 className="font-medium text-yellow-800">Working:</h4>
              <pre className="whitespace-pre-wrap text-sm text-yellow-700 font-mono bg-yellow-100 p-2 rounded">
                {working}
              </pre>
            </div>
          )}
          
          {tips && tips.length > 0 && (
            <div>
              <h4 className="font-medium text-yellow-800">Tips:</h4>
              <ul className="list-disc pl-4 text-yellow-700">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SolutionDisplay;