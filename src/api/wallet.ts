import api from './axios';

export const walletApi = {
  getPortfolio: () => api.get('/wallet/my-portfolio'),
  buyCoin: (data: { symbol: string; amount: number; price: number }) => 
    api.post('/wallet/buy', data),
  sellCoin: (data: { symbol: string; amount: number; price: number }) => 
    api.post('/wallet/sell', data),
  // Deposit'i buraya ekledik:
  depositMoney: (amount: number) => api.post('/wallet/deposit', { amount }),
};

// Dışarıdan hala bu isimle çağırmak istersen (Deposit.tsx için):
export const depositMoney = walletApi.depositMoney;