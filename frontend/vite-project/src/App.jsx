// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import DevelopersPage from './pages/DevelopersPage';
import DevelopersProfile from './pages/DevelopersProfile';

function App() {
  return (
    <Routes>
      {/* Default route → go to /login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login route */}
      <Route path="/login" element={<LoginPage />} />

      <Route path='/profile' element={
        <ProtectedRoute>
          <ProfilePage/>
        </ProtectedRoute>
      } />

      <Route path="/developers" element={<DevelopersPage />} />
      <Route path='/developers/:id' element={<DevelopersProfile/>} />

    </Routes>
  );
}

export default App;
