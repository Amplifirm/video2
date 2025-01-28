export interface Subject {
    id: string;
    name: string;
    group: number;
    level: 'HL' | 'SL';
  }
  
  export interface Profile {
    first_name: string;
    subjects: Subject[];
  }