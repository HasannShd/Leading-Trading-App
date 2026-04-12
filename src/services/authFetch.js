const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const scopeHeader = (scope) => (scope ? { 'X-Auth-Scope': scope } : {});
export const getStoredToken = (scope) => {
  if (scope === 'admin') return localStorage.getItem('adminToken');
  if (scope === 'sales_staff') return localStorage.getItem('staffToken');
  return localStorage.getItem('token');
};

export const authFetch = (path, options = {}) => {
  const { scope = 'user', headers = {}, ...rest } = options;
  const token = getStoredToken(scope);
  return fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      ...scopeHeader(scope),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });
};

export { API_URL };
