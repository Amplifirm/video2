import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/Home';
import Home2Page from './pages/Home2';
import HomeTestPage from './pages/hometest';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
      ease: "easeIn"
    }
  }
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.8, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="text-4xl font-light text-green-400"
    >
      GLA
    </motion.div>
  </div>
);

interface PageWrapperProps {
  children: React.ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          } 
        />
        
        <Route 
          path="/home2" 
          element={
            <PageWrapper>
              <Home2Page />
            </PageWrapper>
          } 
        />

        <Route 
          path="/hometest" 
          element={
            <PageWrapper>
              <HomeTestPage />
            </PageWrapper>
          } 
        />

        <Route 
          path="*" 
          element={
            <PageWrapper>
              <div className="min-h-screen bg-black flex items-center justify-center text-white">
                <div className="text-center">
                  <h1 className="text-4xl font-light mb-4">404 - Page Not Found</h1>
                  <p className="text-white/70 mb-8">The page you're looking for doesn't exist.</p>
                  <motion.a
                    href="/"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-block bg-green-400 text-black px-6 py-3 rounded-lg font-medium hover:bg-green-300 transition-colors"
                  >
                    Go Home
                  </motion.a>
                </div>
              </div>
            </PageWrapper>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <React.Suspense fallback={<LoadingScreen />}>
        <AnimatedRoutes />
      </React.Suspense>
    </Router>
  );
};

export default App;