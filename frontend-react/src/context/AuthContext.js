import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    
    if (token && username) {
      setUser({ username, token });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password
      });

      const { token, username: userUsername } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('username', userUsername);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ username: userUsername, token });
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:8080/auth/register', userData);
      
      if (response.data) {
        return { success: true, message: 'Registration successful' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: typeof error.response?.data === 'string' 
          ? error.response.data 
          : error.response?.data?.message || error.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
