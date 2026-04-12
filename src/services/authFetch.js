const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const scopeHeader = (scope) => (scope ? { 'X-Auth-Scope': scope } : {});

export const authFetch = (path, options = {}) => {
  const { scope = 'user', headers = {}, ...rest } = options;
  return fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...rest,
    headers: {
      ...scopeHeader(scope),
      ...headers,
    },
  });
};

export { API_URL };
