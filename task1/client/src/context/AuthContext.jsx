import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('blog_token');
    if (!token) {
      setReady(true);
      return;
    }
    api
      .get('/api/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => {
        localStorage.removeItem('blog_token');
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('blog_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/api/auth/register', { name, email, password });
    localStorage.setItem('blog_token', data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('blog_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, ready, login, register, logout, isAdmin: user?.role === 'admin' }),
    [user, ready]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
