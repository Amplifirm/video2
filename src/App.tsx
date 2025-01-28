import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import WelcomeScreen from './pages/WelcomePage';
import LoginPage from './pages/loginPage';
import Dashboard from './pages/Dashboard';
import PracticePage from './pages/PracticePage';
import FavoritesPage from './pages/FavoritesPage';
import ProfileSetup from './pages/ProfileSetup';
import EditProfile from './pages/EditProfile';
import InitialAssessment from './pages/InitialAssesment';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/favourites" 
          element={
            <ProtectedRoute>
              <FavoritesPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile-setup" 
          element={
            <ProtectedRoute>
              <ProfileSetup />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/initial" 
          element={
            <ProtectedRoute>
              <InitialAssessment />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* Updated practice routes */}
        <Route 
          path="/practice/:subjectId" 
          element={
            <ProtectedRoute>
              <PracticePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}