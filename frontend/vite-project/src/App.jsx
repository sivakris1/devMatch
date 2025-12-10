// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Routes>
      {/* Default route → go to /login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Later we'll add /register, /profile, /developers etc. */}
    </Routes>
  );
}

export default App;
