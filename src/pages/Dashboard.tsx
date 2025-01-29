import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { supabase } from '../config/supabase';
import {
 Brain,

 Clock,
 Settings,
 Home,
 BookOpen,
 ChevronDown,

 Globe2,
 Calculator,
 Languages,
 GraduationCap,
 Microscope,
 Rocket,
 LineChart,
 Lock,
 FileText,
 PenTool,
 Binary,
 Book,
 TestTube,
 Beaker,
 Dna,
 Building2,
 ScrollText,
 Presentation,
 FlaskConical,
 Code2,
 Database,
 FunctionSquare,
 PieChart,
 BarChart,
 AlignLeft,
 Lightbulb,
 Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UserMenu from './UserMenu';


interface Subject {
 id: string;
 name: string;
 group: number;
 level: 'HL' | 'SL';
}


interface Profile {
 first_name: string;
 subjects: Subject[];
}


// Animation variants
const pageTransition = {
 initial: { opacity: 0, y: 20 },
 animate: { opacity: 1, y: 0 },
 exit: { opacity: 0, y: -20 }
};


const containerVariants = {
 hidden: { opacity: 0 },
 show: {
   opacity: 1,
   transition: {
     staggerChildren: 0.1
   }
 }
};


const itemVariants = {
 hidden: { opacity: 0, y: 20 },
 show: { opacity: 1, y: 0 }
};


const sidebarLinks = [
 {
   id: 'overview',
   icon: Home,
   label: 'Dashboard',
 },
 {
   id: 'subjects',
   icon: GraduationCap,
   label: 'Subjects',
 },
 {
   id: 'practice',
   icon: Brain,
   label: 'Practice',
 },
 {
   id: 'analytics',
   icon: LineChart,
   label: 'Analytics',
   comingSoon: true
 }
];


const getSubjectIcon = (subjectName: string): React.ElementType => {
 const subjectType = subjectName.toLowerCase();
  if (subjectType.includes('math')) return Calculator;
 if (subjectType.includes('physics')) return Rocket;
 if (subjectType.includes('chemistry')) return Beaker;
 if (subjectType.includes('biology')) return Microscope;
 if (subjectType.includes('economics')) return LineChart;
 if (subjectType.includes('business')) return Building2;
 if (subjectType.includes('computer science')) return Code2;
 if (subjectType.includes('english')) return BookOpen;
 if (subjectType.includes('language')) return Languages;
 if (subjectType.includes('geography')) return Globe2;
  return Book;
};




// Subject-specific practice content
const getSubjectContent = (subjectName: string): {
 title: string;
 description: string;
 features: Array<{
   icon: React.ElementType;
   title: string;
   description: string;
 }>;
} => {
 const subjectType = subjectName.toLowerCase();




 if (subjectType.includes('math')) {
   return {
     title: "Mathematics Practice Suite",
     description: "Master mathematical concepts through our comprehensive practice tools",
     features: [
       {
         icon: Calculator,
         title: "Problem Generator",
         description: "Practice with automatically generated math problems tailored to your level"
       },
       {
         icon: Target,
         title: "Topic-Focused Practice",
         description: "Focus on specific topics like calculus, algebra, or statistics"
       },
       {
         icon: PenTool,
         title: "Step-by-Step Solutions",
         description: "Learn from detailed solution explanations with multiple approaches"
       },
       {
         icon: Brain,
         title: "Formula Practice",
         description: "Interactive formula sheets and application exercises"
       }
     ]
   };
 }


 if (subjectType.includes('physics')) {
   return {
     title: "Physics Practice Hub",
     description: "Develop your physics understanding through practical and theoretical exercises",
     features: [
       {
         icon: Rocket,
         title: "Problem Solving",
         description: "Practice physics problems with real-world applications"
       },
       {
         icon: FlaskConical,
         title: "Lab Report Practice",
         description: "Learn to write and structure physics lab reports effectively"
       },
       {
         icon: LineChart,
         title: "Data Analysis",
         description: "Practice analyzing and interpreting experimental data"
       },
       {
         icon: Binary,
         title: "Unit Conversions",
         description: "Master the SI system and unit conversions"
       }
     ]
   };
 }


 if (subjectType.includes('chemistry')) {
   return {
     title: "Chemistry Learning Lab",
     description: "Enhanced chemistry practice with visual and theoretical components",
     features: [
       {
         icon: Beaker,
         title: "Reaction Practice",
         description: "Work with chemical equations and reaction mechanisms"
       },
       {
         icon: TestTube,
         title: "Lab Techniques",
         description: "Learn proper laboratory procedures and safety protocols"
       },
       {
         icon: Microscope,
         title: "Molecular Analysis",
         description: "Practice analyzing molecular structures and bonds"
       },
       {
         icon: Database,
         title: "Data Management",
         description: "Learn to collect and analyze experimental data"
       }
     ]
   };
 }


 if (subjectType.includes('biology')) {
   return {
     title: "Biology Study Center",
     description: "Comprehensive biology practice with focus on key IB topics",
     features: [
       {
         icon: Dna,
         title: "Concept Mastery",
         description: "Practice with biological processes and systems"
       },
       {
         icon: FileText,
         title: "Lab Reports",
         description: "Learn to write detailed biological investigations"
       },
       {
         icon: Brain,
         title: "Diagram Practice",
         description: "Master biological diagrams and annotations"
       },
       {
         icon: Microscope,
         title: "Data Analysis",
         description: "Analyze experimental results and research data"
       }
     ]
   };
 }


 if (subjectType.includes('economics')) {
   return {
     title: "Economics Practice Center",
     description: "Develop your economic analysis and essay writing skills",
     features: [
       {
         icon: PieChart,
         title: "Data Response",
         description: "Practice analyzing economic data and graphs"
       },
       {
         icon: ScrollText,
         title: "Essay Writing",
         description: "Structure and write effective economics essays"
       },
       {
         icon: Building2,
         title: "Case Studies",
         description: "Apply economic concepts to real-world scenarios"
       },
       {
         icon: LineChart,
         title: "Graph Skills",
         description: "Master drawing and interpreting economic graphs"
       }
     ]
   };
 }


 if (subjectType.includes('business')) {
   return {
     title: "Business Management Practice",
     description: "Enhance your business analysis and case study skills",
     features: [
       {
         icon: Presentation,
         title: "Case Analysis",
         description: "Practice analyzing business case studies"
       },
       {
         icon: BarChart,
         title: "Financial Tools",
         description: "Work with business ratios and financial analysis"
       },
       {
         icon: ScrollText,
         title: "Report Writing",
         description: "Learn to write professional business reports"
       },
       {
         icon: Building2,
         title: "Strategic Planning",
         description: "Develop business strategies and recommendations"
       }
     ]
   };
 }


 if (subjectType.includes('computer science')) {
   return {
     title: "Computer Science Lab",
     description: "Practice programming and theoretical computer science concepts",
     features: [
       {
         icon: Code2,
         title: "Coding Practice",
         description: "Solve programming problems in Java"
       },
       {
         icon: FunctionSquare,
         title: "Algorithm Design",
         description: "Practice designing and analyzing algorithms"
       },
       {
         icon: Database,
         title: "System Design",
         description: "Learn about computer systems and architecture"
       },
       {
         icon: Binary,
         title: "Theory Practice",
         description: "Master theoretical computer science concepts"
       }
     ]
   };
 }


 if (subjectType.includes('english')) {
   return {
     title: "English Language & Literature",
     description: "Develop your analytical and writing skills",
     features: [
       {
         icon: BookOpen,
         title: "Text Analysis",
         description: "Practice analyzing various types of texts"
       },
       {
         icon: AlignLeft,
         title: "Essay Writing",
         description: "Structure and write compelling essays"
       },
       {
         icon: PenTool,
         title: "Commentary",
         description: "Learn to write detailed literary commentaries"
       },
       {
         icon: Lightbulb,
         title: "Comparative Study",
         description: "Compare and contrast different texts and styles"
       }
     ]
   };
 }


 // Default/Language B subjects
 return {
   title: "Language Practice Suite",
   description: "Comprehensive language learning and practice tools",
   features: [
     {
       icon: Languages,
       title: "Language Skills",
       description: "Practice reading, writing, listening, and speaking"
     },
     {
       icon: ScrollText,
       title: "Essay Writing",
       description: "Learn to write essays in your target language"
     },
     {
       icon: Book,
       title: "Text Analysis",
       description: "Analyze texts and practice comprehension"
     },
     {
       icon: Brain,
       title: "Vocabulary",
       description: "Build and practice subject-specific vocabulary"
     }
   ]
 };
};




const Dashboard = () => {
 const [profile, setProfile] = useState<Profile | null>(null);
 const navigate = useNavigate();
 const [loading, setLoading] = useState(true);
 const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
 const [expandedSection, setExpandedSection] = useState<string>('subjects');
 const [activeView, setActiveView] = useState<string>('overview');
 const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

 const handleUpdateProfile = async (updates: any) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No user logged in');

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (error) throw error;

    // Update local profile state
    setProfile(prev => prev ? { ...prev, ...updates } : null);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};
 
 const handleSubjectSelect = (e: React.MouseEvent, subject: Subject) => {
  e.preventDefault();
  setSelectedSubject(subject);
  setActiveView('subject-detail');
};

 useEffect(() => {
   let mounted = true;


   const getProfile = async () => {
     try {
       const { data: { user } } = await supabase.auth.getUser();
       if (!user) {
         throw new Error('Not authenticated');
       }


       const { data, error } = await supabase
         .from('profiles')
         .select('first_name, subjects')
         .eq('id', user.id)
         .single();


       if (error) throw error;
      
       if (mounted) {
         setProfile(data);
         setLoading(false);
       }
     } catch (error) {
       console.error('Error loading profile:', error);
       if (mounted) {
         setLoading(false);
       }
     }
   };


   getProfile();


   return () => {
     mounted = false;
   };
 }, []);


 const handleViewChange = (e: React.MouseEvent, view: string) => {
   e.preventDefault();
   setActiveView(view);
 };

 const handlePracticeStart = (
  e: React.MouseEvent, 
  subject: Subject, 
  practiceType: 'timed' | 'free' | 'quick' = 'free'
) => {
  e.preventDefault();
  const subjectId = subject.name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
  
  // Create the course string based on subject name and level
  const course = `IB ${subject.name} ${subject.level}`;
  
  navigate(`/practice/${subjectId}`, {
    state: {
      subject: subjectId,
      course: course,
      practiceType: practiceType
    }
  });
};

 if (loading) {
   return (
     <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
       <motion.div
         animate={{
           scale: [1, 1.2, 1],
           rotate: [0, 180, 360],
           opacity: [0.5, 1, 0.5]
         }}
         transition={{
           duration: 2,
           repeat: Infinity,
           ease: "easeInOut"
         }}
         className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500
                  flex items-center justify-center relative"
       >
         <span className="absolute inset-0 flex items-center justify-center text-white
                       font-serif text-xl italic font-bold"
               style={{ fontFamily: 'Times New Roman' }}>
           x³
         </span>
       </motion.div>
     </div>
   );
 }


 // Get content for selected subject
 const subjectContent = selectedSubject ? getSubjectContent(selectedSubject.name) : null;


 return (
   <div className="min-h-screen bg-[#0f172a] flex">
     {/* Spacer for fixed sidebar */}
     <div className="w-20 lg:w-72 flex-shrink-0" />
    
     {/* Fixed Sidebar */}
     <motion.div
       initial={{ x: -100 }}
       animate={{ x: 0 }}
       transition={{ type: "spring", damping: 20 }}
       className="fixed left-0 top-0 h-full w-20 lg:w-72 bg-[#1e293b]/50 backdrop-blur-xl
                border-r border-white/10 flex flex-col z-50"
     >
       {/* Logo */}
       <motion.button
         whileHover={{ scale: 1.02 }}
         onClick={(e) => handleViewChange(e, 'overview')}
         className="h-20 flex items-center justify-center lg:justify-start px-6 border-b border-white/10 cursor-pointer"
       >
         <motion.div
           whileHover={{ rotate: 180 }}
           transition={{ type: "spring", stiffness: 300 }}
           className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500
                    flex items-center justify-center"
         >
           <span className="font-serif text-lg italic font-bold text-white"
                 style={{ fontFamily: 'Times New Roman' }}>
             x³
           </span>
         </motion.div>
         <span className="hidden lg:block ml-3 text-lg font-semibold text-white">
           IB Practice
         </span>
       </motion.button>


       {/* Navigation */}
       <div className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-track-transparent
                    scrollbar-thumb-white/10">
         <nav className="px-3 space-y-1">
           <LayoutGroup>
             {sidebarLinks.map((link) => (
               <div key={link.id}>
                 <motion.button
                   layout
                   whileHover={{ x: 4 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={(e) => {
                     e.preventDefault();
                     if (!link.comingSoon) {
                       if (link.id === 'subjects') {
                         setExpandedSection(expandedSection === 'subjects' ? '' : 'subjects');
                       } else {
                         handleViewChange(e, link.id);
                         setExpandedSection('');
                       }
                     }
                   }}
                   className={`
                     w-full flex items-center px-3 py-3 rounded-xl text-sm relative
                     ${activeView === link.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                     ${link.comingSoon ? 'opacity-50 cursor-not-allowed' : ''}
                   `}
                 >
                   <link.icon className="w-5 h-5" />
                   <span className="hidden lg:block ml-3 font-medium">{link.label}</span>
                   {link.comingSoon && (
                     <motion.span
                       initial={{ opacity: 0, scale: 0.8 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="hidden lg:flex ml-auto items-center text-xs px-2 py-1
                                rounded-full bg-white/10 text-gray-400"
                     >
                       <Lock className="w-3 h-3 mr-1" />
                       Soon
                     </motion.span>
                   )}
                   {link.id === 'subjects' && (
                     <motion.div
                       animate={{ rotate: expandedSection === 'subjects' ? 180 : 0 }}
                       transition={{ duration: 0.2 }}
                     >
                       <ChevronDown className="hidden lg:block w-4 h-4 ml-auto" />
                     </motion.div>
                   )}
                 </motion.button>


                 {/* Subjects Dropdown */}
                 {link.id === 'subjects' && (
                   <AnimatePresence>
                     {expandedSection === 'subjects' && (
                       <motion.div
                         initial={{ opacity: 0, height: 0 }}
                         animate={{
                           opacity: 1,
                           height: 'auto',
                           transition: {
                             height: {
                               type: "spring",
                               stiffness: 500,
                               damping: 30
                             },
                             opacity: { duration: 0.2 }
                           }
                         }}
                         exit={{
                           opacity: 0,
                           height: 0,
                           transition: {
                             height: { duration: 0.2 },
                             opacity: { duration: 0.1 }
                           }
                         }}
                         className="mt-1 ml-2 space-y-1 overflow-hidden"
                       >
                         {profile?.subjects.map((subject, index) => {
                           const SubjectIcon = getSubjectIcon(subject.name);
                           return (
                             <motion.button
                               key={subject.id}
                               initial={{ x: -20, opacity: 0 }}
                               animate={{
                                 x: 0,
                                 opacity: 1,
                                 transition: {
                                   delay: index * 0.05
                                 }
                               }}
                               whileHover={{ x: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                               whileTap={{ scale: 0.98 }}
                               onClick={(e) => handleSubjectSelect(e, subject)}
                               className={`
                                 w-full flex items-center px-4 py-2 rounded-lg text-sm
                                 ${selectedSubject?.id === subject.id && activeView === 'subject-detail'
                                   ? 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white'
                                   : 'text-gray-400 hover:text-white'}
                                 relative
                               `}
                             >
                               <SubjectIcon className="w-4 h-4" />
                               <span className="hidden lg:block ml-3 font-medium">
                                 {subject.name}
                               </span>
                               <span className="hidden lg:block ml-auto text-xs font-medium">
                                 {subject.level}
                               </span>
                               {selectedSubject?.id === subject.id && activeView === 'subject-detail' && (
                                 <motion.div
                                   layoutId="active-subject-indicator"
                                   className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full"
                                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                 />
                               )}
                             </motion.button>
                           );
                         })}
                       </motion.div>
                     )}
                   </AnimatePresence>
                 )}
               </div>
             ))}
           </LayoutGroup>
         </nav>
       </div>


       {/* User Section */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3 }}
  className="p-4 border-t border-white/10 relative"
>
  <motion.button
    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
    className="w-full p-2 rounded-xl flex items-center text-white group"
  >
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500
               flex items-center justify-center"
    >
      {profile?.first_name[0]}
    </motion.div>
    <div className="hidden lg:block ml-3 flex-1 text-left">
      <div className="font-medium">{profile?.first_name}</div>
      <div className="text-sm text-gray-400">Student</div>
    </div>
    <motion.div
      animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
      transition={{ duration: 0.3 }}
      className="hidden lg:block"
    >
      <Settings className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
    </motion.div>
  </motion.button>

  {/* User Menu */}
  <UserMenu
    isOpen={isUserMenuOpen}
    onClose={() => setIsUserMenuOpen(false)}
    profile={profile!}
    onUpdateProfile={handleUpdateProfile}
  />
</motion.div>
     </motion.div>
     {/* Main Content Area */}
     <div className="flex-1 p-8">
       <AnimatePresence mode="wait">
         {/* Overview/Dashboard View */}
         {activeView === 'overview' && (
           <motion.div
             key="overview"
             initial="initial"
             animate="animate"
             exit="exit"
             variants={pageTransition}
             className="space-y-8"
           >
             {/* Welcome Section */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-6
                        border border-blue-500/20"
             >
               <motion.div variants={itemVariants} className="flex items-center gap-4">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                   <GraduationCap className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold text-white">Welcome back, {profile?.first_name}!</h1>
                   <p className="text-gray-400">Select a subject to begin your IB practice session.</p>
                 </div>
               </motion.div>
             </motion.div>


             {/* Subjects Grid */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
             >
               {profile?.subjects.map((subject) => {
                 const SubjectIcon = getSubjectIcon(subject.name);
                 const content = getSubjectContent(subject.name);
                 return (
                   <motion.button
                     key={subject.id}
                     variants={itemVariants}
                     whileHover={{ y: -4, scale: 1.02 }}
                     whileTap={{ scale: 0.98 }}
                     onClick={(e) => handleSubjectSelect(e, subject)}
                     className="p-6 rounded-2xl bg-[#1e293b]/50 border border-white/10 text-left
                              hover:bg-[#1e293b]/70 hover:border-white/20 transition-all duration-300"
                   >
                     <div className="flex items-center gap-4 mb-4">
                       <motion.div
                         whileHover={{ rotate: 15 }}
                         className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500"
                       >
                         <SubjectIcon className="w-6 h-6 text-white" />
                       </motion.div>
                       <div>
                         <h3 className="text-lg font-semibold text-white">{subject.name}</h3>
                         <p className="text-sm text-gray-400">{subject.level} • Group {subject.group}</p>
                       </div>
                     </div>
                    
                     <p className="text-sm text-gray-400 mb-4">{content.description}</p>
                    
                     <div className="mt-auto flex items-center justify-between text-sm">
                       <span className="text-blue-400 group-hover:translate-x-1 transition-transform">
                         View practice options →
                       </span>
                     </div>
                   </motion.button>
                 );
               })}
             </motion.div>
           </motion.div>
         )}


         {/* Subject Detail View */}
         {activeView === 'subject-detail' && selectedSubject && subjectContent && (
           <motion.div
             key="subject-detail"
             initial="initial"
             animate="animate"
             exit="exit"
             variants={pageTransition}
           >
             {/* Subject Header */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="mb-8"
             >
               <motion.div variants={itemVariants} className="flex items-center gap-4">
                 <motion.div
                   whileHover={{ rotate: 15 }}
                   transition={{ type: "spring", stiffness: 300 }}
                   className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500
                            flex items-center justify-center"
                 >
                   {React.createElement(getSubjectIcon(selectedSubject.name), {
                     className: "w-6 h-6 text-white"
                   })}
                 </motion.div>
                 <div>
                   <div className="flex items-center gap-3">
                     <h1 className="text-2xl font-bold text-white">
                       {subjectContent.title}
                     </h1>
                     <span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white">
                       {selectedSubject.level}
                     </span>
                   </div>
                   <p className="text-gray-400">
                     {subjectContent.description}
                   </p>
                 </div>
               </motion.div>
             </motion.div>


             {/* Feature Grid */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
             >
               {subjectContent.features.map((feature) => (
                 <motion.button
                   key={feature.title}
                   variants={itemVariants}
                   whileHover={{ y: -4, scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={(e) => {
                     e.preventDefault();
                     setActiveView('practice');
                   }}
                   className="group p-6 rounded-2xl bg-[#1e293b]/50 border border-white/10 text-left
                            hover:bg-[#1e293b]/70 hover:border-blue-500/20 transition-all duration-300
                            relative overflow-hidden"
                 >
                   <div className="flex items-center gap-4 mb-4">
                     <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                       <feature.icon className="w-6 h-6 text-white" />
                     </div>
                     <div>
                       <h3 className="text-lg font-semibold text-white group-hover:text-blue-400
                                  transition-colors">
                         {feature.title}
                       </h3>
                       <p className="text-sm text-gray-400">{feature.description}</p>
                     </div>
                   </div>


                   <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r
                               from-blue-500 to-indigo-500 transform scale-x-0
                               group-hover:scale-x-100 transition-transform origin-left" />
                 </motion.button>
               ))}
             </motion.div>


             {/* Resources Section */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="rounded-2xl bg-[#1e293b]/30 border border-white/5 p-6"
             >
               <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                   <BookOpen className="w-5 h-5 text-gray-400" />
                   <h2 className="text-lg font-semibold text-gray-300">Additional Resources</h2>
                 </div>
                 <motion.div
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex items-center gap-2"
                 >
                   <Lock className="w-3 h-3 text-gray-400" />
                   <span className="px-2 py-1 rounded-full text-xs bg-white/5 text-gray-400">
                     Coming Soon
                   </span>
                 </motion.div>
               </motion.div>


               <motion.div
                 variants={itemVariants}
                 className="h-32 rounded-lg border border-dashed border-white/5
                          flex items-center justify-center text-gray-500"
               >
                 <p className="text-center">
                   Past papers, mark schemes, and study materials<br />
                   will be available here soon
                 </p>
               </motion.div>
             </motion.div>
           </motion.div>
         )}


         {/* Practice View */}
         {activeView === 'practice' && selectedSubject && subjectContent && (
           <motion.div
             key="practice"
             initial="initial"
             animate="animate"
             exit="exit"
             variants={pageTransition}
             className="space-y-6"
           >
             {/* Practice Header */}
             <motion.div
               variants={containerVariants}
               initial="hidden"
               animate="show"
               className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-2xl p-6
                        border border-blue-500/20"
             >
               <motion.div variants={itemVariants} className="flex items-center gap-4">
                 <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500">
                   <Brain className="w-6 h-6 text-white" />
                 </div>
                 <div>
                   <h1 className="text-2xl font-bold text-white">Practice Session</h1>
                   <p className="text-gray-400">
                     {selectedSubject.name} ({selectedSubject.level})
                   </p>
                 </div>
               </motion.div>
             </motion.div>


           {/* Practice Interface */}
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="show"
  className="space-y-6"
>
  {/* Practice Types */}
  <motion.div
    variants={itemVariants}
    className="grid grid-cols-1 md:grid-cols-2 gap-4"
  >
    {/* Timed Practice */}
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl bg-[#1e293b]/50 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Clock className="w-5 h-5 text-blue-400" />
        </div>
        <h3 className="font-medium text-white">Timed Practice</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Practice under exam conditions with a timer. Great for exam preparation.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => handlePracticeStart(e, selectedSubject, 'timed')}
        className="w-full px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 
                 hover:bg-blue-500/30 transition-colors text-sm font-medium"
      >
        Start Timed Session
      </motion.button>
    </motion.div>

    {/* Free Practice */}
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="p-6 rounded-2xl bg-[#1e293b]/50 border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-indigo-500/20">
          <BookOpen className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="font-medium text-white">Free Practice</h3>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        Practice at your own pace with step-by-step guidance and explanations.
      </p>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={(e) => handlePracticeStart(e, selectedSubject, 'free')}
        className="w-full px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 
                 hover:bg-indigo-500/30 transition-colors text-sm font-medium"
      >
        Start Free Session
      </motion.button>
    </motion.div>
  </motion.div>

  {/* Selected Topics */}
  <motion.div
    variants={itemVariants}
    className="rounded-2xl bg-[#1e293b]/50 border border-white/10 p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Target className="w-5 h-5 text-purple-400" />
        </div>
        <h3 className="font-medium text-white">Selected Topics</h3>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-400
                 hover:bg-white/10 transition-colors"
      >
        Edit Topics
      </motion.button>
    </div>
    <div className="flex flex-wrap gap-2">
      {['All Topics', 'Recent', 'Favorites'].map((topic) => (
        <span
          key={topic}
          className="px-3 py-1.5 rounded-lg bg-white/5 text-sm text-gray-400"
        >
          {topic}
        </span>
      ))}
    </div>
  </motion.div>

  {/* Quick Start */}
  <motion.div
    variants={itemVariants}
    className="rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 
               border border-blue-500/20 p-6 text-center"
  >
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => handlePracticeStart(e, selectedSubject, 'quick')}
      className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500
               text-white font-semibold text-lg shadow-lg shadow-blue-500/20"
    >
      Quick Start Practice
    </motion.button>
    <p className="text-gray-400 mt-4">
      Start a balanced practice session with mixed topics and difficulty levels
    </p>
  </motion.div>
</motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   </div>
 );
};
//testing 
export default Dashboard;
