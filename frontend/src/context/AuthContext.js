import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);

  // Check for existing auth state when the app loads
  useEffect(() => {
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedPassword = localStorage.getItem('password');
    
    if (storedAuth === 'true' && storedPassword) {
      setIsAuthenticated(true);
      setPassword(storedPassword);
    }
    
    setLoading(false);
  }, []);

  const login = (enteredPassword) => {
    // Store in state
    setPassword(enteredPassword);
    setIsAuthenticated(true);
    
    // Persist in localStorage
    localStorage.setItem('password', enteredPassword);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    // Clear state
    setPassword('');
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('password');
    localStorage.removeItem('isAuthenticated');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, password, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};