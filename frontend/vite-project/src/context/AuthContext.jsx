import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    token ? localStorage.setItem("token", token)
          : localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    user ? localStorage.setItem("user", JSON.stringify(user))
         : localStorage.removeItem("user");
  }, [user]);

  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
