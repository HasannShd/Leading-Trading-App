import { createContext, useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { portalApi } from '../services/portalApi';
import { authFetch, getStoredToken } from '../services/authFetch';
import { getTokenExpiryMs } from '../utils/sessionToken';
import { storePasswordCredential } from '../utils/credentialStore';

export const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  const clearStaffSession = useCallback((message = '') => {
    localStorage.removeItem('staffToken');
    setStaff(null);
    setError(message);
  }, []);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('staffToken');
    try {
      const response = await authFetch('/auth/me', { scope: 'sales_staff' });
      const data = await response.json();
      if (!response.ok || data.user?.role !== 'sales_staff') {
        clearStaffSession(token && response.status === 401 ? 'Your session expired. Please sign in again.' : '');
        return;
      }
      setStaff(data.user);
      setError(null);
    } catch (err) {
      clearStaffSession('');
    } finally {
      setLoading(false);
    }
  }, [clearStaffSession]);

  useEffect(() => {
    if (isStaffRoute) {
      fetchMe();
    } else {
      setLoading(false);
    }
  }, [fetchMe, isStaffRoute]);

  useEffect(() => {
    const token = getStoredToken('sales_staff');
    if (!token) return undefined;
    const expiry = getTokenExpiryMs(token);
    if (!expiry) return undefined;
    const delay = expiry - Date.now();
    if (delay <= 0) {
      fetchMe();
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      fetchMe();
    }, delay);
    return () => window.clearTimeout(timeout);
  }, [fetchMe, staff]);

  const login = async (identifier, password) => {
    setLoading(true);
    setError(null);
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
        clearStaffSession('');
        throw new Error('Only staff accounts can access this area.');
      }

      localStorage.setItem('staffToken', data.token);
      setStaff(data.user);
      setLoading(false);
      storePasswordCredential({
        identifier,
        password,
        name: data.user?.name || data.user?.username || identifier,
      }).catch(() => {});
      return true;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authFetch('/auth/logout', { method: 'POST', scope: 'sales_staff' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      clearStaffSession('');
    }
  };

  return (
    <StaffContext.Provider value={{ staff, loading, error, login, logout, refreshProfile: fetchMe, api: portalApi }}>
      {children}
    </StaffContext.Provider>
  );
};
