// src/pages/EditProfile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, LogOut } from 'lucide-react';
import { supabase } from '../config/supabase';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    preferred_name: '',
    math_course: '',
    school: '',
    avatar_url: '🧑‍💻' // Default emoji
  });

  const mathCourseOptions = [
    'IB Math AA HL',
    'IB Math AA SL',
    'IB Math AI HL',
    'IB Math AI SL'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profile.first_name,
          last_name: profile.last_name,
          preferred_name: profile.preferred_name,
          math_course: profile.math_course,
          school: profile.school,
          avatar_url: profile.avatar_url
        })
        .eq('id', user.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const avatarOptions = ['🧑‍💻', '👩‍💻', '👨‍💻', '🤖', '👾', '🦾', '🧮', '📚'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-serif font-medium">Edit Profile</h1>
          <div className="w-5" /> {/* Spacer */}
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
            <div className="flex gap-4 flex-wrap">
              {avatarOptions.map((avatar) => (
                <button
                  key={avatar}
                  onClick={() => setProfile(prev => ({ ...prev, avatar_url: avatar }))}
                  className={`text-2xl p-3 rounded-lg ${
                    profile.avatar_url === avatar 
                      ? 'bg-black text-white' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                value={profile.first_name}
                onChange={(e) => setProfile(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                value={profile.last_name}
                onChange={(e) => setProfile(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Name</label>
            <input
              type="text"
              value={profile.preferred_name}
              onChange={(e) => setProfile(prev => ({ ...prev, preferred_name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Math Course</label>
            <select
              value={profile.math_course}
              onChange={(e) => setProfile(prev => ({ ...prev, math_course: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="">Select Course</option>
              {mathCourseOptions.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
            <input
              type="text"
              value={profile.school}
              onChange={(e) => setProfile(prev => ({ ...prev, school: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg
                       hover:bg-gray-900 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg
                       hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}