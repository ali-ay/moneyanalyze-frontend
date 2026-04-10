import axios from 'axios';

const API_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5001/api" 
  : "https://moneyanalyze-backend-eu.onrender.com/api"; // Canlıda bu adresi kullanacağız

const api = axios.create({
  baseURL: API_URL, // Backend adresin
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