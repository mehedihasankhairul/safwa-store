"use client";
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Set hydration flag first
    setIsHydrated(true);
    
    // Then check localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser && storedUser !== 'undefined') {
        try {
          setUser(JSON.parse(storedUser)); // Update user state from localStorage
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('user'); // Remove invalid data
        }
      }
    }
  }, []);


  const login = async (userData) => {
    try {
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData); // Update state immediately
    } catch (error) {
      console.error('Error during login:', error);
    }
  };


  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useAuthState = () => {
  const { user } = useAuth();
  return user;
};