import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authFetch, getStoredToken } from '../services/authFetch';
import { getTokenExpiryMs, isTokenExpired } from '../utils/sessionToken';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mfaChallenge, setMfaChallenge] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isVisibleAdminRoute = location.pathname.startsWith('/admin');
  const adminLoginPath = isVisibleAdminRoute ? '/admin/login' : '/.well-known/admin-access-sh123456';
  const adminAccountPath = isVisibleAdminRoute ? '/admin/account' : '/.well-known/admin-account-sh123456';
  const isAdminRoute = location.pathname.startsWith('/.well-known/') || isVisibleAdminRoute;

  const applyAdminSession = (token, user) => {
    if (token) {
      localStorage.setItem('adminToken', token);
    }
    setAdmin(user || null);
    setMfaChallenge(null);
    setError(null);
  };

  const resetAdminSession = (shouldRedirect = true) => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminTrustedDeviceToken');
    setAdmin(null);
    setError(null);
    if (shouldRedirect && isAdminRoute && location.pathname !== adminLoginPath) {
      navigate(adminLoginPath, { replace: true });
    }
  };

  // Prevent access to admin pages without authentication
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      (location.pathname.includes('.well-known/admin') || location.pathname.startsWith('/admin'))
    ) {
      if (!admin && !loading && location.pathname !== adminLoginPath) {
        navigate(adminLoginPath, { replace: true });
      }
    }
  }, [admin, adminLoginPath, loading, location.pathname, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyAdmin();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = getStoredToken('admin');
    if (!token) return undefined;
    if (isTokenExpired(token)) {
      resetAdminSession(false);
      setLoading(false);
      return undefined;
    }

    const expiry = getTokenExpiryMs(token);
    if (!expiry) return undefined;
    const timeout = window.setTimeout(() => {
      resetAdminSession();
      setError('Your admin session expired. Please sign in again.');
    }, Math.max(expiry - Date.now(), 0));
    return () => window.clearTimeout(timeout);
  }, [admin, location.pathname]);

  const verifyAdmin = async () => {
    try {
      const response = await authFetch('/auth/me', { scope: 'admin' });
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'admin') {
          applyAdminSession(null, data.user);
        } else {
          resetAdminSession(false);
        }
      } else {
        resetAdminSession(false);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      setError('Could not verify the admin session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const trustedDeviceToken = localStorage.getItem('adminTrustedDeviceToken') || '';
      const response = await authFetch('/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ identifier: username, password, trustedDeviceToken }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.err || 'Login failed');
        return false;
      }

      if (data.mfaRequired && data.challengeToken) {
        setMfaChallenge(data.challengeToken);
        return 'mfa_required';
      }

      if (!data.token || !data.user || data.user.role !== 'admin') {
        resetAdminSession();
        setError('Only admins can access this area');
        return false;
      }

      applyAdminSession(data.token, data.user);
      if (!data.user.mfaEnabled) {
        setError('MFA is recommended for this admin account. You can set it up from the Account page.');
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyMfa = async (code, trustDevice = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/auth/admin/mfa/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ challengeToken: mfaChallenge, code, trustDevice }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'MFA verification failed');
        return false;
      }
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      if (data.trustedDeviceToken) {
        localStorage.setItem('adminTrustedDeviceToken', data.trustedDeviceToken);
      }
      applyAdminSession(data.token, data.user);
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
      await authFetch('/auth/logout', { method: 'POST', scope: 'admin' });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      resetAdminSession();
      setMfaChallenge(null);
    }
  };

  return (
    <AdminContext.Provider value={{ admin, loading, error, login, logout, mfaChallenge, verifyMfa, mfaSetupRequired: Boolean(admin && admin.role === 'admin' && !admin.mfaEnabled), adminAccountPath }}>
      {children}
    </AdminContext.Provider>
  );
};
