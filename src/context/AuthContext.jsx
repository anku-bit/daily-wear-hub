import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('dwh_token');
    const saved = localStorage.getItem('dwh_user');
    if (token && saved) {
      setUser(JSON.parse(saved));
      // Verify token still valid
      authAPI.me().then(res => {
        setUser(res.data.user);
        localStorage.setItem('dwh_user', JSON.stringify(res.data.user));
      }).catch(() => {
        localStorage.removeItem('dwh_token');
        localStorage.removeItem('dwh_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    const { token, user } = res.data;
    localStorage.setItem('dwh_token', token);
    localStorage.setItem('dwh_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const register = async (name, email, password) => {
    const res = await authAPI.register({ name, email, password });
    const { token, user } = res.data;
    localStorage.setItem('dwh_token', token);
    localStorage.setItem('dwh_user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('dwh_token');
    localStorage.removeItem('dwh_user');
    setUser(null);
  };

  const updateUser = (updated) => {
    setUser(updated);
    localStorage.setItem('dwh_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
