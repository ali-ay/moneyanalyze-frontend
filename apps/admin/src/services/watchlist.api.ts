/**
 * Watchlist Service
 * Kullanıcının takip ettiği coinleri localStorage'da yönetir.
 * Her coin için ekleme tarihi ve o anki fiyatı da saklar.
 * Backend API hazır olduğunda burası kolayca değiştirilebilir.
 */

const CRYPTO_STORAGE_KEY = 'moneyanalyze_watchlist_crypto';
const STOCK_STORAGE_KEY = 'moneyanalyze_watchlist_stock';

export interface WatchlistItem {
  symbol: string;
  addedPrice: number;
  addedAt: string; // ISO date string
  isOpportunity?: boolean;
  strengthScore?: number;
  signalType?: string;
}

const getStorageKey = (marketMode: 'crypto' | 'stock' = 'crypto'): string => {
  return marketMode === 'stock' ? STOCK_STORAGE_KEY : CRYPTO_STORAGE_KEY;
};

export const getWatchlist = (marketMode: 'crypto' | 'stock' = 'crypto'): WatchlistItem[] => {
  try {
    const storageKey = getStorageKey(marketMode);
    const data = localStorage.getItem(storageKey);
    if (!data) return [];
    const parsed = JSON.parse(data);

    // Eski format (string[]) tamamen temizle — fiyat/tarih bilgisi olmadan anlamsız
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      localStorage.removeItem(storageKey);
      return [];
    }

    // Fiyat bilgisi olmayan (eski sistemden kalan) kayıtları otomatik temizle
    const valid = parsed.filter((item: WatchlistItem) => item.addedPrice > 0);
    if (valid.length !== parsed.length) {
      localStorage.setItem(storageKey, JSON.stringify(valid));
    }

    return valid;
  } catch {
    return [];
  }
};

export const getWatchlistSymbols = (marketMode: 'crypto' | 'stock' = 'crypto'): string[] => {
  return getWatchlist(marketMode).map(item => item.symbol);
};

export const addToWatchlist = (symbol: string, price: number, marketMode: 'crypto' | 'stock' = 'crypto', addedAt?: string): WatchlistItem[] => {
  const storageKey = getStorageKey(marketMode);
  const current = getWatchlist(marketMode);
  if (!current.find(item => item.symbol === symbol)) {
    const newItem: WatchlistItem = {
      symbol,
      addedPrice: price,
      addedAt: addedAt || new Date().toISOString(),
    };
    const updated = [...current, newItem];
    localStorage.setItem(storageKey, JSON.stringify(updated));
    return updated;
  }
  return current;
};

export const removeFromWatchlist = (symbol: string, marketMode: 'crypto' | 'stock' = 'crypto'): WatchlistItem[] => {
  const storageKey = getStorageKey(marketMode);
  const current = getWatchlist(marketMode);
  const updated = current.filter(item => item.symbol !== symbol);
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return updated;
};

export const isInWatchlist = (symbol: string, marketMode: 'crypto' | 'stock' = 'crypto'): boolean => {
  return getWatchlist(marketMode).some(item => item.symbol === symbol);
};

export const getWatchlistItem = (symbol: string, marketMode: 'crypto' | 'stock' = 'crypto'): WatchlistItem | undefined => {
  return getWatchlist(marketMode).find(item => item.symbol === symbol);
};

export const updateWatchlistItem = (symbol: string, updates: Partial<WatchlistItem>, marketMode: 'crypto' | 'stock' = 'crypto'): WatchlistItem[] => {
  const storageKey = getStorageKey(marketMode);
  const current = getWatchlist(marketMode);
  const updated = current.map(item => 
    item.symbol === symbol ? { ...item, ...updates } : item
  );
  localStorage.setItem(storageKey, JSON.stringify(updated));
  return updated;
};
