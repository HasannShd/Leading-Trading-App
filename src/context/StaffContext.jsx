import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { portalApi } from '../services/portalApi';
import { authFetch, getStoredToken } from '../services/authFetch';
import { getTokenExpiryMs, isTokenExpired } from '../utils/sessionToken';
import { storePasswordCredential } from '../utils/credentialStore';

export const StaffContext = createContext();

const STAFF_TOKEN_KEY = 'staffToken';
const STAFF_PROFILE_KEY = 'staffProfile';
const STAFF_LOGIN_AT_KEY = 'staffLoginAt';

const readStoredStaff = () => {
  try {
    const token = getStoredToken('sales_staff');
    const profile = JSON.parse(localStorage.getItem(STAFF_PROFILE_KEY) || 'null');
    if (token && profile?.role === 'sales_staff') return profile;
  } catch (error) {
    localStorage.removeItem(STAFF_PROFILE_KEY);
  }
  return null;
};

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState(() => readStoredStaff());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sessionRequestIdRef = useRef(0);
  const staffRef = useRef(staff);

  useEffect(() => {
    staffRef.current = staff;
  }, [staff]);

  const fetchMe = useCallback(async () => {
    const requestId = ++sessionRequestIdRef.current;
    setError(null);
    if (!getStoredToken('sales_staff')) {
      setStaff(null);
      setLoading(false);
      return;
    }
    try {
      const response = await authFetch('/auth/me', { scope: 'sales_staff' });
      const data = await response.json();
      if (requestId !== sessionRequestIdRef.current) return;
      if (!response.ok || data.user?.role !== 'sales_staff') {
        if (staffRef.current && getStoredToken('sales_staff')) {
          localStorage.removeItem(STAFF_LOGIN_AT_KEY);
          setError(null);
          return;
        }
        localStorage.removeItem(STAFF_TOKEN_KEY);
        localStorage.removeItem(STAFF_PROFILE_KEY);
        localStorage.removeItem(STAFF_LOGIN_AT_KEY);
        setStaff(null);
        return;
      }
      localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(data.user));
      localStorage.removeItem(STAFF_LOGIN_AT_KEY);
      setStaff(data.user);
    } catch (err) {
      if (requestId !== sessionRequestIdRef.current) return;
      if (localStorage.getItem(STAFF_TOKEN_KEY)) {
        setError('Could not verify the staff session. Check the connection and try again.');
      } else {
        setStaff(null);
      }
    } finally {
      if (requestId === sessionRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    const token = getStoredToken('sales_staff');
    if (!token) {
      setError(null);
      return undefined;
    }
    if (isTokenExpired(token)) {
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_PROFILE_KEY);
      localStorage.removeItem(STAFF_LOGIN_AT_KEY);
      setStaff(null);
      setLoading(false);
      setError('Your session expired. Please sign in again.');
      return undefined;
    }
    const expiry = getTokenExpiryMs(token);
    if (!expiry) return undefined;
    const timeout = window.setTimeout(() => {
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_PROFILE_KEY);
      localStorage.removeItem(STAFF_LOGIN_AT_KEY);
      setStaff(null);
      setError('Your session expired. Please sign in again.');
    }, Math.max(expiry - Date.now(), 0));
    return () => window.clearTimeout(timeout);
  }, [staff]);

  const login = async (identifier, password) => {
    sessionRequestIdRef.current += 1;
    setLoading(true);
    setError(null);
    localStorage.removeItem(STAFF_TOKEN_KEY);
    localStorage.removeItem(STAFF_PROFILE_KEY);
    localStorage.removeItem(STAFF_LOGIN_AT_KEY);
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

      localStorage.setItem(STAFF_TOKEN_KEY, data.token);
      localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(data.user));
      localStorage.setItem(STAFF_LOGIN_AT_KEY, String(Date.now()));
      setStaff(data.user);
      storePasswordCredential({
        identifier,
        password,
        name: data.user?.name || data.user?.username || identifier,
      }).catch(() => {});
      return true;
    } catch (err) {
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_PROFILE_KEY);
      localStorage.removeItem(STAFF_LOGIN_AT_KEY);
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
      localStorage.removeItem(STAFF_TOKEN_KEY);
      localStorage.removeItem(STAFF_PROFILE_KEY);
      localStorage.removeItem(STAFF_LOGIN_AT_KEY);
      setStaff(null);
    }
  };

  return (
    <StaffContext.Provider value={{ staff, loading, error, login, logout, refreshProfile: fetchMe, api: portalApi }}>
      {children}
    </StaffContext.Provider>
  );
};
