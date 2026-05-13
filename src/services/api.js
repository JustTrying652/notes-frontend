import axios from 'axios';

const API_URL = 'https://notes-api-5r7i.onrender.com';

const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);
export const refresh = () => api.post('/auth/refresh', {}, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
  }
});

// Notes
export const getNotes = (page = 1, perPage = 5, search = '') =>
  api.get(`/notes/?page=${page}&per_page=${perPage}&search=${search}`);
export const getNote = (id) => api.get(`/notes/${id}`);
export const createNote = (data) => api.post('/notes/', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);