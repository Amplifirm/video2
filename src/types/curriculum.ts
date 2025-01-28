// src/types/curriculum.ts
export interface SubjectTheme {
    name: string;
    icon: React.FC<{ className?: string }>;
    color: string;
    themeColor: string;
    accentColor: string;
  }
  
  export interface Subtopic {
    name: string;
    content: string[];
    difficulty: number;
  }
  
  export interface Topic {
    name: string;
    hours: {
      sl: number;
      hl: number;
    };
    description: string;
    subtopics: Subtopic[];
    progress: number;
  }
  
  export interface ExamDetails {
    paper1: {
      duration: number;
      questions: string;
      calculator: boolean;
      weight: number;
    };
    paper2: {
      duration: number;
      questions: string;
      calculator: boolean;
      weight: number;
    };
    paper3?: {
      duration: number;
      questions: string;
      calculator: boolean;
      weight: number;
    };
    ia: {
      weight: number;
      type: string;
    };
  }
  
  export interface Subject {
    name: string;
    code: string;
    description: string;
    curriculum: Topic[];
    examDetails: ExamDetails;
  }
  
  