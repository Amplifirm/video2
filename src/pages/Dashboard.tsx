// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Brain,  
  Book, 
  ChevronRight,
  Crown,
  BarChart,
  Settings,
  Heart,
  BookOpen,
  FunctionSquare,
  CircleDot,
  BoxSelect,
  Circle,
  LineChart,
  Percent,
  DollarSign
} from 'lucide-react';
import { supabase } from '../config/supabase';

interface TopicButtonProps {
    topic: string;
    subtitle: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; // Type for the Lucide icons
  }

  
const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredNav, setHoveredNav] = useState<number | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const navigationItems = [
    { name: 'Home', icon: Home, path: '/dashboard', locked: false },
    { name: 'Practice', icon: Brain, path: '/practice', locked: false },
    { name: 'Assessment Results', icon: BarChart, path: '/assessment-results', locked: false },
    { name: 'Favourite Questions', icon: Book, path: '/favourites', locked: false }
  ];

  const upcomingFeatures = [
    { title: 'Advanced Practice', description: 'Challenge yourself with complex problems', icon: Brain },
    { title: 'Video Tutorials', description: 'Visual learning experience', icon: Crown },
    { title: 'Progress Analytics', description: 'Track your improvement over time', icon: LineChart },
    { title: 'Personalized Insights', description: 'AI-powered learning suggestions', icon: BookOpen }
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setUserProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const handleNavigation = (path: string, locked: boolean) => {
    if (!locked) {
      navigate(path);
    }
  };

  const TopicButton: React.FC<TopicButtonProps> = ({ topic, subtitle, icon: Icon }) => {
    const navigate = useNavigate();
    
    return (
      <button
        onClick={() => navigate('/practice', { state: { selectedTopic: topic } })}
        className="p-4 border border-gray-100 rounded-xl text-left hover:border-black 
                  transition-all duration-300 hover:shadow-md group w-full"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="font-medium font-serif">{topic}</div>
            <div className="text-sm text-gray-500 font-serif">{subtitle}</div>
          </div>
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
        </div>
      </button>
    );
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-xl relative flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="text-3xl font-bold font-serif bg-black text-white w-12 h-12 rounded-xl flex items-center justify-center transform rotate-6">
              x³
            </div>
            <div className="font-serif text-xl">Math AI</div>
          </div>
        </div>
        
        {/* Profile Section */}
        {userProfile && (
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="text-4xl">
                {userProfile.avatar_url || '👤'}
              </div>
              <div>
                <div className="font-serif font-medium">
                  {userProfile.preferred_name || userProfile.first_name}
                </div>
                <div className="text-sm text-gray-500 font-serif">
                  {userProfile.school}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="text-sm font-serif">
                <span className="text-gray-500">Course: </span>
                <span className="font-medium">{userProfile.math_course}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1">
          {navigationItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path, item.locked)}
              className={`w-full flex items-center px-6 py-4 rounded-xl text-gray-600
                         transition-all duration-300 mb-2 relative
                         ${item.locked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}
                         ${hoveredNav === index ? 'shadow-md transform scale-[1.02]' : ''}`}
              onMouseEnter={() => setHoveredNav(index)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors duration-300
                                   ${hoveredNav === index ? 'text-black' : 'text-gray-400'}`} />
              <span className="font-serif">{item.name}</span>
              {!item.locked && <ChevronRight className={`w-4 h-4 ml-auto transition-opacity duration-300
                                                      ${hoveredNav === index ? 'opacity-100' : 'opacity-0'}`} />}
            </button>
          ))}
        </nav>

        {/* Settings Link */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center px-6 py-4 rounded-xl text-gray-600
                     hover:bg-gray-50 transition-all duration-300"
          >
            <Settings className="w-5 h-5 mr-3 text-gray-400" />
            <span className="font-serif">Settings</span>
            <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center pt-20 px-8 overflow-y-auto">
        <div className="max-w-3xl w-full">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-6 mb-16">
            <div 
              onClick={() => navigate('/practice')}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 
                        hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Brain className="w-6 h-6 text-blue-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-serif font-medium">Start Practice</h3>
              <p className="text-sm text-gray-500 font-serif mt-2">
                Begin a new practice session
              </p>
            </div>

            <div 
              onClick={() => navigate('/favourites')}
              className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 
                        hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-50 rounded-lg">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-lg font-serif font-medium">Saved Questions</h3>
              <p className="text-sm text-gray-500 font-serif mt-2">
                Review your favorite problems
              </p>
            </div>
          </div>

          {/* Course Topics */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-16">
            <h3 className="text-xl font-serif font-medium mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              Course Topics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {userProfile?.math_course === 'IB Math AA HL' ? (
                <>
                  <TopicButton topic="Calculus" subtitle="Derivatives & Integration" icon={FunctionSquare} />
                  <TopicButton topic="Complex Numbers" subtitle="Argand & De Moivre" icon={CircleDot} />
                  <TopicButton topic="Vectors" subtitle="3D & Cross Product" icon={BoxSelect} />
                  <TopicButton topic="Statistics" subtitle="Probability & Distributions" icon={BarChart} />
                </>
              ) : userProfile?.math_course === 'IB Math AA SL' ? (
                <>
                  <TopicButton topic="Functions" subtitle="Domain & Range" icon={FunctionSquare} />
                  <TopicButton topic="Trigonometry" subtitle="Identities & Equations" icon={Circle} />
                  <TopicButton topic="Calculus" subtitle="Basic Integration" icon={LineChart} />
                  <TopicButton topic="Statistics" subtitle="Normal Distribution" icon={BarChart} />
                </>
              ) : userProfile?.math_course === 'IB Math AI HL' ? (
                <>
                  <TopicButton topic="Statistics" subtitle="Chi-Square & Regression" icon={BarChart} />
                  <TopicButton topic="Probability" subtitle="Discrete & Continuous" icon={Percent} />
                  <TopicButton topic="Finance" subtitle="Interest & Depreciation" icon={DollarSign} />
                  <TopicButton topic="Calculus" subtitle="Optimization" icon={LineChart} />
                </>
              ) : (
                <>
                  <TopicButton topic="Statistics" subtitle="Data Analysis" icon={BarChart} />
                  <TopicButton topic="Functions" subtitle="Quadratic Models" icon={FunctionSquare} />
                  <TopicButton topic="Geometry" subtitle="Trigonometry" icon={Circle} />
                  <TopicButton topic="Finance" subtitle="Basic Interest" icon={DollarSign} />
                </>
              )}
            </div>
          </div>

          {/* Coming Soon */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-white rounded-xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif font-medium flex items-center gap-2">
                  <Crown className="w-5 h-5 text-gray-400" />
                  <span>Coming Soon</span>
                </h3>
                <div className="text-sm text-gray-400 font-serif">Premium Features</div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {upcomingFeatures.map((feature, index) => (
                  <div 
                    key={index}
                    className="p-6 rounded-xl border border-gray-100 hover:border-gray-200
                             transition-all duration-300 hover:shadow-md transform hover:scale-[1.02]
                             cursor-not-allowed"
                  >
                    <feature.icon className="w-6 h-6 text-gray-400 mb-3" />
                    <h4 className="font-serif font-medium mb-1">{feature.title}</h4>
                    <p className="text-sm text-gray-500 font-serif">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;