import axios, { type AxiosInstance, AxiosError } from "axios";

// creates axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5002/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// request interceptor - adds token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// response interceptor - handles errors globally
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if(error.response?.status === 401) {
      // unauthorized -> clears token and redirects to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;