const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getStoredToken = (role) => {
  if (role === 'admin') return localStorage.getItem('adminToken');
  if (role === 'sales_staff') return localStorage.getItem('staffToken');
  return localStorage.getItem('token');
};

const request = async ({ path, method = 'GET', role = 'sales_staff', body, isForm = false }) => {
  const token = getStoredToken(role);
  const headers = {};

  if (!isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || data?.err || 'Request failed.');
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
