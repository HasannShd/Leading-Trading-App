import { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Prevent access to admin pages without authentication
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('.well-known/admin')) {
      const token = localStorage.getItem('adminToken');
      if (!token && window.location.pathname !== '/.well-known/admin-access-sh123456') {
        window.location.href = '/.well-known/admin-access-sh123456';
      }
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyAdmin(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyAdmin = async (token) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'admin') {
          setAdmin(data.user);
        } else {
          localStorage.removeItem('adminToken');
        }
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      localStorage.removeItem('adminToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: username, password }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.err || 'Login failed');
        return false;
      }

      localStorage.setItem('adminToken', data.token);
      
      // Verify it's actually an admin
      const API_URL2 = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const meResponse = await fetch(`${API_URL2}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const meData = await meResponse.json();

      if (meData.user.role !== 'admin') {
        localStorage.removeItem('adminToken');
        setError('Only admins can access this area');
        return false;
      }

      setAdmin(meData.user);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
