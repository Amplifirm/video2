import React, { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Basic auth info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Student info
  const [studentInfo, setStudentInfo] = useState({
    age: '',
    mathCourse: '',
    school: '',
  });

  const mathCourseOptions = [
    'IB Math AA HL',
    'IB Math AA SL',
    'IB Math AI HL',
    'IB Math AI SL'
  ];

  const validateStep1 = () => {
    if (!email || !password || password.length < 6) {
      setError('Please provide a valid email and password (minimum 6 characters)');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const { age, mathCourse, school } = studentInfo;
    if (!age || !mathCourse || !school) {
      setError('Please fill in all required fields');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setError(null);
      setCurrentStep(2);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Starting auth process...'); // Debug log
    
    if (isSignUp && !validateStep2()) return;

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isSignUp) {
        console.log('Starting signup...'); // Debug log
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });

        console.log('Signup response:', signUpData); // Debug log

        if (signUpError) throw signUpError;
        if (!signUpData.user?.id) throw new Error('No user ID returned from signup');

        console.log('Creating profile...'); // Debug log
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: signUpData.user.id,
              username: email.split('@')[0],
              age: Number(studentInfo.age),
              math_course: studentInfo.mathCourse,
              school: studentInfo.school,
            }
          ]);

        if (profileError) throw profileError;

        console.log('Profile created, navigating...'); // Debug log
        navigate('/profile-setup');
      } else {
        console.log('Starting signin...'); // Debug log
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('Signin response:', signInData); // Debug log

        if (signInError) throw signInError;

        console.log('Successfully signed in, navigating...'); // Debug log
        navigate('/profile-setup');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-xl">
        {/* Logo */}
        <div className="flex justify-center">
          <span className="text-6xl font-bold italic font-serif">x³</span>
        </div>

        <h2 className="mt-6 text-center text-3xl font-bold font-serif text-gray-900">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </h2>
        
        <p className="mt-2 text-center text-sm text-gray-600 font-serif">
          {isSignUp ? 'Start your mathematical journey' : 'Continue your mathematical journey'}
        </p>

        {error && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 font-serif">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 text-green-800 p-4 rounded-lg border border-green-200 font-serif">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          {(!isSignUp || (isSignUp && currentStep === 1)) && (
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-serif text-gray-700">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border 
                           border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                           focus:z-10 sm:text-sm font-serif"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-serif text-gray-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border
                           border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                           focus:z-10 sm:text-sm font-serif"
                  placeholder="Password (min. 6 characters)"
                />
              </div>
            </div>
          )}

          {isSignUp && currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label htmlFor="age" className="block text-sm font-serif text-gray-700">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  required
                  value={studentInfo.age}
                  onChange={(e) => setStudentInfo(prev => ({...prev, age: e.target.value}))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg font-serif"
                  min="10"
                  max="100"
                />
              </div>

              <div>
                <label htmlFor="mathCourse" className="block text-sm font-serif text-gray-700">
                  Math Course
                </label>
                <select
                  id="mathCourse"
                  required
                  value={studentInfo.mathCourse}
                  onChange={(e) => setStudentInfo(prev => ({...prev, mathCourse: e.target.value}))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg font-serif"
                >
                  <option value="">Select Math Course</option>
                  {mathCourseOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="school" className="block text-sm font-serif text-gray-700">
                  School
                </label>
                <input
                  id="school"
                  type="text"
                  required
                  value={studentInfo.school}
                  onChange={(e) => setStudentInfo(prev => ({...prev, school: e.target.value}))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg font-serif"
                  placeholder="Your school name"
                />
              </div>
            </div>
          )}

          <div>
            {isSignUp && currentStep === 1 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full flex justify-center py-3 px-4 border border-transparent
                         text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-900
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                         transition-all duration-200 ease-in-out font-serif"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent
                         text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-900
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black
                         transition-all duration-200 ease-in-out font-serif disabled:opacity-50
                         disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>
            )}
          </div>

          {isSignUp && currentStep === 2 && (
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="mt-2 w-full text-sm text-gray-600 hover:text-gray-900 font-serif"
            >
              Back to previous step
            </button>
          )}

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setCurrentStep(1);
                setError(null);
              }}
              className="font-serif text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;