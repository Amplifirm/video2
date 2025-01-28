// src/types/ibSubjects.ts

export interface Subject {
    id: string;
    name: string;
    group: number;
    level: 'HL' | 'SL' | null;
  }
  
  export interface FormData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    school: string;
    selectedSubjects: Record<string, Subject>;
  }
  
  export const IB_SUBJECTS = {
    1: [ // Language & Literature
      { id: 'eng_lit', name: 'English A Literature', group: 1 },
      { id: 'eng_lang', name: 'English A Lang & Lit', group: 1 },
      { id: 'spa_lit', name: 'Spanish A Literature', group: 1 },
      { id: 'spa_lang', name: 'Spanish A Lang & Lit', group: 1 }
    ],
    2: [ // Language Acquisition
      { id: 'eng_b', name: 'English B', group: 2 },
      { id: 'spa_b', name: 'Spanish B', group: 2 },
      { id: 'fre_b', name: 'French B', group: 2 },
      { id: 'man_b', name: 'Mandarin B', group: 2 },
      { id: 'spa_ab', name: 'Spanish ab initio', group: 2 },
      { id: 'fre_ab', name: 'French ab initio', group: 2 }
    ],
    3: [ // Individuals & Societies
      { id: 'econ', name: 'Economics', group: 3 },
      { id: 'bm', name: 'Business Management', group: 3 },
      { id: 'psych', name: 'Psychology', group: 3 },
      { id: 'hist', name: 'History', group: 3 },
      { id: 'geo', name: 'Geography', group: 3 }
    ],
    4: [ // Sciences
      { id: 'physics', name: 'Physics', group: 4 },
      { id: 'chem', name: 'Chemistry', group: 4 },
      { id: 'bio', name: 'Biology', group: 4 },
      { id: 'cs', name: 'Computer Science', group: 4 },
      { id: 'ess', name: 'Environmental Systems', group: 4 }
    ],
    5: [ // Mathematics
      { id: 'math_aa', name: 'Mathematics AA', group: 5 },
      { id: 'math_ai', name: 'Mathematics AI', group: 5 }
    ],
    6: [ // The Arts
      { id: 'va', name: 'Visual Arts', group: 6 },
      { id: 'music', name: 'Music', group: 6 },
      { id: 'theatre', name: 'Theatre', group: 6 },
      { id: 'film', name: 'Film', group: 6 }
    ]
  } as const;
  
  export const GROUP_NAMES = {
    1: 'Studies in Language & Literature',
    2: 'Language Acquisition',
    3: 'Individuals & Societies',
    4: 'Sciences',
    5: 'Mathematics',
    6: 'The Arts'
  } as const;
  
  export const validateStep = (step: number, formData: FormData): string | null => {
    switch (step) {
      case 1: // Account
        if (!formData.email || !formData.password) {
          return 'Please fill in all fields';
        }
        if (formData.password.length < 6) {
          return 'Password must be at least 6 characters';
        }
        if (!formData.email.includes('@')) {
          return 'Please enter a valid email address';
        }
        break;
  
      case 2: // Personal Info
        if (!formData.firstName || !formData.lastName || !formData.school) {
          return 'Please fill in all fields';
        }
        break;
  
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8: // Subject Selection Steps
        const group = Math.ceil((step - 2) / 2);
        const groupSubjects = Object.values(formData.selectedSubjects)
          .filter(s => s.group === group);
        
        if (group === 1 && groupSubjects.length === 0) {
          return 'Please select at least one Language & Literature subject';
        }
        if (group === 2 && groupSubjects.length === 0) {
          return 'Please select at least one Language Acquisition subject';
        }
        if (group === 5 && groupSubjects.length === 0) {
          return 'Mathematics is required';
        }
        break;
  
      case 9: // Final Validation
        const hlCount = Object.values(formData.selectedSubjects)
          .filter(s => s.level === 'HL').length;
        const slCount = Object.values(formData.selectedSubjects)
          .filter(s => s.level === 'SL').length;
        
        if (hlCount !== 3) {
          return 'Please select exactly 3 HL subjects';
        }
        if (slCount !== 3) {
          return 'Please select exactly 3 SL subjects';
        }
  
        // Validate one subject from each required group
        const groups = Object.values(formData.selectedSubjects)
          .map(s => s.group);
        const requiredGroups = [1, 2, 5]; // Lang & Lit, Lang Acquisition, Math
        
        for (const group of requiredGroups) {
          if (!groups.includes(group)) {
            return `Missing required subject from Group ${group}`;
          }
        }
        break;
    }
    return null;
  };