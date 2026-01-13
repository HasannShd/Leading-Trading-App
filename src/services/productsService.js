import axios from 'axios';
import { products } from './dataService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// PUBLIC
export const fetchProducts = (params = {}) =>
  axios.get(`${API_URL}/products`, { params });

export const fetchProduct = (id) =>
  axios.get(`${API_URL}/products/${id}`);

// Get products by category (sync from local data)
export const getProductsByCategory = (categorySlug) =>
  products.filter(p => p.category === categorySlug);

// ADMIN
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
});

export const createProduct = (data) =>
  axios.post(`${API_URL}/products`, data, authHeaders());

export const updateProduct = (id, data) =>
  axios.put(`${API_URL}/products/${id}`, data, authHeaders());

export const deleteProduct = (id) =>
  axios.delete(`${API_URL}/products/${id}`, authHeaders());
