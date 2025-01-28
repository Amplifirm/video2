import { 
    Calculator, 
    BookOpen,
    Languages,
    Microscope,
    Globe2,
    Rocket,
    Brain,
    BookText
  } from 'lucide-react';
  import type { LucideIcon } from 'lucide-react';
  
  export interface SubjectConfig {
    icon: LucideIcon;
    gradient: string;
    lightGradient: string;
    accent: string;
    decorativePattern: string;
  }
  
  export const SUBJECT_CONFIG: Record<string, SubjectConfig> = {
    'Mathematics AA': {
      icon: Calculator,
      gradient: 'from-blue-500 to-indigo-500',
      lightGradient: 'from-blue-50 to-indigo-50',
      accent: 'text-blue-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
    },
    'Mathematics AI': {
      icon: Calculator,
      gradient: 'from-violet-500 to-purple-500',
      lightGradient: 'from-violet-50 to-purple-50',
      accent: 'text-violet-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
    },
    'Physics': {
      icon: Rocket,
      gradient: 'from-cyan-500 to-blue-500',
      lightGradient: 'from-cyan-50 to-blue-50',
      accent: 'text-cyan-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)"
    },
    'Chemistry': {
      icon: Microscope,
      gradient: 'from-emerald-500 to-green-500',
      lightGradient: 'from-emerald-50 to-green-50',
      accent: 'text-emerald-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)"
    },
    'Biology': {
      icon: Brain,
      gradient: 'from-green-500 to-emerald-500',
      lightGradient: 'from-green-50 to-emerald-50',
      accent: 'text-green-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)"
    },
    'English A': {
      icon: BookOpen,
      gradient: 'from-amber-500 to-orange-500',
      lightGradient: 'from-amber-50 to-orange-50',
      accent: 'text-amber-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)"
    },
    'Spanish B': {
      icon: Languages,
      gradient: 'from-rose-500 to-pink-500',
      lightGradient: 'from-rose-50 to-pink-50',
      accent: 'text-rose-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.1) 0%, transparent 50%)"
    },
    'Geography': {
      icon: Globe2,
      gradient: 'from-teal-500 to-cyan-500',
      lightGradient: 'from-teal-50 to-cyan-50',
      accent: 'text-teal-500',
      decorativePattern: "radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)"
    }
  } as const;
  
  export const DEFAULT_SUBJECT_CONFIG: SubjectConfig = {
    icon: BookText,
    gradient: 'from-gray-500 to-slate-500',
    lightGradient: 'from-gray-50 to-slate-50',
    accent: 'text-gray-500',
    decorativePattern: "radial-gradient(circle at 50% 50%, rgba(107, 114, 128, 0.1) 0%, transparent 50%)"
  };
  
  export const getSubjectConfig = (subjectName: string): SubjectConfig => {
    // Try to find an exact match
    if (SUBJECT_CONFIG[subjectName]) {
      return SUBJECT_CONFIG[subjectName];
    }
  
    // Try to find a partial match
    const partialMatch = Object.entries(SUBJECT_CONFIG).find(([key]) => 
      subjectName.toLowerCase().includes(key.toLowerCase())
    );
    
    return partialMatch ? partialMatch[1] : DEFAULT_SUBJECT_CONFIG;
  };