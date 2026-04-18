import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        let userData = JSON.parse(storedUser);
        if (userData && userData.name === 'Master Admin') {
          userData.name = 'Smriti Yadav';
        }
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      
      if (!res.data || !res.data.user) {
        throw new Error('Invalid server response. Please verify your backend connection.');
      }

      const { token, user: userData } = res.data;
      if (userData && userData.name === 'Master Admin') {
        userData.name = 'Smriti Yadav';
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Login method error:', err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/api/auth/register', userData);
      if (!res.data || !res.data.user) {
        throw new Error('Registration failed. Invalid response from server.');
      }
      const { token, user: newUser } = res.data;
      if (newUser && newUser.name === 'Master Admin') {
        newUser.name = 'Smriti Yadav';
      }
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Register method error:', err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/api/auth/profile', updates);
    const updatedUser = { ...user, ...res.data };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const updateAvatarState = (newAvatar) => {
    const updatedUser = { ...user, avatar: newAvatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    api.defaults.headers.common['Authorization'] = '';
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, updateAvatarState, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
