// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import DevelopersPage from "./pages/DevelopersPage";
import DevelopersProfile from "./pages/DevelopersProfile";
import RegisterPage from "./pages/RegisterPage";
import PublicRoute from "./components/PublicRoute";
import MessagesPage from "./pages/MessagesPage";

function App() {
  return (
    <Routes>
      {/* Default route → go to /login for now */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Login route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developers"
        element={
          <ProtectedRoute>
            <DevelopersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/developers/:id"
        element={
          <ProtectedRoute>
            <DevelopersProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <MessagesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
