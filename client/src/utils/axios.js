import axios from 'axios';
import { getApiBaseUrl } from './api';

const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
