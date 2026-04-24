const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
import { getTrustedDeviceToken, setTrustedDeviceToken } from '../utils/trustedDevice';

const scopeHeader = (scope) => (scope ? { 'X-Auth-Scope': scope } : {});
export const getStoredToken = (scope) => {
  if (scope === 'admin') return localStorage.getItem('adminToken');
  if (scope === 'sales_staff') return localStorage.getItem('staffToken');
  return localStorage.getItem('token');
};

const setStoredToken = (scope, token) => {
  const key = scope === 'admin' ? 'adminToken' : scope === 'sales_staff' ? 'staffToken' : 'token';
  if (token) {
    localStorage.setItem(key, token);
    return;
  }
  localStorage.removeItem(key);
};

const REFRESH_EXCLUDED_PATHS = new Set([
  '/auth/login',
  '/auth/sign-in',
  '/auth/register',
  '/auth/sign-up',
  '/auth/logout',
  '/auth/trusted-session',
  '/auth/admin/mfa/verify-login',
]);

const refreshInFlightByScope = new Map();

const baseFetch = (path, scope, headers, rest, token) =>
  fetch(`${API_URL}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      ...scopeHeader(scope),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

const refreshTrustedSession = async (scope) => {
  const trustedDeviceToken = getTrustedDeviceToken(scope);
  if (!trustedDeviceToken) return false;

  if (refreshInFlightByScope.has(scope)) {
    return refreshInFlightByScope.get(scope);
  }

  const refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/auth/trusted-session`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...scopeHeader(scope),
        },
        body: JSON.stringify({ trustedDeviceToken }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.token) {
        if (response.status === 401 || response.status === 403) {
          setStoredToken(scope, '');
          setTrustedDeviceToken(scope, '');
        }
        return false;
      }
      setStoredToken(scope, data.token);
      if (data.trustedDeviceToken) {
        setTrustedDeviceToken(scope, data.trustedDeviceToken);
      }
      return true;
    } catch (error) {
      return false;
    } finally {
      refreshInFlightByScope.delete(scope);
    }
  })();

  refreshInFlightByScope.set(scope, refreshPromise);
  return refreshPromise;
};

export const authFetch = (path, options = {}) => {
  const { scope = 'user', headers = {}, ...rest } = options;
  const run = async () => {
    const token = getStoredToken(scope);
    let response = await baseFetch(path, scope, headers, rest, token);

    if (
      response.status === 401 &&
      !REFRESH_EXCLUDED_PATHS.has(path) &&
      (scope === 'user' || scope === 'sales_staff' || scope === 'admin')
    ) {
      const refreshed = await refreshTrustedSession(scope);
      if (refreshed) {
        response = await baseFetch(path, scope, headers, rest, getStoredToken(scope));
      }
    }

    return response;
  };

  return run();
};

export { API_URL };
