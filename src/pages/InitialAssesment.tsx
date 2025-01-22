import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const InitialAssessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [answers, setAnswers] = useState<{ answer: string; timeTaken: number }[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sample questions with increasing difficulty
  const questions = [
    {
      id: 1,
      question: "Solve: 2x + 5 = 13",
      options: ["x = 4", "x = 6", "x = 8", "x = 9"],
      correct: "x = 4",
      difficulty: 1,
      type: "algebra_basic"
    },
    {
      id: 2,
      question: "Find the derivative of y = x² + 3x",
      options: ["y' = 2x + 3", "y' = x² + 3", "y' = 2x", "y' = 3"],
      correct: "y' = 2x + 3",
      difficulty: 2,
      type: "calculus_basic"
    },
    {
      id: 3,
      question: "Solve: sin²θ + cos²θ = ?",
      options: ["0", "1", "2", "π"],
      correct: "1",
      difficulty: 2,
      type: "trigonometry"
    },
    {
      id: 4,
      question: "If log₁₀(x) = 2, then x = ?",
      options: ["20", "100", "200", "1000"],
      correct: "100",
      difficulty: 3,
      type: "logarithms"
    }
  ];

  useEffect(() => {
    if (currentQuestion < questions.length) {
      setStartTime(Date.now());
    }
  }, [currentQuestion]);

  const calculateSkillLevel = (answers: { answer: string; timeTaken: number }[]) => {
    let score = 0;
    
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      const isCorrect = answer.answer === question.correct;
      const timeScore = answer.timeTaken < 30000 ? 2 : answer.timeTaken < 60000 ? 1 : 0;
      
      score += isCorrect ? (question.difficulty * 2 + timeScore) : 0;
    });

    const percentageScore = (score / 24) * 100;
    
    if (percentageScore >= 80) return 'Advanced';
    if (percentageScore >= 60) return 'Intermediate';
    return 'Beginner';
  };

  const saveResults = async (assessmentAnswers: { answer: string; timeTaken: number }[], skillLevel: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      // First, save to initial_assessment table
      const { error: initialAssessmentError } = await supabase
        .from('initial_assessment')
        .insert({
          user_id: user.id,
          score: assessmentAnswers.filter((answer, index) => 
            answer.answer === questions[index].correct
          ).length,
          completion_time: Math.round(
            assessmentAnswers.reduce((acc, curr) => acc + curr.timeTaken, 0)
          ),
          skill_level: skillLevel,
          assessment_data: {
            answers: assessmentAnswers,
            questions: questions
          }
        });

      if (initialAssessmentError) throw initialAssessmentError;

      // Then, save individual results to assessment_results table
      const assessmentResults = assessmentAnswers.map((answer, index) => ({
        user_id: user.id,
        question_number: index + 1,
        correct: answer.answer === questions[index].correct,
        time_taken: Math.round(answer.timeTaken),
        difficulty_level: questions[index].difficulty,
        topic: questions[index].type
      }));

      const { error: resultsError } = await supabase
        .from('assessment_results')
        .insert(assessmentResults);

      if (resultsError) throw resultsError;

      // Update user profile with skill level
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ skill_level: skillLevel })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Navigate to profile setup
      navigate('/profile-setup');
    } catch (error) {
      console.error('Error saving assessment results:', error);
      setError('Failed to save assessment results. Please try again.');
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const timeTaken = Date.now() - startTime; // Time taken in milliseconds
    const isAnswerCorrect = selectedAnswer === questions[currentQuestion].correct;
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const newAnswers = [...answers, { answer: selectedAnswer, timeTaken }];
    setAnswers(newAnswers);

    setTimeout(() => {
      setShowFeedback(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(curr => curr + 1);
      } else {
        // Assessment complete - save results
        const skillLevel = calculateSkillLevel(newAnswers);
        saveResults(newAnswers, skillLevel);
      }
    }, 1500);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 font-serif">
            {error}
          </div>
        </div>
      )}
      
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-black rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-500 font-serif">
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>

        {/* Question card */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-serif mb-6">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 text-left rounded-lg border-2 font-serif
                          transition-all duration-300 hover:border-black
                          ${showFeedback && option === questions[currentQuestion].correct
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback message */}
        {showFeedback && (
          <div className={`text-center font-serif text-lg
                          transition-opacity duration-300
                          ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </div>
        )}
      </div>
    </div>
  );
};

export default InitialAssessment;