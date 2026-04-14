import { products } from './dataService';
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

// PUBLIC
export const fetchProducts = (params = {}) =>
  requestJson(`/products?${new URLSearchParams(params).toString()}`);

export const fetchProduct = (id) =>
  requestJson(`/products/${id}`);

// Get products by category (sync from local data)
export const getProductsByCategory = (categorySlug) =>
  products.filter(p => p.category === categorySlug);

// ADMIN
const authHeaders = () => ({
  headers: { 'X-Auth-Scope': 'admin' },
});

export const createProduct = (data) =>
  requestJson('/products', {
    method: 'POST',
    ...authHeaders(),
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders().headers,
    },
    body: JSON.stringify(data),
  });

export const updateProduct = (id, data) =>
  requestJson(`/products/${id}`, {
    method: 'PUT',
    ...authHeaders(),
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders().headers,
    },
    body: JSON.stringify(data),
  });

export const deleteProduct = (id) =>
  requestJson(`/products/${id}`, {
    method: 'DELETE',
    ...authHeaders(),
  });
