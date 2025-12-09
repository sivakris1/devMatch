import { createContext, useContext, useState, useEffect } from 'react';

// 1️⃣ Create the context object
const AuthContext = createContext(null);

// 2️⃣ Custom hook to use the context in components
export const useAuth = () => useContext(AuthContext);

// 3️⃣ Provider component that wraps the whole app
export const AuthProvider = ({ children }) => {
  // --- State setup with localStorage initial values ---

  // token state, initialized from localStorage if present
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // user state, also initialized from localStorage (parsed from JSON)
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // --- Sync token with localStorage whenever it changes ---
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  // --- Sync user with localStorage whenever it changes ---
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // --- Auth actions ---

  // Called after successful login / register
  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  // Called when user logs out
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // Value shared to all components using this context
  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
  };

  // Wrap children with the AuthContext provider
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
