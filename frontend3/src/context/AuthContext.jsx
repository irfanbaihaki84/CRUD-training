import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/authService';

// 1. Buat context
const AuthContext = createContext();

// 2. Buat custom hook
export const useAuth = () => {
  return useContext(AuthContext);
};

// 3. Buat provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (username, password) => {
    try {
      const user = await auth.login(username, password);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const signup = async (email, password, name) => {
    try {
      const user = await auth.signup(email, password, name);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Signup failed',
      };
    }
  };

  const logout = () => {
    return auth.logout().then(() => {
      setCurrentUser(null);
    });
  };

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (user) {
      console.log('AuthContext', user);
      setCurrentUser(user);
    }
    setLoading(false);
  }, [setCurrentUser]);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Export sebagai named exports
export default { AuthContext, AuthProvider, useAuth };
