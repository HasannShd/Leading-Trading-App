import { createContext, useState, useEffect } from 'react';
import { authFetch } from '../services/authFetch';
import { storePasswordCredential } from '../utils/credentialStore';
import { getTrustedDeviceToken, setTrustedDeviceToken } from '../utils/trustedDevice';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const trustedDeviceToken = getTrustedDeviceToken('user');
    if (token || trustedDeviceToken) {
      fetchMe(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchMe = async (token = localStorage.getItem('token')) => {
    if (!token && !getTrustedDeviceToken('user')) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const response = await authFetch('/auth/me', { scope: 'user' });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        if (response.status === 401) {
          setTrustedDeviceToken('user', '');
        }
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    try {
      const trustedDeviceToken = getTrustedDeviceToken('user');
      const response = await authFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'user',
        body: JSON.stringify({ identifier, password, trustedDeviceToken }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'Login failed');
        return false;
      }
      localStorage.setItem('token', data.token);
      if (data.trustedDeviceToken) {
        setTrustedDeviceToken('user', data.trustedDeviceToken);
      }
      await storePasswordCredential({
        identifier,
        password,
        name: data.user?.name || data.user?.username || identifier,
      });
      await fetchMe(data.token);
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
      localStorage.setItem('token', data.token);
      if (data.trustedDeviceToken) {
        setTrustedDeviceToken('user', data.trustedDeviceToken);
      }
      await fetchMe(data.token);
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
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
