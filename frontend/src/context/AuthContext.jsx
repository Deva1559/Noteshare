import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = authService.getToken();
    const savedUser = authService.getCurrentUser();
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.data) {
      setToken(res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.data) {
      setToken(res.data.token);
      setUser(res.data);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
    updateUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
