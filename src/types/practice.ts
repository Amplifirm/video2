// src/types/practice.ts

export interface UserProfile {
  id: string;
  first_name: string;
  subject: string;  // The current subject being practiced
  course: string;   // The specific course level (e.g., 'IB Economics HL')
  math_course?: string; // Keep for backward compatibility
  skillLevel?: number;
}
  
  export interface QuestionDetails {
    topic: string;
    subtopic: string;
    difficulty: string;
    expectedSteps: string[];
    examStyle: string;
  }
  

  
  export interface SolutionExplanation {
    step1?: string;
    step2?: string;
    step3?: string;
  }
  
  
  export interface ClaudeQuestionResponse {
    question?: string;
    details?: QuestionDetails;
    error?: string;
  }
  
  export interface ClaudeAnswerResponse {
    stepCheck?: StepCheck;
    explanation?: StepExplanation;
    solution?: Solution;
    error?: string;
  }
  
 
  
  export function isSimpleSolution(solution: DetailedSolution | SimpleSolution): solution is SimpleSolution {
    return 'explanation' in solution && 'working' in solution && 'tips' in solution;
  }
  
  export function isDetailedSolution(solution: DetailedSolution | SimpleSolution): solution is DetailedSolution {
    return 'step1' in solution || 'explanation' in solution;
  }


  export interface StepSolution {
    description?: string;
    working?: string;
    formula?: string;
    result?: string;
  }
  
  export interface DetailedSolution {
    step1?: StepSolution;
    step2?: StepSolution;
    step3?: StepSolution;
    explanation?: {
      step1?: string;
      step2?: string;
      step3?: string;
    };
    tips?: string[];
    notes?: string[];
  }
  
  export interface SimpleSolution {
    explanation: string;
    working: string;
    tips: string[];
  }
  

  
  export interface ClaudeSolutionResponse {
    solution?: Solution;
    error?: string;
  }

  // types/practice.ts

export interface Question {
  content: string;
  details: {
    topic: string;
    subtopic: string;
    difficulty: string;
    examStyle: string;
    expectedSteps: string[];
    subjectSpecific?: {
      formulasNeeded?: string[];
      calculatorRequired?: boolean;
      diagramRequired?: boolean;
      diagram?: string;
      graphsRequired?: boolean;
      graphReference?: string;
      programmingLanguage?: string;
      wordLimit?: number;
    };
  };
}

export interface StepCheck {
  isCorrect: boolean;
  feedback: string;
  canContinue: boolean;
  skippedSteps?: number;
  conceptualUnderstanding: 'Strong' | 'Moderate' | 'Weak';
  nextQuestionDifficulty?: number;
  performance?: {
    accuracy: string;
    streak: number;
    level: number;
  };
}

export interface Solution {
  solution: {
    explanation: string;
    working: string;
    tips: string[];
  };
}

export interface StepExplanation {
  hint: string;
  conceptExplanation: string;
  prerequisites: string[];
  commonMistakes: string[];
  nextSteps: string[];
  subjectSpecific?: Record<string, any>;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  graphRequired?: boolean;
  language?: string;
  subjectSpecific?: Record<string, any>;
}