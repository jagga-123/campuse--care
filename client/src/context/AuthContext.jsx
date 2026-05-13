import { createContext, useContext, useEffect, useState } from 'react';
import { getApiBaseUrl } from '../utils/api';

const AuthContext = createContext();

const API_URL = getApiBaseUrl();

const normalizeNetworkError = (err, fallbackMessage) => {
  if (err?.message === 'Failed to fetch' || err?.name === 'TypeError') {
    return `Backend server not reachable at ${API_URL}. Start the server and make sure MongoDB is running.`;
  }

  return err?.message || fallbackMessage;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check user on app load
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch logged-in user profile
  const fetchProfile = async (token) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
      }
    } catch (err) {
      console.warn('Failed to fetch profile:', err.message);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name,
    email,
    password,
    role = 'student',
    department = 'General'
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          department
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data);

      return {
        success: true
      };
    } catch (err) {
      const message = normalizeNetworkError(err, 'Registration failed');
      setError(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data);

      return {
        success: true
      };
    } catch (err) {
      const message = normalizeNetworkError(err, 'Login failed');
      setError(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
