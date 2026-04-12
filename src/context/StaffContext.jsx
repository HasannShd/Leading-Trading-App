import { createContext, useEffect, useState } from 'react';
import { portalApi } from '../services/portalApi';
import { authFetch } from '../services/authFetch';

export const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMe = async () => {
    try {
      const response = await authFetch('/auth/me', { scope: 'sales_staff' });
      const data = await response.json();
      if (!response.ok || data.user?.role !== 'sales_staff') {
        setStaff(null);
        return;
      }
      setStaff(data.user);
    } catch (err) {
      setStaff(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

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

      await fetchMe();
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
      setStaff(null);
    }
  };

  return (
    <StaffContext.Provider value={{ staff, loading, error, login, logout, refreshProfile: fetchMe, api: portalApi }}>
      {children}
    </StaffContext.Provider>
  );
};
