import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../app/providers/NotificationContext';
import { useMarketMode } from '../../context/MarketModeContext';

export interface WatchlistItem {
  id: string;
  symbol: string;
  period?: string;
  entryPrice?: number;
  currentPrice: number;
  profitPercent: number;
  priceChangePercent?: number;
  name: string;
  createdAt: string;
  aiData?: {
    targetPrice: number;
    stopLoss: number;
    potentialProfit: number;
  };
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

  const handleClearAll = useCallback(async () => {
    try {
      const response = await api.delete(`/watchlist/clear?market=${mode}`);
      const deleted = response.data?.data?.deleted ?? 0;
      setWatchlist([]);
      showNotification(
        deleted > 0
          ? `${deleted} öğe silindi. Liste temizlendi.`
          : 'Liste zaten boştu.',
        'success'
      );
    } catch (error: any) {
      showNotification('Liste temizlenemedi.', 'error');
    }
  }, [mode, showNotification]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const [filterPeriod, setFilterPeriod] = useState<string>('ALL');
  const [filterProfit, setFilterProfit] = useState<'ALL' | 'PROFIT' | 'LOSS' | 'NEUTRAL'>('ALL');
  const [filterSymbol, setFilterSymbol] = useState<string>('');

  const filteredAndSortedData = useMemo(() => {
    let data = [...watchlist];

    // Filter by period
    if (filterPeriod !== 'ALL') {
      data = data.filter(item => item.period === filterPeriod);
    }

    // Filter by symbol/name search
    if (filterSymbol.trim()) {
      const q = filterSymbol.trim().toLowerCase();
      data = data.filter(item =>
        item.symbol.toLowerCase().includes(q) || (item.name || '').toLowerCase().includes(q)
      );
    }

    // Filter by profit status
    if (filterProfit === 'PROFIT') {
      data = data.filter(i => (i.profitPercent || 0) > 0);
    } else if (filterProfit === 'LOSS') {
      data = data.filter(i => (i.profitPercent || 0) < 0);
    } else if (filterProfit === 'NEUTRAL') {
      data = data.filter(i => (i.profitPercent || 0) === 0);
    }

    // Sort
    if (sortConfig !== null) {
      data.sort((a, b) => {
        const aVal = a[sortConfig.key as keyof WatchlistItem];
        const bVal = b[sortConfig.key as keyof WatchlistItem];

        if (aVal !== undefined && bVal !== undefined) {
          if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [watchlist, sortConfig, filterPeriod, filterProfit, filterSymbol]);

  // Mevcut benzersiz periyotları bul (Filtre menüsü için)
  const availablePeriods = useMemo(() => {
    const periods = new Set(watchlist.map(item => item.period || 'Manuel'));
    return Array.from(periods).sort();
  }, [watchlist]);

  // Kümülatif kar/zarar özeti hesapla
  const summaryStats = useMemo(() => {
    const items = filteredAndSortedData.filter(i => i.entryPrice && i.currentPrice > 0);
    if (items.length === 0) return null;
    const totalProfit = items.reduce((sum, i) => sum + (i.profitPercent || 0), 0);
    return {
      total: items.length,
      avgProfit: parseFloat((totalProfit / items.length).toFixed(2)),
      profitable: items.filter(i => (i.profitPercent || 0) > 0).length,
      losing: items.filter(i => (i.profitPercent || 0) < 0).length,
      neutral: items.filter(i => (i.profitPercent || 0) === 0).length,
    };
  }, [filteredAndSortedData]);

  return {
    watchlist: filteredAndSortedData,
    loading,
    sortConfig,
    requestSort,
    handleRemove,
    handleAdd,
    handleClearAll,
    fetchWatchlist,
    mode,
    currency: (mode === 'stock' ? '₺' : '$') as '$' | '₺',
    filterPeriod,
    setFilterPeriod,
    filterProfit,
    setFilterProfit,
    filterSymbol,
    setFilterSymbol,
    availablePeriods,
    summaryStats
  };
};
