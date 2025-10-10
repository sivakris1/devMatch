import React from 'react'
import { useState, useEffect } from 'react';

const App = () => {

  const [isAuthenticated,setIsAuthenticated] = useState(false);
   const [user, setUser] = useState(null);
   const [isLoading,setIsLoading] = useState(true)

   useEffect(()=>{
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user')

    if(token && savedUser){
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    setIsLoading(false)
   },[])

   const handleLogin = (token,userData) =>{
    localStorage.setItem('token',token);
    localStorage.setItem('user',JSON.stringify(userData))
    setUser(userData);
    setIsAuthenticated(true);
   }

   const handleLogout = () =>{
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    setUser(null);
    setIsAuthenticated(false);
   }


   if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading DevMatch...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAuthenticated && user ? (
         <div className="p-8">
          <h1 className="text-3xl font-bold text-green-600">Welcome to DevMatch Dashboard!</h1>
          <p className="mt-4 text-lg">Hello, {user.name}!</p>
          <button 
            onClick={handleLogout}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="p-8">
          <h1 className="text-3xl font-bold text-blue-600">DevMatch Login</h1>
          <p className="mt-4 text-lg">Please login to continue...</p>
          <button 
            onClick={() => handleLogin('dummy-token', { name: 'Test User', email: 'test@example.com' })}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Test Login
          </button>
        </div>
      )
    }
      
    </div>
  )
}

export default App
