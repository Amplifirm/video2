import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, ChevronRight, ArrowLeft } from 'lucide-react';
import { IB_SUBJECTS, GROUP_NAMES, validateStep } from '../types/ibSubjects';
import type { Subject, FormData } from '../types/ibSubjects';

type GroupNumber = 1 | 2 | 3 | 4 | 5 | 6;

const SubjectCard = ({ 
  subject, 
  selected, 
  onSelect 
}: {
  subject: Subject;
  selected: Subject | null;
  onSelect: (level?: 'HL' | 'SL') => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`
      relative p-6 rounded-xl cursor-pointer transition-all duration-200
      ${selected 
        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-500 shadow-lg' 
        : 'bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md'}
    `}
    onClick={() => onSelect()}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{subject.name}</h3>
        {selected && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex gap-3 mt-4"
          >
            {['HL', 'SL'].map((level) => (
              <motion.button
                key={level}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(level as 'HL' | 'SL');
                }}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${selected.level === level
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}
                `}
              >
                {level}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-4"
        >
          <CheckCircle2 className="w-6 h-6 text-blue-500" />
        </motion.div>
      )}
    </div>
  </motion.div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    school: '',
    selectedSubjects: {}
  });

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { data: auth, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!auth.user) throw new Error('Signup failed');

      const subjectsData = Object.values(formData.selectedSubjects).map(subject => ({
        name: subject.name,
        group: subject.group,
        level: subject.level
      }));

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: auth.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          school: formData.school,
          subjects: subjectsData,
          created_at: new Date().toISOString()
        });

      if (profileError) throw profileError;
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    const validationError = validateStep(step, formData);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step === 9) {
      handleSignup();
    } else {
      setStep(prev => prev + 1);
      setError(null);
    }
  };

  const renderSubjectsForGroup = (group: GroupNumber) => {
    const subjects = IB_SUBJECTS[group];
    
    return (
      <motion.div
        key={`group-${group}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="space-y-6"
      >
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div className="text-xs text-gray-500">
            Step: {step}, Group: {group}
          </div>
        )}

        {/* Group heading */}
        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-medium text-blue-800">
            Group {group}: {GROUP_NAMES[group]}
          </h3>
          {group === 5 && (
            <p className="text-sm text-blue-600 mt-2">
              Mathematics is required. Select either AA or AI at your preferred level.
            </p>
          )}
        </div>

        {/* Subject cards */}
        <div className="grid grid-cols-1 gap-4">
          {subjects.map((subjectData) => {
            // Create a proper Subject object with level
            const subject: Subject = {
              ...subjectData,
              level: formData.selectedSubjects[subjectData.id]?.level ?? null
            };
            
            return (
              <SubjectCard
                key={subject.id}
                subject={subject}
                selected={formData.selectedSubjects[subject.id]}
                onSelect={(level?: 'HL' | 'SL') => {
                  const newSubjects = { ...formData.selectedSubjects };
                  
                  if (!newSubjects[subject.id]) {
                    newSubjects[subject.id] = { ...subject, level: null };
                  } else if (level) {
                    newSubjects[subject.id] = { ...subject, level };
                  } else {
                    delete newSubjects[subject.id];
                  }

                  setFormData({
                    ...formData,
                    selectedSubjects: newSubjects
                  });
                }}
              />
            );
          })}
        </div>

        {/* Group requirements */}
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
          {error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <>
              {group === 1 && "Select at least one Language & Literature subject"}
              {group === 2 && "Select at least one Language Acquisition subject"}
              {group === 5 && "Mathematics is required - select one option"}
              {group !== 1 && group !== 2 && group !== 5 && 
               "Select any subjects you wish to study from this group"}
            </>
          )}
        </div>
      </motion.div>
    );
  };

  const renderReviewStep = () => (
    <motion.div
      key="review"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {Object.entries(GROUP_NAMES).map(([groupNum, groupName]) => {
        const groupSubjects = Object.values(formData.selectedSubjects)
          .filter(s => s.group === parseInt(groupNum));
        
        if (groupSubjects.length === 0) return null;
        
        return (
          <div key={groupNum} className="space-y-4">
            <h3 className="font-medium text-gray-700">
              Group {groupNum}: {groupName}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {groupSubjects.map(subject => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  selected={subject}
                  onSelect={(level?: 'HL' | 'SL') => {
                    if (!level) return;
                    const newSubjects = { ...formData.selectedSubjects };
                    newSubjects[subject.id] = { ...subject, level };
                    setFormData({
                      ...formData,
                      selectedSubjects: newSubjects
                    });
                  }}
                />
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h3 className="font-medium text-blue-800 mb-2">Subject Level Summary</h3>
        <p className="text-blue-600">
          HL Subjects: {Object.values(formData.selectedSubjects).filter(s => s.level === 'HL').length}/3
          <br />
          SL Subjects: {Object.values(formData.selectedSubjects).filter(s => s.level === 'SL').length}/3
        </p>
      </div>
    </motion.div>
  );

  const renderStep = () => {
    if (step === 1) {
      return (
        <motion.div
          key="account"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            placeholder="Email address"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                     bg-white/50 backdrop-blur-sm transition-all duration-200
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                     bg-white/50 backdrop-blur-sm transition-all duration-200
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      );
    }

    if (step === 2) {
      return (
        <motion.div
          key="personal"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              placeholder="First name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                       bg-white/50 backdrop-blur-sm transition-all duration-200
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              placeholder="Last name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200
                       bg-white/50 backdrop-blur-sm transition-all duration-200
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <input
            type="text"
            value={formData.school}
            onChange={e => setFormData({...formData, school: e.target.value})}
            placeholder="School name"
            className="w-full px-4 py-3 rounded-xl border border-gray-200
                     bg-white/50 backdrop-blur-sm transition-all duration-200
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      );
    }

    if (step === 9) {
      return renderReviewStep();
    }

    // Subject selection steps
    const group = (step - 2) as GroupNumber;
    return renderSubjectsForGroup(group);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-2xl mx-auto pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
        >
          {/* Progress bar */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => (
              <motion.div
                key={stepNum}
                className={`h-2 rounded-full mx-1 flex-1
                  ${stepNum <= step ? 'bg-blue-500' : 'bg-gray-200'}`}
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: 1,
                  backgroundColor: stepNum <= step ? 'rgb(59, 130, 246)' : 'rgb(229, 231, 235)'
                }}
                transition={{ duration: 0.5, delay: stepNum * 0.1 }}
              />
            ))}
          </div>

          {/* Step title and description */}
          <div className="text-center mb-8">
            <motion.h2
              key={`title-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900"
              >
              {step === 1 ? "Create your account" :
               step === 2 ? "Personal information" :
               step === 9 ? "Review your selections" :
               `Select your ${GROUP_NAMES[(step - 2) as GroupNumber]} subjects`}
            </motion.h2>
            <motion.p
              key={`desc-${step}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 mt-2"
            >
              {step === 1 ? "Get started with your email and password" :
               step === 2 ? "Tell us a bit about yourself" :
               step === 9 ? "Review and finalize your subject choices" :
               "Choose your subjects and their levels"}
            </motion.p>
          </div>

          {/* Error message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-50 rounded-xl flex items-center justify-between"
              >
                <span className="text-red-600">{error}</span>
                <button onClick={() => setError(null)}>
                  <X className="w-5 h-5 text-red-500" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setStep(s => s - 1);
                  setError(null);
                }}
                className="flex-1 px-6 py-3 rounded-xl bg-gray-100
                         hover:bg-gray-200 transition-colors text-gray-700
                         flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-xl bg-blue-600
                       hover:bg-blue-700 transition-colors text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  {step === 9 ? 'Complete Setup' : 'Continue'}
                  {step < 9 && <ChevronRight className="w-5 h-5" />}
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Sign in link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-gray-500"
        >
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign in
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;