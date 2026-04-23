import { createContext, useEffect, useState } from 'react';
import { portalApi } from '../services/portalApi';
import { authFetch, getStoredToken } from '../services/authFetch';
import { getTokenExpiryMs, isTokenExpired } from '../utils/sessionToken';
import { storePasswordCredential } from '../utils/credentialStore';

export const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = async () => {
    const token = localStorage.getItem('staffToken');
    try {
      const response = await authFetch('/auth/me', { scope: 'sales_staff' });
      const data = await response.json();
      if (!response.ok || data.user?.role !== 'sales_staff') {
        if (token) localStorage.removeItem('staffToken');
        setStaff(null);
        return;
      }
      setStaff(data.user);
    } catch (err) {
      if (localStorage.getItem('staffToken')) {
        setError('Could not verify the staff session. Check the connection and try again.');
      } else {
        setStaff(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  useEffect(() => {
    const token = getStoredToken('sales_staff');
    if (!token) return undefined;
    if (isTokenExpired(token)) {
      localStorage.removeItem('staffToken');
      setStaff(null);
      setLoading(false);
      setError('Your session expired. Please sign in again.');
      return undefined;
    }
    const expiry = getTokenExpiryMs(token);
    if (!expiry) return undefined;
    const timeout = window.setTimeout(() => {
      localStorage.removeItem('staffToken');
      setStaff(null);
      setError('Your session expired. Please sign in again.');
    }, Math.max(expiry - Date.now(), 0));
    return () => window.clearTimeout(timeout);
  }, [staff]);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
    localStorage.removeItem('staffToken');
    try {
      const response = await authFetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'sales_staff',
        body: JSON.stringify({ identifier, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.err || 'Login failed');
      if (!data.token || data.user?.role !== 'sales_staff') {
        throw new Error('Only staff accounts can access this area.');
      }

      localStorage.setItem('staffToken', data.token);
      setStaff(data.user);
      storePasswordCredential({
        identifier,
        password,
        name: data.user?.name || data.user?.username || identifier,
      }).catch(() => {});
      return true;
    } catch (err) {
      localStorage.removeItem('staffToken');
      setStaff(null);
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authFetch('/auth/logout', { method: 'POST', scope: 'sales_staff' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      localStorage.removeItem('staffToken');
      setStaff(null);
    }
  };

  return (
    <StaffContext.Provider value={{ staff, loading, error, login, logout, refreshProfile: fetchMe, api: portalApi }}>
      {children}
    </StaffContext.Provider>
  );
};
