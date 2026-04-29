import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../../services/apiClient';
import { useNotification } from '../../../app/providers/NotificationContext';
import { useMarketMode } from '../../../context/MarketModeContext';

export const useWalletLogic = () => {
  const { showNotification } = useNotification();
  const { mode } = useMarketMode();

  // State
  const [stats, setStats] = useState<any>(null);
  const [livePrices, setLivePrices] = useState<{ [key: string]: number }>({});
  const [lastUpdates, setLastUpdates] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Refs
  const statsAbortRef = useRef<AbortController | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch portfolio stats (mode-aware)
  const fetchStats = useCallback(async () => {
    statsAbortRef.current?.abort();
    const controller = new AbortController();
    statsAbortRef.current = controller;

    try {
      setLoading(true);
      setLivePrices({});
      const response = await api.get(`/portfolio/stats?market=${mode}`, { signal: controller.signal });
      if (controller.signal.aborted) return;

      setStats(response.data.data || {});
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      if (err?.response?.status === 401) return;
      console.error('Portfolio stats fetch error:', err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [mode]);

  // Refetch on mount and when mode changes
  useEffect(() => {
    fetchStats();
    return () => statsAbortRef.current?.abort();
  }, [fetchStats]);

  // Get assets with live prices
  const assets = useMemo(() => {
    if (!stats?.assets) return [];
    return stats.assets.map((asset: any) => ({
      ...asset,
      symbol: asset.symbol.replace('USDT', ''),
      originalSymbol: asset.symbol
    }));
  }, [stats?.assets]);

  // Symbol list for WebSocket
  const symbolList = useMemo(() => {
    return assets.map(a => a.symbol).sort().join(',');
  }, [assets]);

  // WebSocket for crypto prices (only in crypto mode)
  useEffect(() => {
    if (mode !== 'crypto' || !symbolList) return;

    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;

    const connect = () => {
      if (cancelled) return;

      const streams = assets
        .filter(a => !a.originalSymbol.includes('.IS'))
        .map(a => `${a.symbol.toLowerCase()}usdt@ticker`)
        .join('/');

      if (!streams) return;

      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => { reconnectAttempts = 0; };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const data = message.data;
          if (data?.s && data?.c) {
            const cleanSymbol = data.s.replace('USDT', '');
            const newPrice = parseFloat(data.c);
            setLivePrices(prev => {
              if (prev[cleanSymbol] === newPrice) return prev;
              return { ...prev, [cleanSymbol]: newPrice };
            });
          }
        } catch { /* parse error */ }
      };

      ws.onclose = () => {
        if (cancelled) return;
        const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempts));
        reconnectAttempts += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.onclose = null;
        ws.close();
      }
      wsRef.current = null;
    };
  }, [symbolList, assets]);

  // Fetch stock prices (only in stock mode)
  useEffect(() => {
    if (mode !== 'stock') return;
    const stockAssets = assets.filter(a => a.originalSymbol.includes('.IS'));
    if (stockAssets.length === 0) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchStockPrices = async () => {
      try {
        await Promise.all(stockAssets.map(async (asset) => {
          try {
            const res = await api.get(`/stock/info/${asset.symbol}`, { signal: controller.signal });
            if (res.data.quote) {
              setLivePrices(prev => ({ ...prev, [asset.symbol]: res.data.quote.price }));
              setLastUpdates(prev => ({ ...prev, [asset.symbol]: res.data.lastUpdated || new Date().toISOString() }));
            }
          } catch (e: any) {
            if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return;
          }
        }));
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      controller.abort();
    };
  }, [assets]);

  // Sorting
  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAssets = useMemo(() => {
    let sortable = [...assets];
    if (sortConfig !== null) {
      sortable.sort((a, b) => {
        const getValue = (item: any, key: string) => {
          switch (key) {
            case 'currentPrice':
              return livePrices[item.symbol] || item.averagePrice;
            case 'profit':
              const price = livePrices[item.symbol] || item.averagePrice;
              return ((price - item.averagePrice) / item.averagePrice);
            default:
              return item[key];
          }
        };

        const aVal = getValue(a, sortConfig.key);
        const bVal = getValue(b, sortConfig.key);

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [assets, sortConfig, livePrices]);

  // Fast sell handler
  const handleFastSell = async (asset: any, currentPrice: number) => {
    const sellAmount = Number(asset.amount);
    const price = Number(currentPrice);

    if (!sellAmount || sellAmount <= 0) {
      showNotification('Satılacak miktar bulunamadı.', 'error');
      return;
    }

    if (!price || price <= 0) {
      showNotification('Fiyat henüz yüklenmedi, lütfen bekleyin.', 'error');
      return;
    }

    try {
      setLoading(true);
      await api.post('/portfolio/sell', {
        symbol: asset.originalSymbol || asset.symbol,
        sellAmount,
        sellPrice: price,
        totalGain: Number((sellAmount * price).toFixed(8))
      });
      showNotification(`${asset.symbol} başarıyla satıldı.`, 'success');
      await fetchStats();
    } catch (err: any) {
      showNotification('Satış hatası: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  return {
    assets: sortedAssets,
    livePrices,
    lastUpdates,
    loading,
    stats: stats || { totalValue: 0, totalCost: 0, profitLoss: 0, profitPercent: 0, currency: 'USDT' },
    handleFastSell,
    fetchStats,
    sortConfig,
    requestSort,
    mode,
    currency: (mode === 'stock' ? '₺' : '$') as '$' | '₺'
  };
};
