import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. create context
const AuthContext = createContext(null);

// 2. custom hook
export const useAuth = () => useContext(AuthContext);

// 3. provider
export const AuthProvider = ({ children }) => {
  // read once from localStorage
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // keep localStorage in sync with token
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // keep localStorage in sync with user
  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // login: caller passes { token, user }
  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
  };


  //updating the user with all values from profile edit
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  }

  // logout clears state and storage
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
