import { API_URL } from './authFetch';

const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || data?.err || 'Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
};

export const fetchCategories = () =>
  requestJson('/categories');

const authHeaders = () => ({
  headers: { 'X-Auth-Scope': 'admin' },
});

export const createCategory = (data) =>
  requestJson('/categories', {
    method: 'POST',
    ...authHeaders(),
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders().headers,
    },
    body: JSON.stringify(data),
  });

export const updateCategory = (id, data) =>
  requestJson(`/categories/${id}`, {
    method: 'PUT',
    ...authHeaders(),
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders().headers,
    },
    body: JSON.stringify(data),
  });

export const deleteCategory = (id) =>
  requestJson(`/categories/${id}`, {
    method: 'DELETE',
    ...authHeaders(),
  });
