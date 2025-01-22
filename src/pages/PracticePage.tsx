import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bot, HelpCircle, RefreshCw, BookOpen } from 'lucide-react';
import { useUserProgress } from '../hooks/useUserProgress';
import { generateQuestion, checkStep, getExplanation, getSolution } from '../lib/claude'
import { 
    Question, 
    StepCheck, 
    StepExplanation, 
    Solution
  } from '../types/practice';;
  import SolutionDisplay from '../components/SolutionDisplay';

import { 
  ChevronRight, X, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PracticePage = () => {
  const navigate = useNavigate();
  const { profile} = useUserProgress();
  
  // Basic states
  const [input, setInput] = useState('');
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [stepAnswers, setStepAnswers] = useState<string[]>([]);
  const [stepChecks, setStepChecks] = useState<StepCheck[]>([]);
  const [explanation, setExplanation] = useState<StepExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Enhanced features states
  const [score, setScore] = useState<number>(100);
  const [attemptCounts, setAttemptCounts] = useState<number[]>([]);
  const [showingSolutions, setShowingSolutions] = useState<boolean[]>([]);
  const [solutions, setSolutions] = useState<(Solution | null)[]>([]);
  const [courseSuggestions, setCourseSuggestions] = useState<string[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(5);



  const moveToNewQuestion = () => {
    // Reset question-related state
    setQuestion(null);
    setInput('');
    setCurrentStep(0);
    setStepAnswers([]);
    setStepChecks([]);
    setAttemptCounts([]);
    setShowingSolutions([]);
    setSolutions([]);
    setExplanation(null);
    setError(null);
    // Note: We're not resetting score or currentDifficulty
  };

  // Get course-specific topic suggestions
  const getCourseSuggestions = (mathCourse: string) => {
    const suggestions = {
      'IB Math AA HL': [
        'Calculus: Implicit Differentiation',
        'Complex Numbers: De Moivre\'s Theorem',
        'Vectors: Triple Vector Product',
        'Series: Maclaurin Series',
        'Integration: Integration by Parts'
      ],
      'IB Math AA SL': [
        'Calculus: Chain Rule',
        'Functions: Domain and Range',
        'Trigonometry: Double Angle Formulas',
        'Statistics: Normal Distribution',
        'Vectors: Dot Product'
      ],
      'IB Math AI HL': [
        'Statistics: Chi-Square Test',
        'Financial Math: Compound Interest',
        'Calculus: Kinematics',
        'Geometry: 3D Shapes',
        'Matrices: Transformations'
      ],
      'IB Math AI SL': [
        'Functions: Quadratic Models',
        'Statistics: Correlation',
        'Geometry: Sine and Cosine Rules',
        'Calculus: Basic Integration',
        'Probability: Tree Diagrams'
      ]
    };

    return suggestions[mathCourse as keyof typeof suggestions] || [];
  };

  // Update suggestions when profile loads
  useEffect(() => {
    if (profile?.math_course) {
      setCourseSuggestions(getCourseSuggestions(profile.math_course));
    }
  }, [profile?.math_course]);

  // Handle keyboard shortcuts
  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      await submitResponse();
    }
  };

  // Show solution for a step
  const showSolution = async (stepIndex: number) => {
    if (!question || !profile) return;
    setLoading(true);
    
    try {
      const response = await getSolution(
        question.content,
        question.details.expectedSteps[stepIndex],
        profile,
        stepIndex
      );
      
      console.log('Solution response for step', stepIndex, ':', response);
      
      if (response.error) {
        setError(response.error);
        return;
      }
  
      if (response.solution) {
        // Update only the specific step's solution
        setShowingSolutions(prev => {
          const updated = [...prev];
          updated[stepIndex] = true;
          return updated;
        });
        
        setSolutions(prev => {
          const updated = [...prev];
          // Explicitly handle the type by setting to null if undefined
          updated[stepIndex] = response.solution || null;
          return updated;
        });
  
        setScore(prevScore => Math.max(0, prevScore - 15));
        setCurrentDifficulty(prev => Math.max(1, prev - 1));
        
        console.log('Updated solution for step', stepIndex);
      }
    } catch (err) {
      console.error('Solution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get solution');
    } finally {
      setLoading(false);
    }
  };

  // Submit response handler
  const submitResponse = async () => {
    if (!profile || !input.trim()) return;
    setError(null);
    setLoading(true);
    setExplanation(null);

    try {
      if (!question) {
        // Generate new question
        const response = await generateQuestion(input, profile);
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        if (response.question && response.details) {
          setQuestion({
            content: response.question,
            details: response.details
          });
          setInput('');
          setCurrentStep(0);
          setStepAnswers([]);
          setStepChecks([]);
          setAttemptCounts(new Array(response.details.expectedSteps.length).fill(3));
          setShowingSolutions(new Array(response.details.expectedSteps.length).fill(false));
          setSolutions(new Array(response.details.expectedSteps.length).fill(null));
          setCurrentDifficulty(5);
        }
      } else {
        // Check answer for current step
        const isSkippingSteps = input.includes('=') || input.includes(';') || 
                               input.includes('\n') || input.length > 50;

        const response = await checkStep(
          question.content,
          currentStep,
          input,
          profile,
          isSkippingSteps
        );
        
        if (response.error) {
          setError(response.error);
          return;
        }
        
        if (response.stepCheck) {
          const { isCorrect, canContinue, skippedSteps } = response.stepCheck;

          // Update attempts count if incorrect
          if (!isCorrect) {
            const newAttemptCounts = [...attemptCounts];
            newAttemptCounts[currentStep] = Math.max(0, (newAttemptCounts[currentStep] || 3) - 1);
            setAttemptCounts(newAttemptCounts);
            setCurrentDifficulty(prev => Math.max(1, prev - 0.2));
          }

          if (isCorrect) {
            // Handle correct answer
            const newStepAnswers = [...stepAnswers];
            newStepAnswers[currentStep] = input;
            setStepAnswers(newStepAnswers);
            
            const newStepChecks = [...stepChecks];
            newStepChecks[currentStep] = response.stepCheck;
            setStepChecks(newStepChecks);

            // Success message
            setError("Correct! Well done!");
            setTimeout(() => setError(null), 2000);

            if (canContinue) {
              // Handle step skipping
              const stepsToAdvance = skippedSteps || 1;
              if (currentStep + stepsToAdvance < question.details.expectedSteps.length) {
                setCurrentStep(curr => curr + stepsToAdvance);
                setInput('');
                setCurrentDifficulty(prev => Math.min(10, prev + 0.5));
              }
            }
          } else {
            // Handle incorrect answer
            if (attemptCounts[currentStep] > 0) {
              setError("Not quite right - try again!");
            } else {
              setError("Would you like to see the solution?");
            }
          }
        }
      }
    } catch (err) {
      console.error('Submit response error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Request hint
  const requestHint = async () => {
    if (!question || !profile) return;
    setLoading(true);
    
    try {
      const response = await getExplanation(
        question.content,
        question.details.expectedSteps[currentStep],
        profile
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

  // Generate similar question
  const generateSimilarQuestion = async () => {
    if (!question || !profile) return;
    setLoading(true);
    
    try {
      const response = await generateQuestion(
        question.details.topic,
        {
          ...profile,
          skillLevel: currentDifficulty
        },
        question.content
      );
      
      if (response.error) {
        setError(response.error);
      } else if (response.question && response.details) {
        setQuestion({
          content: response.question,
          details: response.details
        });
        setInput('');
        setCurrentStep(0);
        setStepAnswers([]);
        setStepChecks([]);
        setAttemptCounts(new Array(response.details.expectedSteps.length).fill(3));
        setShowingSolutions(new Array(response.details.expectedSteps.length).fill(false));
        setSolutions(new Array(response.details.expectedSteps.length).fill(null));
        setExplanation(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate similar question');
    } finally {
      setLoading(false);
    }
  };

  // Reset practice session
  const resetPractice = () => {
    setQuestion(null);
    setInput('');
    setCurrentStep(0);
    setStepAnswers([]);
    setStepChecks([]);
    setAttemptCounts([]);
    setShowingSolutions([]);
    setSolutions([]);
    setExplanation(null);
    setError(null);
    setScore(100);
    setCurrentDifficulty(5);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#F8F7FC]">
      {/* Ultra Modern Header with Glassmorphism */}
      <motion.div 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 backdrop-blur-xl bg-white/80 z-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between px-6 h-20">
            <div className="flex items-center gap-6">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-purple-50 text-purple-600 
                         hover:bg-purple-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 
                           to-purple-600/10 px-4 py-2 rounded-xl">
                <Bot className="w-5 h-5 text-purple-600" />
                <span className="font-medium bg-gradient-to-r from-purple-600 to-purple-800 
                             bg-clip-text text-transparent">
                  {profile?.math_course || 'IB Math Practice'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Animated Score Display */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden"
              >
                <div className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-800 
                            rounded-xl text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>{score} points</span>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-400/20 
                           to-transparent"
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
              <div className="px-4 py-2 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-purple-800 font-medium">Level {currentDifficulty}</span>
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
              // Modern Topic Selection
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-3xl mx-auto space-y-16"
              >
                {/* Animated Title */}
                <motion.div 
                  className="text-center space-y-4"
                  variants={itemVariants}
                >
                  <h1 className="text-6xl font-bold">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-900 
                                 bg-clip-text text-transparent">
                      Master
                    </span>
                    <br />
                    <span className="text-gray-800">Your Math</span>
                  </h1>
                  <p className="text-gray-600 text-lg">
                    Choose a topic to practice from {profile?.math_course}
                  </p>
                </motion.div>

                {/* Topic Grid */}
                {courseSuggestions.length > 0 && (
                  <motion.div variants={itemVariants}>
                    <div className="grid grid-cols-2 gap-4">
                      {courseSuggestions.map((topic) => (
                        <motion.button
                          key={topic}
                          onClick={() => setInput(topic)}
                          className="group relative overflow-hidden"
                          whileHover={{ scale: 1.02 }}
                          variants={itemVariants}
                        >
                          <div className="p-6 bg-white rounded-2xl border border-purple-100 
                                      relative z-10">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <h3 className="font-medium text-gray-800 group-hover:text-purple-700 
                                           transition-colors">
                                  {topic}
                                </h3>
                                <p className="text-sm text-gray-500">Start practicing</p>
                              </div>
                              <ChevronRight className="w-5 h-5 text-purple-600 
                                                   group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 
                                      to-purple-600/0 group-hover:from-purple-600/10 
                                      transition-colors rounded-2xl" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Custom Topic Input */}
                <motion.div
                  variants={itemVariants}
                  className="relative backdrop-blur-lg"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 
                               to-purple-600/5 rounded-3xl" />
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Or type your own topic..."
                    className="w-full p-8 bg-white/80 rounded-3xl resize-none relative
                           border-2 border-purple-100 focus:border-purple-500 
                           focus:ring-4 focus:ring-purple-100 transition-all
                           text-lg min-h-[200px] placeholder:text-gray-400"
                  />
                  <div className="absolute bottom-6 right-6 flex items-center gap-2 
                               bg-purple-50 px-3 py-1.5 rounded-lg">
                    <kbd className="px-2 py-1 text-xs font-medium text-purple-600 
                                bg-purple-100 rounded">⌘</kbd>
                    <span className="text-purple-600 text-sm">+</span>
                    <kbd className="px-2 py-1 text-xs font-medium text-purple-600 
                                bg-purple-100 rounded">↵</kbd>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              // Question Interface
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
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 
                               via-purple-600/5 to-purple-700/5" />
                  <div className="relative backdrop-blur-xl bg-white/90 rounded-3xl p-8 
                              border border-purple-100">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <motion.div 
                            className="inline-flex items-center gap-2 px-4 py-1.5 
                                     bg-purple-100 text-purple-700 rounded-full"
                            whileHover={{ scale: 1.05 }}
                          >
                            <span className="text-sm font-medium">
                              {question.details.examStyle}
                            </span>
                          </motion.div>
                        </div>
                        <div className="px-4 py-1.5 bg-gradient-to-r from-purple-600 
                                   to-purple-800 text-white rounded-full text-sm 
                                   font-medium">
                          {question.details.difficulty}
                        </div>
                      </div>

                      <div className="font-mono text-lg bg-white/80 p-6 rounded-2xl 
                                  border border-purple-100">
                        {question.content}
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-purple-700 bg-purple-50 px-3 py-1.5 
                                     rounded-lg">
                          {question.details.topic}
                        </span>
                        <span className="text-purple-700 bg-purple-50 px-3 py-1.5 
                                     rounded-lg">
                          {question.details.subtopic}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Steps Progress */}
                <div className="space-y-6">
                  {question.details.expectedSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`relative overflow-hidden rounded-2xl ${
                        index === currentStep ? 'ring-2 ring-purple-500 ring-offset-4' :
                        index < currentStep ? 'ring-2 ring-green-500 ring-offset-4' : ''
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 
                                  to-purple-600/5" />
                      <div className={`relative backdrop-blur-xl p-6 
                        ${index === currentStep ? 'bg-white/90' :
                          index < currentStep ? 'bg-green-50/90' : 'bg-white/80'}`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center 
                                       justify-center text-sm font-medium ${
                            index === currentStep ? 'bg-purple-100 text-purple-700' :
                            index < currentStep ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <h3 className="font-medium text-gray-800">{step}</h3>
                            
                            {stepAnswers[index] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                className="text-sm bg-white/80 p-4 rounded-xl 
                                         border border-purple-100"
                              >
                                <div className="font-mono text-gray-700">
                                  {stepAnswers[index]}
                                </div>
                              </motion.div>
                            )}
                            
                            {!stepAnswers[index] && !showingSolutions[index] && (
                              <motion.button
                                onClick={() => showSolution(index)}
                                className="flex items-center gap-2 px-4 py-2 
                                         bg-gradient-to-r from-amber-500 to-amber-600 
                                         text-white rounded-xl text-sm font-medium 
                                         hover:from-amber-600 hover:to-amber-700 
                                         transition-all shadow-lg shadow-amber-500/20"
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
                                className="bg-amber-50/50 backdrop-blur-xl p-4 
                                         rounded-xl border border-amber-200"
                              >
                                <SolutionDisplay solution={solutions[index]} />
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
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Enter your solution..."
                        className="w-full p-8 bg-white/80 backdrop-blur-xl rounded-3xl
                        resize-none relative border-2 border-purple-100
                        focus:border-purple-500 focus:ring-4 focus:ring-purple-100
                        transition-all text-lg min-h-[180px] placeholder:text-gray-400"
             />
             <div className="absolute bottom-6 right-6 flex items-center gap-2 
                          bg-purple-50 px-3 py-1.5 rounded-lg">
               <kbd className="px-2 py-1 text-xs font-medium text-purple-600 
                           bg-purple-100 rounded">⌘</kbd>
               <span className="text-purple-600 text-sm">+</span>
               <kbd className="px-2 py-1 text-xs font-medium text-purple-600 
                           bg-purple-100 rounded">↵</kbd>
             </div>
           </div>

           <div className="flex gap-4">
             {attemptCounts[currentStep] > 0 && error?.includes("Not quite right") && (
               <motion.button
                 onClick={() => setInput('')}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="flex items-center gap-2 px-6 py-3 bg-purple-50 
                          text-purple-700 rounded-xl hover:bg-purple-100 
                          transition-colors font-medium"
               >
                 <RefreshCw className="w-4 h-4" />
                 Try Again ({attemptCounts[currentStep]})
               </motion.button>
             )}

             <motion.button
               onClick={requestHint}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="flex items-center gap-2 px-6 py-3 bg-purple-50 
                        text-purple-700 rounded-xl hover:bg-purple-100 
                        transition-colors font-medium"
             >
               <HelpCircle className="w-4 h-4" />
               Need a Hint? (-5)
             </motion.button>
           </div>
         </motion.div>
       )}

       {/* Action Buttons */}
       <motion.div 
         variants={itemVariants}
         className="flex gap-4"
       >
         {currentStep === question.details.expectedSteps.length ? (
           <>
             <motion.button
               onClick={generateSimilarQuestion}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="flex-1 p-4 bg-gradient-to-r from-purple-600 to-purple-800
                        text-white rounded-xl font-medium shadow-lg 
                        shadow-purple-500/20 hover:from-purple-700 hover:to-purple-900
                        transition-all flex items-center justify-center gap-2"
             >
               <RefreshCw className="w-4 h-4" />
               Try Similar Question
             </motion.button>
             
             <motion.button
               onClick={resetPractice}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               className="flex-1 p-4 bg-white text-purple-700 border-2 
                        border-purple-200 rounded-xl font-medium 
                        hover:bg-purple-50 transition-all"
             >
               New Topic
             </motion.button>
           </>
         ) : (
           <motion.button
             onClick={moveToNewQuestion}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.98 }}
             className="w-full p-4 bg-gradient-to-r from-purple-600 to-purple-800
                      text-white rounded-xl font-medium shadow-lg 
                      shadow-purple-500/20 hover:from-purple-700 hover:to-purple-900
                      transition-all flex items-center justify-center gap-2"
           >
             <ArrowLeft className="w-4 h-4" />
             Move on to New Question
           </motion.button>
         )}
       </motion.div>

       {/* Help/Solution Modal */}
       <AnimatePresence>
         {explanation && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 bg-purple-900/20 backdrop-blur-sm
                      flex items-center justify-center p-6 z-50"
           >
             <motion.div
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="relative w-full max-w-lg overflow-hidden"
             >
               <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10
                           via-purple-600/10 to-purple-700/10" />
               <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-6">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xl font-medium text-purple-900">
                     Help & Explanation
                   </h3>
                   <motion.button
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setExplanation(null)}
                     className="p-1 hover:bg-purple-100 rounded-lg 
                              transition-colors"
                   >
                     <X className="w-5 h-5 text-purple-600" />
                   </motion.button>
                 </div>
                 
                 <div className="space-y-6">
                   {explanation.hint && (
                     <div className="space-y-2">
                       <div className="font-medium text-amber-700">Hint:</div>
                       <div className="bg-amber-50/50 backdrop-blur-xl p-4 
                                   rounded-xl border border-amber-200">
                         <p className="text-gray-700">{explanation.hint}</p>
                       </div>
                     </div>
                   )}
                   {explanation.conceptExplanation && (
                     <div className="space-y-2">
                       <div className="font-medium text-purple-700">
                         Understanding the Concept:
                       </div>
                       <div className="bg-purple-50/50 backdrop-blur-xl p-4 
                                   rounded-xl border border-purple-200">
                         <p className="text-gray-700">
                           {explanation.conceptExplanation}
                         </p>
                       </div>
                     </div>
                   )}
                 </div>
               </div>
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </motion.div>
   )}
 </AnimatePresence>

 {/* Loading Overlay */}
 <AnimatePresence>
   {loading && (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       className="fixed inset-0 bg-white/80 backdrop-blur-sm 
                flex items-center justify-center z-50"
     >
       <motion.div
         className="relative"
       >
         <motion.div
           className="w-16 h-16 border-4 border-purple-200 rounded-full"
           animate={{ rotate: 360 }}
           transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
         />
         <motion.div
           className="absolute inset-0 border-4 border-purple-600 
                    rounded-full border-t-transparent"
           animate={{ rotate: -360 }}
           transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
         />
       </motion.div>
     </motion.div>
   )}
 </AnimatePresence>
</div>
</div>
</div>
);
};

export default PracticePage;

