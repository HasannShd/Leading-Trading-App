import { isTokenExpired } from '../utils/sessionToken';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getScope = (role) => {
  if (role === 'admin') return 'admin';
  if (role === 'sales_staff') return 'sales_staff';
  return 'user';
};

const getStoredToken = (role) => {
  const key = role === 'admin' ? 'adminToken' : role === 'sales_staff' ? 'staffToken' : 'token';
  const token = localStorage.getItem(key);
  if (token && isTokenExpired(token)) {
    localStorage.removeItem(key);
    return null;
  }
  return token;
};

const request = async ({ path, method = 'GET', role = 'sales_staff', body, isForm = false }) => {
  const headers = { 'X-Auth-Scope': getScope(role) };
  const token = getStoredToken(role);

  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    credentials: 'include',
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || data?.err || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const portalApi = {
  get: (path, role) => request({ path, role }),
  post: (path, body, role) => request({ path, method: 'POST', body, role }),
  patch: (path, body, role) => request({ path, method: 'PATCH', body, role }),
  uploadFile: async (file, role = 'sales_staff') => {
    const formData = new FormData();
    formData.append('image', file);
    const result = await request({ path: '/upload', method: 'POST', body: formData, role, isForm: true });
    return result?.url || result?.data?.url;
  },
};

export default portalApi;
