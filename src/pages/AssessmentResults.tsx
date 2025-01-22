import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { BarChart2, Clock, Award, Brain } from 'lucide-react';

const AssessmentResults = () => {
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    fetchAssessmentResults();
  }, []);

  const fetchAssessmentResults = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        setUserProfile(profile);

        // Fetch initial assessments
        const { data: initialAssessments, error: initialError } = await supabase
          .from('initial_assessment')
          .select('*')
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false });

        if (initialError) throw initialError;

        // Fetch detailed results
        const { data: detailedResults, error: detailedError } = await supabase
          .from('assessment_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (detailedError) throw detailedError;

        // Combine and process the data
        const processedAssessments = initialAssessments.map((assessment: any) => {
          const relatedResults = detailedResults.filter(
            (result: any) => result.created_at >= assessment.completed_at
          ).slice(0, 4); // Get the first 4 questions for this assessment

          return {
            ...assessment,
            detailedResults: relatedResults,
            averageTime: relatedResults.reduce((acc: number, curr: any) => acc + curr.time_taken, 0) / relatedResults.length,
            accuracy: (relatedResults.filter((r: any) => r.correct).length / relatedResults.length) * 100
          };
        });

        setAssessments(processedAssessments);
      }
    } catch (error) {
      console.error('Error fetching assessment results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-black border-t-transparent rounded-full" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Assessment History</h1>
          <p className="text-gray-500 font-serif">Track your progress and improvement over time</p>
        </div>

        {/* Current Level Card */}
        {userProfile && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{userProfile.avatar_url || '👤'}</div>
                <div>
                  <h2 className="text-xl font-serif font-medium">
                    {userProfile.preferred_name || userProfile.first_name}
                  </h2>
                  <p className="text-gray-500 font-serif">
                    {userProfile.curriculum_type} • {userProfile.grade_year}
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 bg-black text-white rounded-full text-sm font-serif">
                {userProfile.skill_level} Level
              </div>
            </div>
          </div>
        )}

        {/* Assessment Cards */}
      <div className="space-y-6">
        {assessments.map((assessment, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-serif font-medium">Assessment #{assessments.length - index}</h3>
                  <p className="text-sm text-gray-500 font-serif">
                    {new Date(assessment.completed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-serif
                              ${assessment.skill_level === 'Advanced' ? 'bg-green-100 text-green-800' :
                                assessment.skill_level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'}`}>
                  {assessment.skill_level}
                </span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-serif">Score</span>
                </div>
                <div className="text-2xl font-bold font-serif">
                  {assessment.score}/4
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <BarChart2 className="w-4 h-4" />
                  <span className="text-sm font-serif">Accuracy</span>
                </div>
                <div className="text-2xl font-bold font-serif">
                  {assessment.accuracy.toFixed(1)}%
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-serif">Avg Time</span>
                </div>
                <div className="text-2xl font-bold font-serif">
                  {(assessment.averageTime / 1000).toFixed(1)}s
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="border-t border-gray-100 pt-4">
              <h4 className="font-serif font-medium mb-3">Question Details</h4>
              <div className="grid grid-cols-1 gap-3">
                {assessment.detailedResults.map((result: any, resultIndex: number) => (
                  <div key={resultIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center
                                    ${result.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {result.correct ? '✓' : '×'}
                      </div>
                      <div>
                        <div className="font-serif">Question {result.question_number}</div>
                        <div className="text-sm text-gray-500 font-serif capitalize">
                          {result.topic?.replace('_', ' ')}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-serif text-gray-500">
                      {(result.time_taken / 1000).toFixed(1)}s
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {assessments.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Brain className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-xl font-serif font-medium mb-2">No Assessments Yet</h3>
            <p className="text-gray-500 font-serif">
              Complete your first assessment to see your results here
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AssessmentResults;