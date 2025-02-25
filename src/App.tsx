// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AnimatePresence } from 'framer-motion';
import Home2 from './pages/NewHome';


const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home2 />} />


          </Routes>
        </AnimatePresence>
 
      </div>
    </Router>
  );
};

export default App;