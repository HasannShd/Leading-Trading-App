import { createContext, useState, useEffect } from 'react';
import { authFetch } from '../services/authFetch';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMe();
  }, []);

  const fetchMe = async () => {
    try {
      const response = await authFetch('/auth/me', { scope: 'user' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'user',
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Login failed');
        return false;
      }
      await fetchMe();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'user',
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Registration failed');
        return false;
      }
      await fetchMe();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authFetch('/auth/logout', { method: 'POST', scope: 'user' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
