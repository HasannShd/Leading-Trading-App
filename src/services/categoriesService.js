import axios from 'axios';
import { API_URL } from './authFetch';

export const fetchCategories = () =>
  axios.get(`${API_URL}/categories`);

const authHeaders = () => ({
  withCredentials: true,
  headers: { 'X-Auth-Scope': 'admin' },
});

export const createCategory = (data) =>
  axios.post(`${API_URL}/categories`, data, authHeaders());

export const updateCategory = (id, data) =>
  axios.put(`${API_URL}/categories/${id}`, data, authHeaders());

export const deleteCategory = (id) =>
  axios.delete(`${API_URL}/categories/${id}`, authHeaders());
