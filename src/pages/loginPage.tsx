import { useState } from 'react';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!data.user) throw new Error('Login failed');

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-md mx-auto pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-gray-900"
            >
              Welcome back
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 mt-2"
            >
              Sign in to continue your IB preparation
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

          {/* Login Form */}
          <motion.div
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

            

            {/* Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-blue-600
                       hover:bg-blue-700 transition-colors text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2 mt-6"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Sign up link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-gray-500"
        >
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up
          </button>
        </motion.p>
      </div>
    </div>
  );
};

export default LoginPage;