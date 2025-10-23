import axios from 'axios';
import { getAuthToken, logout } from '../utils/Auth';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el Token en cada request
api.interceptors.request.use(config => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar tokens expirados/inválidos globalmente
api.interceptors.response.use(
  response => response,
  error => {
    // Si el error es 401 (Unauthorized), y no es la ruta de login, forzar logout
    if (error.response && error.response.status === 401 && error.config.url !== '/users/login/') {
      console.error('Token expirado o inválido. Cerrando sesión.');
      logout();
      window.location.href = '/login'; // Redirige al login
    }
    return Promise.reject(error);
  }
);

export default api;