import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('blog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function assetUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

export default api;
