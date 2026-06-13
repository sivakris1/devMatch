import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import socket from "../api/socket";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    token ? localStorage.setItem("token", token)
          : localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    user ? localStorage.setItem("user", JSON.stringify(user))
         : localStorage.removeItem("user");
  }, [user]);

  // Global socket presence lifecycle

  useEffect(()=> {
    if(user) {
      const userId = user._id || user.id
      
      socket.connect()

      //register our user ID as online
      const register = () => {
        socket.emit("register_user", userId)
        socket.emit("get_online_users");
      };

      if(socket.connected){
        register();
      }else{
        socket.on("connect", register)
      }

      // Receive the initial list of online users from the server
      socket.on("online_users_list", (usersList) => {
        setOnlineUsers(usersList);
      });

       // Listen to delta: a user went online
      socket.on("user_online", (newOnlineUserId) => {
        setOnlineUsers((prev) => {
          if (prev.includes(newOnlineUserId)) return prev;
          return [...prev, newOnlineUserId];
        });
      });

      //  Listen to delta: a user went offline
      socket.on("user_offline", (offlineUserId) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== offlineUserId));
      });

        return () => {
        socket.off("connect", register);
        socket.off("online_users_list");
        socket.off("user_online");
        socket.off("user_offline");
        socket.disconnect();
      };
    } else {
      setOnlineUsers([]);
      socket.disconnect();
    }

    
  },[user])

  
  // Sync user profile from database on page load/mount
  useEffect(() => {
    const syncProfile = async () => {
      if (token) {
        try {
          const res = await api.get('/profile');
          setUser(res.data.data);
        } catch (err) {
          console.error("Failed to sync profile:", err);
        }
      }
    };
    syncProfile();
  }, [token]);


  const login = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    toast.success("Logout Successful");
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, login, logout, onlineUsers, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
