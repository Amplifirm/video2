import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft,
  Bot, 
  HelpCircle, 
  RefreshCw, 
  BookOpen,
  ChevronRight,
  X,
  Sparkles,
  Brain, 
  Calculator,
  CheckCircle2,
  AlertCircle,
  Code,
  Beaker,
  Microscope,
  LineChart,
  Building2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';

import { generateQuestion, checkStep, getExplanation, getSolution } from '../lib/claude';
import { useUserProgress } from '../hooks/useUserProgress';
import type { 
  Question,
  StepCheck,
  StepExplanation,
  Solution,
  EditorProps,
  ClaudeQuestionResponse,
  ClaudeAnswerResponse,
  ClaudeSolutionResponse,
} from '../types/practice';

interface SubjectInfo {
  serverId: string;
  displayName: string;
}


type ServerSubject = 
  | 'mathematics_aa' 
  | 'mathematics_ai' 
  | 'physics_hl' 
  | 'physics_sl' 
  | 'chemistry_hl' 
  | 'chemistry_sl' 
  | 'biology_hl' 
  | 'biology_sl' 
  | 'economics_hl' 
  | 'economics_sl' 
  | 'business_hl' 
  | 'business_sl' 
  | 'computer_science_hl' 
  | 'computer_science_sl';

// Subject Config Types
interface SubjectConfig {
  icon: React.ElementType;
  title: string;
  description: string;
  themes: string;
  validator: (input: string) => boolean;
  answerFormat: 'calculation' | 'essay' | 'code' | 'mixed';
  showStepNumbers: boolean;
}



const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// Basic editor component for now - you can replace with actual implementations later
const Editor: React.FC<EditorProps> = ({
  value,
  onChange,
  onKeyDown,
  placeholder,
  className,
  readOnly
}) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={className}
      readOnly={readOnly}
    />
  );
};

