import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const fetchCategories = () =>
  axios.get(`${API_URL}/categories`);

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` },
});

export const createCategory = (data) =>
  axios.post(`${API_URL}/categories`, data, authHeaders());

export const updateCategory = (id, data) =>
  axios.put(`${API_URL}/categories/${id}`, data, authHeaders());

export const deleteCategory = (id) =>
  axios.delete(`${API_URL}/categories/${id}`, authHeaders());
