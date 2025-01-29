import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {

  LogOut,

  Edit,

  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

interface UserMenuProps {
  isOpen: boolean;
  onClose: () => void;
  profile: {
    first_name: string;
    school?: string;
  };
  onUpdateProfile: (updates: any) => Promise<void>;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, profile, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile.first_name,
    school: profile.school || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-full left-0 w-full mb-2 p-2 rounded-xl 
                   bg-[#1e293b] border border-white/10 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {!isEditing ? (
            // View Mode
            <div className="space-y-2">
              <motion.button
                whileHover={{ x: 4 }}
                onClick={() => setIsEditing(true)}
                className="w-full px-3 py-2 rounded-lg flex items-center gap-3 
                         text-gray-400 hover:text-white hover:bg-white/5"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-medium">Edit Profile</span>
                <ChevronRight className="w-4 h-4 ml-auto" />
              </motion.button>

              <motion.button
                whileHover={{ x: 4 }}
                onClick={handleLogout}
                className="w-full px-3 py-2 rounded-lg flex items-center gap-3 
                         text-red-400 hover:text-red-300 hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Log Out</span>
              </motion.button>
            </div>
          ) : (
            // Edit Mode
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="px-3">
                  <label className="text-xs text-gray-400">Name</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 
                             text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="px-3">
                  <label className="text-xs text-gray-400">School</label>
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 
                             text-white text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 px-3">{error}</p>
              )}

              <div className="flex gap-2 px-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm text-gray-400 
                           hover:text-white hover:bg-white/5"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 px-3 py-1.5 rounded-lg text-sm bg-blue-500 
                           text-white hover:bg-blue-600 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </motion.button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UserMenu;