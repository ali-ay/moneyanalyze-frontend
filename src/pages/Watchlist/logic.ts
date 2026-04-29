import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../app/providers/NotificationContext';
import { useMarketMode } from '../../context/MarketModeContext';

export interface WatchlistItem {
  symbol: string;
  price: number;
  priceChangePercent?: number;
  addedPrice?: number;
  addedAt?: string;
}

export const useWatchlistLogic = () => {
  const { showNotification } = useNotification();
  const { mode } = useMarketMode();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchWatchlist = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const response = await api.get(`/watchlist?market=${mode}`, { signal: controller.signal });
      if (response.data.success) {
        setWatchlist(response.data.data);
      }
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      if (error?.response?.status !== 401) {
        showNotification('Takip listesi yüklenirken bir hata oluştu.', 'error');
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [showNotification, mode]);

  useEffect(() => {
    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 60000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchWatchlist]);

  const handleRemove = useCallback(async (symbol: string) => {
    try {
      await api.delete(`/watchlist/${symbol}`);
      setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
      showNotification(`${symbol} takip listesinden kaldırıldı.`, 'success');
    } catch (error: any) {
      showNotification('Kaldırılırken hata oluştu.', 'error');
    }
  }, [showNotification]);

  const handleAdd = useCallback(async (symbol: string) => {
    try {
      const response = await api.post('/watchlist', { symbol, market: mode });
      if (response.data.success) {
        await fetchWatchlist();
        showNotification(`${symbol} takip listesine eklendi.`, 'success');
      }
    } catch (error: any) {
      showNotification('Eklenirken hata oluştu.', 'error');
    }
  }, [showNotification, mode, fetchWatchlist]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortable = [...watchlist];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof WatchlistItem];
        const bVal = b[sortConfig.key as keyof WatchlistItem];

        if (aVal && bVal) {
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortable;
  }, [watchlist, sortConfig]);

  return {
    watchlist: sortedData,
    loading,
    sortConfig,
    requestSort,
    handleRemove,
    handleAdd,
    fetchWatchlist,
    mode,
    currency: (mode === 'stock' ? '₺' : '$') as '$' | '₺'
  };
};
