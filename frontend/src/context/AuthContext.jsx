import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        let userData = JSON.parse(userInfo);
        if (userData && userData.name === 'Master Admin') {
          userData.name = 'Smriti Yadav';
        }
        setUser(userData);
      } catch (e) {
        console.error('Failed to parse stored userInfo', e);
        localStorage.removeItem('userInfo');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      
      if (!res.data || !res.data.user) {
        throw new Error('Invalid server response. Please verify your backend connection.');
      }

      const { token, user: userData } = res.data;
      if (userData && userData.name === 'Master Admin') {
        userData.name = 'Smriti Yadav';
      }
      
      const userInfo = { ...userData, token };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Server Error';
      console.error('Login method error:', message);
      throw new Error(message);
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.post('/auth/register', userData);
      if (!res.data || !res.data.user) {
        throw new Error('Registration failed. Invalid response from server.');
      }
      const { token, user: newUser } = res.data;
      if (newUser && newUser.name === 'Master Admin') {
        newUser.name = 'Smriti Yadav';
      }
      
      const userInfo = { ...newUser, token };
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
      setUser(userInfo);
      return userInfo;
    } catch (err) {
      console.error('Register method error:', err);
      throw err;
    }
  };

  const updateProfile = async (updates) => {
    const res = await api.put('/auth/profile', updates);
    const updatedUser = { ...user, ...res.data };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const updateAvatarState = (newAvatar) => {
    const updatedUser = { ...user, avatar: newAvatar };
    localStorage.setItem('userInfo', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, updateAvatarState, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
