import api from './apiClient'; // Axios instance dosyan

/**
 * Kullanıcının işlemlerinden hesaplanan gerçek portföyünü getirir.
 */
export const getPortfolio = async () => {
  // Wallet endpoint'i hem bakiyeyi hem de portföyü (assets) bir arada döner
  return await api.get('/wallet/my-portfolio');
};