const SUBJECT_CONFIGS: Record<string, SubjectConfig> = {
  mathematics_aa: {
    icon: Calculator,
    title: "Mathematics AA",
    description: "Practice mathematical concepts step by step",
    themes: "from-blue-500 to-indigo-500",
    validator: (input: string): boolean => input.includes('=') || input.includes(';'),
    answerFormat: 'calculation',
    showStepNumbers: true
  },
  mathematics_ai: {
    icon: Calculator,
    title: "Mathematics AI",
    description: "Practice applications and interpretations",
    themes: "from-blue-500 to-indigo-500",
    validator: (input: string): boolean => input.includes('=') || input.includes(';'),
    answerFormat: 'calculation',
    showStepNumbers: true
  },
  physics_hl: {
    icon: Brain,
    title: "Physics HL",
    description: "Master physics problems and concepts",
    themes: "from-purple-500 to-pink-500",
    validator: (input: string): boolean => input.includes('=') || input.includes('N'),
    answerFormat: 'calculation',
    showStepNumbers: true
  },
  physics_sl: {
    icon: Brain,
    title: "Physics SL",
    description: "Master physics problems and concepts",
    themes: "from-purple-500 to-pink-500",
    validator: (input: string): boolean => input.includes('=') || input.includes('N'),
    answerFormat: 'calculation',
    showStepNumbers: true
  },
  chemistry_hl: {
    icon: Beaker,
    title: "Chemistry HL",
    description: "Practice chemical reactions and calculations",
    themes: "from-green-500 to-emerald-500",
    validator: (input: string): boolean => input.includes('→') || input.includes('='),
    answerFormat: 'mixed',
    showStepNumbers: true
  },
  chemistry_sl: {
    icon: Beaker,
    title: "Chemistry SL",
    description: "Practice chemical reactions and calculations",
    themes: "from-green-500 to-emerald-500",
    validator: (input: string): boolean => input.includes('→') || input.includes('='),
    answerFormat: 'mixed',
    showStepNumbers: true
  },
  biology_hl: {
    icon: Microscope,
    title: "Biology HL",
    description: "Study biological processes and systems",
    themes: "from-amber-500 to-orange-500",
    validator: (input: string): boolean => input.length > 50,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  biology_sl: {
    icon: Microscope,
    title: "Biology SL",
    description: "Study biological processes and systems",
    themes: "from-amber-500 to-orange-500",
    validator: (input: string): boolean => input.length > 50,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  economics_hl: {
    icon: LineChart,
    title: "Economics HL",
    description: "Analyze economic concepts and theories",
    themes: "from-red-500 to-rose-500",
    validator: (input: string): boolean => input.length > 100,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  economics_sl: {
    icon: LineChart,
    title: "Economics SL",
    description: "Analyze economic concepts and theories",
    themes: "from-red-500 to-rose-500",
    validator: (input: string): boolean => input.length > 100,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  business_hl: {
    icon: Building2,
    title: "Business Management HL",
    description: "Analyze business cases and strategies",
    themes: "from-teal-500 to-cyan-500",
    validator: (input: string): boolean => input.length > 100,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  business_sl: {
    icon: Building2,
    title: "Business Management SL",
    description: "Analyze business cases and strategies",
    themes: "from-teal-500 to-cyan-500",
    validator: (input: string): boolean => input.length > 100,
    answerFormat: 'essay',
    showStepNumbers: false
  },
  computer_science_hl: {
    icon: Code,
    title: "Computer Science HL",
    description: "Practice programming and algorithms",
    themes: "from-violet-500 to-purple-500",
    validator: (input: string): boolean => input.includes('{') || input.includes('function'),
    answerFormat: 'code',
    showStepNumbers: true
  },
  computer_science_sl: {
    icon: Code,
    title: "Computer Science SL",
    description: "Practice programming and algorithms",
    themes: "from-violet-500 to-purple-500",
    validator: (input: string): boolean => input.includes('{') || input.includes('function'),
    answerFormat: 'code',
    showStepNumbers: true
  }
};

const PracticePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useUserProgress();
  const location = useLocation();
  const { subjectId } = useParams();
  const [courseInfo, setCourseInfo] = useState<{subject: string, course: string} | null>(null);
  
  // Basic states with proper types
  const [input, setInput] = useState<string>('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepAnswers, setStepAnswers] = useState<string[]>([]);
  const [stepChecks, setStepChecks] = useState<StepCheck[]>([]);
  const [explanation, setExplanation] = useState<StepExplanation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced features states
  const [score, setScore] = useState<number>(100);
  const [attemptCounts, setAttemptCounts] = useState<number[]>([]);
  const [showingSolutions, setShowingSolutions] = useState<boolean[]>([]);
  const [solutions, setSolutions] = useState<(Solution | null | undefined)[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(5);
  const [systemError, setSystemError] = useState<string | null>(null);
  const [subjectDisplay, setSubjectDisplay] = useState<string>("");

  const getSubjectDisplayInfo = (
    clientSubject: string, 
    course: string
  ): SubjectInfo => {
    // Extract HL/SL from the course string
    const level = course.includes('HL') ? 'HL' : 'SL';
    
    // Subject display name mapping
    const subjectDisplayNames: Record<string, string> = {
      'mathematics_aa': `Mathematics AA ${level}`,
      'mathematics_ai': `Mathematics AI ${level}`,
      'physics': `Physics ${level}`,
      'chemistry': `Chemistry ${level}`,
      'biology': `Biology ${level}`,
      'economics': `Economics ${level}`,
      'business_management': `Business Management ${level}`,
      'computer_science': `Computer Science ${level}`
    };
  
    // Get the server ID as before
    const serverId = getServerSubjectId(clientSubject, course);
    
    // Get display name (with fallback)
    const baseSubject = clientSubject.split('_')[0];
    const displayName = subjectDisplayNames[baseSubject] || course;
  
    return {
      serverId,
      displayName
    };
  };


  const getServerSubjectId = (clientSubject: string, course: string): ServerSubject => {
    // Extract HL/SL from the course string
    const level = course.includes('HL') ? 'hl' : 'sl';
    
    // Handle special cases and format conversions
    const subjectMapping: Record<string, string> = {
      'mathematics_aa_hl': 'mathematics_aa',
      'mathematics_aa_sl': 'mathematics_aa',
      'mathematics_ai_hl': 'mathematics_ai',
      'mathematics_ai_sl': 'mathematics_ai',
      'business_management': 'business',
      'computer_science': 'computer_science'
    };
  
    // First try the direct mapping
    const mappedSubject = subjectMapping[clientSubject];
    if (mappedSubject) {
      // For mathematics, return as is
      if (mappedSubject.startsWith('mathematics')) {
        return mappedSubject as ServerSubject;
      }
      // For others, append the level
      return `${mappedSubject}_${level}` as ServerSubject;
    }
  
    // If no mapping found, try to format it directly
    if (clientSubject.includes('_hl') || clientSubject.includes('_sl')) {
      return clientSubject as ServerSubject;
    }
  
    // Default case: append level
    return `${clientSubject}_${level}` as ServerSubject;
  };
  

  const subjectConfig = SUBJECT_CONFIGS[subjectId || 'mathematics_aa'] || SUBJECT_CONFIGS.mathematics_aa;

  // Add this after your state declarations
useEffect(() => {
  const state = location.state as { subject: string; course: string } | null;
  if (state) {
    setCourseInfo(state);
  }
}, [location]);

useEffect(() => {
  if (courseInfo?.course) {
    const { displayName } = getSubjectDisplayInfo(
      subjectId || 'mathematics_aa',
      courseInfo.course
    );
    setSubjectDisplay(displayName);
  }
}, [subjectId, courseInfo]);


  // Get subject-specific suggestions
  const getSubjectSuggestions = (): string[] => {
    const suggestions: Record<string, string[]> = {
      mathematics_aa: [  // Updated from 'math'
        'Calculus: Integration',
        'Vectors: Cross Product',
        'Statistics: Normal Distribution',
        'Complex Numbers'
      ],
      physics: [
        'Mechanics: Forces',
        'Thermodynamics',
        'Wave Motion',
        'Electricity'
      ],
      chemistry: [
        'Organic Chemistry',
        'Thermochemistry',
        'Equilibrium',
        'Redox'
      ],
      biology: [
        'Cell Biology',
        'Genetics',
        'Ecology',
        'Evolution'
      ],
      economics: [
        'Supply and Demand',
        'Market Structures',
        'International Trade',
        'Development'
      ],
      business: [
        'Marketing',
        'Human Resources',
        'Finance',
        'Operations'
      ],
      computer_science: [
        'Algorithms',
        'Data Structures',
        'Object-Oriented Programming',
        'Databases'
      ]
    };
    return suggestions[subjectId || 'mathematics_aa'] || suggestions.mathematics_aa;
  };

  // Handle keyboard shortcuts
  const handleKeyPress = async (e: React.KeyboardEvent): Promise<void> => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (subjectConfig.answerFormat === 'essay' && input.length < 100) {
        setError('Essays should be at least 100 words long');
        return;
      }
      await submitResponse();
    }
  };

  // Generate a similar question
  const generateSimilarQuestion = async (): Promise<void> => {
    if (!question || !profile) return;
    setLoading(true);
    
    try {
      // Update this section in submitResponse
const response: ClaudeQuestionResponse = await generateQuestion(
  input,
  {
    ...profile,
    subject: subjectId || 'math',
    course: courseInfo?.course || `IB ${subjectConfig.title} HL` // Add this line
  }
);
      
      if (response.error) {
        setError(response.error);
      } else if (response.question && response.details) {
        setQuestion({
          content: response.question,
          details: response.details
        });
        resetPracticeState();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate similar question');
    } finally {
      setLoading(false);
    }
  };

  // Reset practice state
  const resetPracticeState = (): void => {
    setInput('');
    setCurrentStep(0);
    setStepAnswers([]);
    setStepChecks([]);
    setAttemptCounts([]);
    setShowingSolutions([]);
    setSolutions([]);
    setExplanation(null);
    setError(null);
  };

  // Reset entire practice session
  const resetPractice = (): void => {
    setQuestion(null);
    resetPracticeState();
    setScore(100);
    setCurrentDifficulty(5);
    setError(null);
  };

  // Show solution for a step
  const showSolution = async (stepIndex: number): Promise<void> => {
    if (!question || !profile) return;
    setLoading(true);
    setError(null); // Clear any existing errors

    try {
        const subject = getServerSubjectId(
            subjectId || 'mathematics_aa',
            courseInfo?.course || `IB ${subjectConfig.title} HL`
        );

        // Attempt to get solution from API
        const response: ClaudeSolutionResponse = await getSolution(
            question.content,
            question.details.expectedSteps[stepIndex],
            {
                ...profile,
                subject,
                course: courseInfo?.course || `IB ${subjectConfig.title} HL`
            },
            stepIndex
        );

        // Handle API errors
        if (response.error) {
            setError('Cannot load solution at this time. Please try using hints instead.');
            return;
        }

        // Validate solution data
        const solutionData = response.solution;
        if (!solutionData || !solutionData.solution) {
            setError('No solution available for this step. Try breaking it down into smaller parts.');
            setShowingSolutions(prev => {
                const updated = [...prev];
                updated[stepIndex] = false;
                return updated;
            });
            return;
        }

        // Update solution visibility
        setShowingSolutions(prev => {
            const updated = [...prev];
            updated[stepIndex] = true;
            return updated;
        });
        
        // Update solutions with proper fallbacks
        setSolutions(prev => {
            const updated = [...prev];
            updated[stepIndex] = {
                solution: {
                    explanation: solutionData.solution.explanation || 
                        'Try breaking this step down into smaller parts and attempt each one separately.',
                    working: solutionData.solution.working || 
                        'Solution details not available. Consider using the hint feature for guidance.',
                    tips: solutionData.solution.tips?.length ? 
                        solutionData.solution.tips : 
                        [
                            'Review the relevant formulas and concepts',
                            'Break down the problem into smaller steps',
                            'Check your work carefully'
                        ]
                }
            };
            return updated;
        });

        // Update score and difficulty
        setScore(prevScore => Math.max(0, prevScore - 15));
        setCurrentDifficulty(prev => Math.max(1, prev - 1));

    } catch (err) {
        console.error('Solution retrieval error:', err);
        setError(
            err instanceof Error && err.message.includes('Invalid subject') 
                ? 'This subject is not yet supported for solutions. Please try another subject.' 
                : 'Unable to load solution. Please try again or use hints.'
        );
        
        // Reset solution visibility on error
        setShowingSolutions(prev => {
            const updated = [...prev];
            updated[stepIndex] = false;
            return updated;
        });
    } finally {
        setLoading(false);
    }
};

  // Request hint
  const requestHint = async (): Promise<void> => {
    if (!question || !profile) return;
    setLoading(true);
    
    try {
      const response: ClaudeAnswerResponse = await getExplanation(
        question.content,
        question.details.expectedSteps[currentStep],
        {
          ...profile,
          subject: getServerSubjectId(
            subjectId || 'mathematics_aa',
            courseInfo?.course || `IB ${subjectConfig.title} HL`
          ),
          course: courseInfo?.course || `IB ${subjectConfig.title} HL`
        }
      );
      
      if (response.error) {
        setError(response.error);
      } else if (response.explanation) {
        setExplanation(response.explanation);
        setScore(prevScore => Math.max(0, prevScore - 5));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get hint');
    } finally {
      setLoading(false);
    }
};

  // Handle step check
  const handleStepCheck = (stepCheck: StepCheck): void => {
    const { isCorrect, canContinue, skippedSteps } = stepCheck;

    if (!isCorrect) {
      const newAttemptCounts = [...attemptCounts];
      newAttemptCounts[currentStep] = Math.max(0, (newAttemptCounts[currentStep] || 3) - 1);
      setAttemptCounts(newAttemptCounts);
      setCurrentDifficulty(prev => Math.max(1, prev - 0.2));
    }

    if (isCorrect) {
      const newStepAnswers = [...stepAnswers];
      newStepAnswers[currentStep] = input;
      setStepAnswers(newStepAnswers);
      
      const newStepChecks = [...stepChecks];
      newStepChecks[currentStep] = stepCheck;
      setStepChecks(newStepChecks);

      setError("✨ Correct! Well done!");
      setTimeout(() => setError(null), 2000);

      if (canContinue) {
        const stepsToAdvance = skippedSteps || 1;
        if (currentStep + stepsToAdvance < (question?.details.expectedSteps.length || 0)) {
          setCurrentStep(curr => curr + stepsToAdvance);
          setInput('');
          setCurrentDifficulty(prev => Math.min(10, prev + 0.5));
        }
      }
    } else {
      if (attemptCounts[currentStep] > 0) {
        setError("Not quite right - try again!");
      } else {
        setError("Would you like to see the solution?");
      }
    }
  };

  // Submit response
  const submitResponse = async (): Promise<void> => {
    if (!profile || !input.trim()) return;
    setError(null);
    setLoading(true);
    setExplanation(null);
  
    try {
      if (!question) {
        // Generate new question
        try {
          const subject = getServerSubjectId(
            subjectId || 'mathematics_aa',
            courseInfo?.course || `IB ${subjectConfig.title} HL`
          );
  
          const response: ClaudeQuestionResponse = await generateQuestion(
            input,
            {
              ...profile,
              subject,
              course: courseInfo?.course || `IB ${subjectConfig.title} HL`
            }
          );
  
          if (response.error) {
            setError(response.error);
            return;
          }
  
          if (response.question && response.details) {
            setQuestion({
              content: response.question,
              details: {
                ...response.details,
                subjectSpecific: {}
              }
            });
            resetPracticeState();
            setAttemptCounts(new Array(response.details.expectedSteps.length).fill(3));
            setShowingSolutions(new Array(response.details.expectedSteps.length).fill(false));
            setSolutions(new Array(response.details.expectedSteps.length).fill(null));
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Invalid subject')) {
            setSystemError('This subject is not yet supported. Please try another subject.');
          } else {
            setSystemError('An error occurred while generating the question. Please try again.');
          }
          console.error('Generate question error:', err);
          return;
        }
      } else {
        // Check answer for current step
        try {
          const subject = getServerSubjectId(
            subjectId || 'mathematics_aa',
            courseInfo?.course || `IB ${subjectConfig.title} HL`
          );
  
          const response: ClaudeAnswerResponse = await checkStep(
            question.content,
            currentStep,
            input,
            {
              ...profile,
              subject,
              course: courseInfo?.course || `IB ${subjectConfig.title} HL`
            }
          );
  
          if (response.error) {
            setError(response.error);
            return;
          }
  
          if (response.stepCheck) {
            handleStepCheck(response.stepCheck);
          }
        } catch (err) {
          if (err instanceof Error && err.message.includes('Invalid subject')) {
            setSystemError('This subject is not yet supported. Please try another subject.');
          } else {
            setSystemError('An error occurred checking your answer. Please try again.');
          }
          console.error('Check step error:', err);
          return;
        }
      }
    } catch (err) {
      console.error('Submit response error:', err);
      setSystemError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header with Glassmorphism */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-[#1e293b]/50 backdrop-blur-xl 
                 border-b border-white/10 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 h-20">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-white/5 text-white hover:bg-white/10 
                         transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div className={`flex items-center gap-3 px-4 py-2 rounded-xl
                           bg-gradient-to-r ${subjectConfig.themes}/10`}>
                <subjectConfig.icon className="w-5 h-5 text-white" />
                <span className={`font-medium bg-gradient-to-r ${subjectConfig.themes} 
                              bg-clip-text text-transparent`}>
                  {subjectDisplay || courseInfo?.course || 'Practice'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Score Display */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden"
              >
                <div className={`px-6 py-2 bg-gradient-to-r ${subjectConfig.themes} 
                              rounded-xl text-white font-medium flex items-center gap-2`}>
                  <Sparkles className="w-4 h-4" />
                  <span>{score} points</span>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  animate={{
                    x: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 3,
                    ease: "linear",
                    repeat: Infinity,
                  }}
                />
              </motion.div>

              {/* Level Indicator */}
              <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${subjectConfig.themes}`} />
                  <span className="text-white font-medium">Level {currentDifficulty}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="pt-32 px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            {!question ? (
              // Topic Selection View
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-3xl mx-auto space-y-16"
              >
                {/* Title */}
                <motion.div 
                  className="text-center space-y-4"
                  variants={itemVariants}
                >
                  <h1 className="text-6xl font-bold">
                    <span className={`bg-gradient-to-r ${subjectConfig.themes} 
                                 bg-clip-text text-transparent`}>
                      Master
                    </span>
                    <br />
                    <span className="text-white">{subjectConfig.title}</span>
                  </h1>
                  <p className="text-gray-400 text-lg">
                    {subjectConfig.description}
                  </p>
                </motion.div>

                {/* Topics Grid */}
                <motion.div variants={itemVariants}>
                  <div className="grid grid-cols-2 gap-4">
                    {getSubjectSuggestions().map((topic: string) => (
                      <motion.button
                        key={topic}
                        onClick={() => setInput(topic)}
                        className="group relative overflow-hidden"
                        whileHover={{ y: -4, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        <div className="p-6 bg-[#1e293b]/50 backdrop-blur-xl rounded-2xl 
                                    border border-white/10 relative z-10">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="font-medium text-white group-hover:text-blue-400 
                                         transition-colors">
                                {topic}
                              </h3>
                              <p className="text-sm text-gray-400">Start practicing</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 
                                                 group-hover:text-blue-400
                                                 group-hover:translate-x-1 
                                                 transition-all" />
                          </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 
                                    to-indigo-500/5 group-hover:from-blue-500/10 
                                    group-hover:to-indigo-500/10 transition-colors 
                                    rounded-2xl" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Custom Topic Input */}
                <motion.div
                  variants={itemVariants}
                  className="relative"
                >
                  <Editor
                    value={input}
                    onChange={setInput}
                    onKeyDown={handleKeyPress}
                    placeholder={`Describe what you want to practice in ${subjectConfig.title}...`}
                    className="w-full p-8 bg-[#1e293b]/50 backdrop-blur-xl rounded-3xl
                           resize-none border border-white/10 focus:border-blue-500 
                           focus:ring-4 focus:ring-blue-500/10 transition-all
                           text-lg min-h-[200px] placeholder:text-gray-500
                           text-white"
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 
                               bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                    <kbd className="px-2 py-1 text-xs font-medium text-white 
                                bg-white/10 rounded">⌘</kbd>
                    <span className="text-white text-sm">+</span>
                    <kbd className="px-2 py-1 text-xs font-medium text-white 
                                bg-white/10 rounded">↵</kbd>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Practice Interface
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-4xl mx-auto space-y-10"
              >
                {/* Question Card */}
                <motion.div 
                  variants={itemVariants}
                  className="relative overflow-hidden"
                >
                  <div className="relative backdrop-blur-xl bg-[#1e293b]/50 rounded-3xl 
                              p-8 border border-white/10">
                    <div className="space-y-6">
                      {/* Question Header */}
                      <div className="flex justify-between items-start">
                        <motion.div 
                          className={`inline-flex items-center gap-2 px-4 py-1.5 
                                   bg-gradient-to-r ${subjectConfig.themes}/20 
                                   rounded-full`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-sm font-medium text-white">
                            {question.details.examStyle}
                          </span>
                        </motion.div>
                        
                        <div className={`px-4 py-1.5 bg-gradient-to-r ${subjectConfig.themes} 
                                     text-white rounded-full text-sm font-medium`}>
                          {question.details.difficulty}
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="font-mono text-lg bg-[#1e293b]/30 p-6 rounded-2xl 
                                  border border-white/10 text-white whitespace-pre-wrap">
                        {question.content}
                      </div>

                      {/* Question Metadata */}
                      <div className="flex justify-between text-sm">
                        <span className="text-white bg-white/5 px-3 py-1.5 
                                     rounded-lg border border-white/10">
                          {question.details.topic}
                        </span>
                        <span className="text-white bg-white/5 px-3 py-1.5 
                                     rounded-lg border border-white/10">
                          {question.details.subtopic}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Steps Progress */}
                <div className="space-y-6">
                  {question.details.expectedSteps.map((step: string, index: number) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`relative overflow-hidden rounded-2xl ${
                        index === currentStep ? 'ring-2 ring-offset-4 ring-offset-[#0f172a]' : ''
                      } ${
                        index === currentStep ? `ring-[${subjectConfig.themes.split(' ')[1]}]` :
                        index < currentStep ? 'ring-2 ring-green-500 ring-offset-4 ring-offset-[#0f172a]' : ''
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent" />
                      <div className={`relative backdrop-blur-xl p-6 
                        ${index === currentStep ? 'bg-[#1e293b]/90' :
                          index < currentStep ? 'bg-green-900/20' : 'bg-[#1e293b]/50'}`}>
                        <div className="flex items-start gap-4">
                          {subjectConfig.showStepNumbers && (
                            <div className={`w-10 h-10 rounded-xl flex items-center 
                                        justify-center text-sm font-medium ${
                              index === currentStep ? `bg-gradient-to-r ${subjectConfig.themes} text-white` :
                              index < currentStep ? 'bg-green-500/20 text-green-500' :
                              'bg-white/5 text-gray-400'
                            }`}>
                              {index + 1}
                            </div>
                          )}
                          
                          <div className="flex-1 space-y-4">
                            <h3 className="font-medium text-white">{step}</h3>
                            
                            {stepAnswers[index] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="text-sm bg-[#1e293b]/30 p-4 rounded-xl 
                                         border border-white/10"
                              >
                                <div className="font-mono text-green-400">
                                  {stepAnswers[index]}
                                </div>
                              </motion.div>
                            )}
                            
                            {!stepAnswers[index] && !showingSolutions[index] && 
                             index === currentStep && (
                              <motion.button
                                onClick={() => showSolution(index)}
                                className="flex items-center gap-2 px-4 py-2 
                                         bg-amber-500/20 text-amber-500 rounded-xl 
                                         text-sm font-medium hover:bg-amber-500/30 
                                         transition-all"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <BookOpen className="w-4 h-4" />
                                Show Solution (-15 points)
                              </motion.button>
                            )}
                            
                            {showingSolutions[index] && solutions[index] && (
  <motion.div
    initial={{ height: 0, opacity: 0 }}
    animate={{ height: 'auto', opacity: 1 }}
    exit={{ height: 0, opacity: 0 }}
    className="bg-amber-900/20 backdrop-blur-xl p-4 
               rounded-xl border border-amber-500/20"
  >
    <div className="font-mono text-amber-400">
      {/* Note the nested solution property */}
      {solutions[index]?.solution?.working || 'Loading solution...'}
    </div>
    <div className="mt-4 text-sm text-amber-400">
      Tips:
      <ul className="list-disc pl-4 mt-2 space-y-1">
        {solutions[index]?.solution?.tips?.map((tip: string, i: number) => (
          <li key={i}>{tip}</li>
        )) || <li>No tips available</li>}
      </ul>
    </div>
  </motion.div>
)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

               
{/* Current Step Input */}
{currentStep < question.details.expectedSteps.length && (
  <motion.div 
    variants={itemVariants}
    className="space-y-4"
  >
    <div className="relative">
      <Editor
        value={input}
        onChange={setInput}
        onKeyDown={handleKeyPress}
        placeholder={`Enter your ${subjectConfig.answerFormat} answer...`}
        className="w-full p-8 bg-[#1e293b]/50 backdrop-blur-xl rounded-3xl
                resize-none border border-white/10 focus:border-blue-500 
                focus:ring-4 focus:ring-blue-500/10 transition-all
                text-lg min-h-[180px] placeholder:text-gray-500
                text-white font-mono"
      />
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        {/* Keyboard shortcut hint */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 
                     rounded-lg border border-white/10 text-gray-400 text-sm">
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">⌘</kbd>
          <span>+</span>
          <kbd className="px-2 py-1 bg-white/10 rounded text-xs">Enter</kbd>
          <span className="ml-2">to submit</span>
        </div>

        {/* Action buttons */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={requestHint}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 
                   rounded-xl border border-white/10 text-white 
                   hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <HelpCircle className="w-4 h-4" />
          Get Hint (-5 points)
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={submitResponse}
          disabled={loading || !input.trim()}
          className={`flex items-center gap-2 px-6 py-2 rounded-xl
                    text-white font-medium transition-colors
                    ${loading || !input.trim() ? 
                      'bg-blue-500/50 cursor-not-allowed' : 
                      'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Submit
        </motion.button>
        <motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => {
    setQuestion(null);
    resetPracticeState();
  }}
  className="flex items-center gap-2 px-4 py-2 bg-white/5 
             rounded-xl border border-white/10 text-white 
             hover:bg-white/10 transition-colors"
>
  <ChevronRight className="w-4 h-4" />
  Skip Question
</motion.button>
      </div>
    </div>

    {/* Error Display */}
    <AnimatePresence>
    {(error || systemError) && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 
               px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50
               ${error?.includes("✨") ? 
                 'bg-green-500/20 text-green-500 border border-green-500/20' :
                 'bg-red-500/20 text-red-500 border border-red-500/20'}`}
  >
    {error?.includes("✨") ? (
      <Sparkles className="w-5 h-5" />
    ) : (
      <AlertCircle className="w-5 h-5" />
    )}
    <span className="font-medium">{systemError || error}</span>
    <button 
      onClick={() => {
        setError(null);
        setSystemError(null);
      }}
      className="ml-2 hover:opacity-75 transition-opacity"
    >
      <X className="w-4 h-4" />
    </button>
  </motion.div>
)}
    </AnimatePresence>

    {/* Explanation Modal */}
    <AnimatePresence>
      {explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                   flex items-center justify-center p-6"
          onClick={() => setExplanation(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="w-full max-w-2xl bg-[#1e293b] rounded-3xl p-8 
                     border border-white/10 space-y-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Hint */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <HelpCircle className="w-5 h-5" />
                  <h3 className="font-medium">Hint</h3>
                </div>
                <p className="text-gray-400">{explanation.hint}</p>
              </div>

              {/* Concept Explanation */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <Brain className="w-5 h-5" />
                  <h3 className="font-medium">Concept</h3>
                </div>
                <p className="text-gray-400">{explanation.conceptExplanation}</p>
              </div>

              {/* Prerequisites */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-medium">Prerequisites</h3>
                </div>
                <ul className="space-y-2">
                  {explanation.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-gray-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Common Mistakes */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white">
                  <AlertCircle className="w-5 h-5" />
                  <h3 className="font-medium">Common Mistakes</h3>
                </div>
                <ul className="space-y-2">
                  {explanation.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-gray-400 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setExplanation(null)}
              className="absolute top-4 right-4 text-gray-400 
                       hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
)}

{/* Practice Complete Actions */}
{question && currentStep === question.details.expectedSteps.length && (
  <motion.div
    variants={itemVariants}
    className="fixed bottom-6 right-6 flex items-center gap-4"
  >
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={generateSimilarQuestion}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2 bg-green-500 
                 hover:bg-green-600 rounded-xl text-white font-medium 
                 transition-colors disabled:opacity-50"
    >
      <RefreshCw className="w-4 h-4" />
      Similar Question
    </motion.button>

    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={resetPractice}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-2 bg-blue-500 
                 hover:bg-blue-600 rounded-xl text-white font-medium 
                 transition-colors disabled:opacity-50"
    >
      <Bot className="w-4 h-4" />
      New Topic
    </motion.button>
  </motion.div>
)}
</motion.div>
)}
</AnimatePresence>
</div>
</div>
</div>
);
}


export default PracticePage;