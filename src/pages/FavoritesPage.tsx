// src/pages/FavoritesPage.tsx
import  { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart} from 'lucide-react';
import { supabase } from '../config/supabase';
import { useUserProgress } from '../hooks/useUserProgress';

interface FavoriteQuestion {
  id: string;
  question_content: string;
  question_details: {
    topic: string;
    subtopic: string;
    difficulty: string;
    examStyle: string;
  };
  steps: {
    expectedSteps: string[];
    solutions: { [key: string]: any };
    explanations: { [key: string]: any };
  };
  favorited_at: string;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const { profile } = useUserProgress();
  const [favorites, setFavorites] = useState<FavoriteQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.id) {
      fetchFavorites();
    }
  }, [profile?.id]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      
      const { data, error: fetchError } = await supabase
        .from('favorite_questions')
        .select('*')
        .order('favorited_at', { ascending: false });

      if (fetchError) throw fetchError;
      setFavorites(data || []);
    } catch (error) {
        console.error('Error fetching favorites:', error); // Logs the error
        setError('Failed to load favorite questions'); // Sets the user-friendly error message      
    } finally {
      setLoading(false);
    }
    
  };

  const removeFavorite = async (questionId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('favorite_questions')
        .delete()
        .eq('id', questionId);

      if (deleteError) throw deleteError;
      
      setFavorites(favorites.filter(f => f.id !== questionId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      setError('Failed to remove from favorites');
    }
  };

  const startPractice = (favorite: FavoriteQuestion) => {
    navigate('/practice', {
      state: {
        question: {
          content: favorite.question_content,
          details: favorite.question_details
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 px-6 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-10">
        <div className="max-w-2xl mx-auto h-full flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-medium">Favorite Questions</h1>
          <div className="w-5" /> {/* Spacer */}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Main Content */}
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading favorites...</div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No favorite questions yet
            </div>
          ) : (
            favorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Question Header */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-500">
                        {favorite.question_details.topic}
                      </div>
                      <div className="flex gap-2">
                        <span className="text-sm bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                          {favorite.question_details.examStyle}
                        </span>
                        <span className="text-sm bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                          {favorite.question_details.difficulty}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFavorite(favorite.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>

                  <div className="font-mono text-sm">
                    {favorite.question_content}
                  </div>

                  {/* Steps and Solutions */}
                  {expandedQuestion === favorite.id && (
                    <div className="mt-4 space-y-4 border-t pt-4">
                      {favorite.steps.expectedSteps.map((step, index) => (
                        <div key={index} className="space-y-2">
                          <div className="font-medium">Step {index + 1}:</div>
                          <div className="text-sm text-gray-600">{step}</div>
                          {favorite.steps.solutions[index] && (
                            <div className="bg-yellow-50 p-3 rounded-lg text-sm">
                              <div className="font-medium text-yellow-700">Solution:</div>
                              <div className="text-gray-600">
                                {favorite.steps.solutions[index].answer}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center pt-4">
                    <button
                      onClick={() => setExpandedQuestion(
                        expandedQuestion === favorite.id ? null : favorite.id
                      )}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      {expandedQuestion === favorite.id ? 'Hide Steps' : 'Show Steps'}
                    </button>
                    <button
                      onClick={() => startPractice(favorite)}
                      className="px-4 py-2 bg-black text-white text-sm rounded-lg
                               hover:bg-gray-900 transition-colors"
                    >
                      Practice Again
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}