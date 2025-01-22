import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import {Save} from 'lucide-react';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    avatarIndex: 0,
    preferredName: ''
  });

  // Sample avatar options
  const avatars = [
    '👩‍🎓', '👨‍🎓', '👩‍🔬', '👨‍🔬', '👩‍💻', '👨‍💻',
    '🧑‍🎓', '🧑‍🔬', '🧑‍💻', '👩', '👨', '🧑'
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            first_name: profile.firstName,
            last_name: profile.lastName,
            avatar_url: avatars[profile.avatarIndex],
            preferred_name: profile.preferredName || profile.firstName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;

        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold mb-2">Complete Your Profile</h2>
            <p className="text-gray-500 font-serif">Let's personalize your learning experience</p>
          </div>

          

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 font-serif mb-4">
                Choose your avatar
              </label>
              <div className="grid grid-cols-6 gap-4">
                {avatars.map((avatar, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setProfile(prev => ({ ...prev, avatarIndex: index }))}
                    className={`text-4xl p-4 rounded-lg border-2 transition-all duration-300
                              ${profile.avatarIndex === index 
                                ? 'border-black shadow-md' 
                                : 'border-gray-200 hover:border-gray-300'}`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 font-serif mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.firstName}
                  onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg font-serif
                           focus:outline-none focus:border-black transition-colors duration-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 font-serif mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={profile.lastName}
                  onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg font-serif
                           focus:outline-none focus:border-black transition-colors duration-300"
                />
              </div>
            </div>

            {/* Preferred Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 font-serif mb-1">
                Preferred Name (Optional)
              </label>
              <input
                type="text"
                value={profile.preferredName}
                onChange={(e) => setProfile(prev => ({ ...prev, preferredName: e.target.value }))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg font-serif
                         focus:outline-none focus:border-black transition-colors duration-300"
                placeholder="What should we call you?"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 px-8 rounded-xl font-serif
                         hover:bg-gray-800 transition-all duration-300 flex items-center 
                         justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>Save Profile & Continue</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;