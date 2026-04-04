import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const adminLoginPath = '/.well-known/admin-access-sh123456';
  const isAdminRoute = location.pathname.startsWith('/.well-known/');

  const resetAdminSession = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
    if (isAdminRoute && location.pathname !== adminLoginPath) {
      navigate(adminLoginPath, { replace: true });
    }
  };

  // Prevent access to admin pages without authentication
  useEffect(() => {
    if (typeof window !== 'undefined' && location.pathname.includes('.well-known/admin')) {
      const token = localStorage.getItem('adminToken');
      if (!token && location.pathname !== adminLoginPath) {
        navigate(adminLoginPath, { replace: true });
      }
    }
  }, [adminLoginPath, location.pathname, navigate]);

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
          resetAdminSession();
        }
      } else {
        resetAdminSession();
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      resetAdminSession();
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

      if (!meResponse.ok || meData.user.role !== 'admin') {
        resetAdminSession();
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
    resetAdminSession();
  };

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
