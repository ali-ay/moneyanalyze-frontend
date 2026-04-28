import api from './apiClient';
import type { AxiosRequestConfig } from 'axios';

/**
 * Kullanıcının işlemlerinden hesaplanan gerçek portföyünü getirir.
 * `config` ile AbortController signal vb. geçirilebilir.
 */
export const getPortfolio = async (config?: AxiosRequestConfig) => {
  // Wallet endpoint'i hem bakiyeyi hem de portföyü (assets) bir arada döner
  return await api.get('/wallet/my-portfolio', config);
};