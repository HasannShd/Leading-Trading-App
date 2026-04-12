import { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authFetch } from '../services/authFetch';

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
  const isAdminRoute = location.pathname.startsWith('/.well-known/') || isVisibleAdminRoute;

  const resetAdminSession = (shouldRedirect = true) => {
    setAdmin(null);
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
    verifyAdmin();
  }, []);

  const verifyAdmin = async () => {
    try {
      const response = await authFetch('/auth/me', { scope: 'admin' });
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'admin') {
          setAdmin(data.user);
          setMfaChallenge(null);
        } else {
          resetAdminSession(false);
        }
      } else {
        resetAdminSession(false);
      }
    } catch (err) {
      console.error('Auth verification failed:', err);
      resetAdminSession(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ identifier: username, password }),
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

      const meResponse = await authFetch('/auth/me', { scope: 'admin' });
      const meData = await meResponse.json();

      if (!meResponse.ok || meData.user.role !== 'admin') {
        resetAdminSession();
        setError('Only admins can access this area');
        return false;
      }

      setAdmin(meData.user);
      setMfaChallenge(null);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verifyMfa = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authFetch('/auth/admin/mfa/verify-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        scope: 'admin',
        body: JSON.stringify({ challengeToken: mfaChallenge, code }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.err || 'MFA verification failed');
        return false;
      }
      setAdmin(data.user);
      setMfaChallenge(null);
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
    <AdminContext.Provider value={{ admin, loading, error, login, logout, mfaChallenge, verifyMfa }}>
      {children}
    </AdminContext.Provider>
  );
};
