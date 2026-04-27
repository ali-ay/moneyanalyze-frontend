// api/walletApi.ts
import api from './apiClient';

// Tipleri tanımlayalım (Hata payını sıfıra indirir)
export interface BuyCoinData {
  symbol: string;
  usdAmount: number;
  currentPrice: number;
}

export interface SellCoinData {
  symbol: string;
  currentPrice: number;
}

/**
 * Portföy Özeti
 */
export const getPortfolio = () => api.get('/wallet/my-portfolio');

/**
 * Coin Alım
 */
export const buyCoin = (data: BuyCoinData) => api.post('/wallet/buy', data);

/**
 * Coin Satış
 */
export const sellCoin = (data: SellCoinData) => api.post('/wallet/sell', data);

/**
 * İşlem Geçmişi
 */
export const getHistory = () => api.get('/transactions/history');

/**
 * Bakiye Yükleme
 * Not: Az önceki 400 hatasını almamak için parametreyi 'amount' olarak objede gönderiyoruz.
 */
export const depositMoney = (amount: number) => {
  return api.post('/wallet/deposit', { amount });
};

export const executeTrade = (symbol: string, side: 'BUY' | 'SELL', amount: number) => {
  return api.post('/wallet/trade', { symbol, side, amount });
};

// Toplu export
export const walletApi = {
  getPortfolio,
  buyCoin,
  sellCoin,
  getHistory,
  depositMoney,
  executeTrade
};