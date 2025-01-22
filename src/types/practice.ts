// src/types/practice.ts

export interface UserProfile {
    id: string;
    username?: string;
    age?: number;
    math_course: string;
    school?: string;
    recentPerformance?: string;
    preferredTopics?: string[];
    skillLevel?: number;
    avatar_url?: string;
    created_at?: string;
    updated_at?: string;
  }
  
  export interface QuestionDetails {
    topic: string;
    subtopic: string;
    difficulty: string;
    expectedSteps: string[];
    examStyle: string;
  }
  
  export interface Question {
    content: string;
    details: QuestionDetails;
  }
  
  export interface StepCheck {
    isCorrect: boolean;
    feedback?: string;
    canContinue: boolean;
    skippedSteps?: number;
    attemptsLeft?: number;
    showStepAvailable?: boolean;
  }
  
  export interface StepExplanation {
    hint?: string;
    conceptExplanation?: string;
    prerequisites?: string[];
    commonMistakes?: string[];
    additionalExamples?: string[];
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
  
  export interface Solution {
    solution: {
      explanation: string;
      working: string;
      tips: string[];
    };
  }
  
  export interface ClaudeSolutionResponse {
    solution?: Solution;
    error?: string;
  }

  