import api from './apiClient';

export const authService = {
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials: any) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  }
};