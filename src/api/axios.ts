import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // Backend adresin
});

// Her istekte token'ı otomatik ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Login olurken 'token' ismiyle mi kaydettin?
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;