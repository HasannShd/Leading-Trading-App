import { isTokenExpired } from '../utils/sessionToken';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const scopeHeader = (scope) => (scope ? { 'X-Auth-Scope': scope } : {});
export const getStoredToken = (scope) => {
  const key = scope === 'admin' ? 'adminToken' : scope === 'sales_staff' ? 'staffToken' : 'token';
  const token = localStorage.getItem(key);
  if (token && isTokenExpired(token)) {
    localStorage.removeItem(key);
    return null;
  }
  return token;
};

export const authFetch = (path, options = {}) => {
  const { scope = 'user', headers = {}, ...rest } = options;
  const token = getStoredToken(scope);
  return fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: {
      ...scopeHeader(scope),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
};

export { API_URL };
