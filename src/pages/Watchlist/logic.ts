import { useState, useEffect, useCallback, useRef } from 'react';
import { getWatchlist, removeFromWatchlist } from '../../services/watchlist.api';
import type { WatchlistItem } from '../../services/watchlist.api';
import api from '../../services/apiClient';
import { useNotification } from '../../core/providers/NotificationContext';
import { useMarketMode } from '../../context/MarketModeContext';

export const useWatchlistLogic = () => {
  const { showNotification } = useNotification();
  const { mode } = useMarketMode();
  // Lazy init: getWatchlist her render'da çalışmasın, sadece mount'ta okusun
  const [watchlistMeta, setWatchlistMeta] = useState<WatchlistItem[]>(() => getWatchlist(mode));
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdates, setLastUpdates] = useState<{ [key: string]: string }>({});
  const [period, setPeriod] = useState<string>('weekly');
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const manualMeta = getWatchlist(mode);
      
      const oppRes = mode === 'stock'
        ? await api.get(`/stock/opportunities?period=${period}`, { signal: controller.signal })
        : { data: [] };

      const opportunityMeta: WatchlistItem[] = (oppRes.data || []).map((opp: any) => ({
        symbol: opp.symbol.replace('.IS', ''),
        addedPrice: opp.entryPrice,
        addedAt: opp.createdAt,
        isOpportunity: true,
        strengthScore: opp.strengthScore,
        signalType: opp.signalType
      }));

      const combinedMeta = [...manualMeta];
      opportunityMeta.forEach(opp => {
        if (!combinedMeta.find(m => m.symbol === opp.symbol)) {
          combinedMeta.push(opp);
        }
      });

      setWatchlistMeta(combinedMeta);
      const symbols = combinedMeta.map(m => m.symbol);

      if (symbols.length === 0) {
        setMarketData([]);
        setLoading(false);
        return;
      }

      // Toplu veri çekme (Bulk Fetch) - 500 hatalarını ve performans sorunlarını önler
      let filtered: any[] = [];
      const updates: { [key: string]: string } = {};

      if (mode === 'stock') {
        const cleanSymbols = symbols.map(s => s.replace('.IS', '').toUpperCase());
        const res = await api.get(`/stock/bulk-info?symbols=${cleanSymbols.join(',')}`, { signal: controller.signal });
        const quotes = res.data.quotes || [];
        
        filtered = quotes.map((q: any) => {
          const meta = combinedMeta.find(m => m.symbol === q.symbol);
          updates[q.symbol] = res.data.lastUpdated;
          return {
            ...q,
            isOpportunity: (meta as any)?.isOpportunity,
            strengthScore: (meta as any)?.strengthScore,
            signalType: (meta as any)?.signalType
          };
        });
      } else {
        // Kripto için tekil ticker'lar veya mevcut endpoint
        const detailedData = await Promise.all(symbols.map(async (symbol) => {
          try {
            const res = await api.get(`/market/ticker/${symbol}USDT`, { signal: controller.signal });
            updates[symbol] = new Date().toISOString();
            return {
              symbol,
              price: res.data.lastPrice,
              priceChangePercent: res.data.priceChangePercent,
              isOpportunity: false
            };
          } catch (e: any) {
            if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return null;
            return null;
          }
        }));
        filtered = detailedData.filter(d => d !== null);
      }

      if (controller.signal.aborted) return;
      setMarketData(filtered);
      setLastUpdates(prev => ({ ...prev, ...updates }));
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      console.error('Watchlist verisi çekilemedi:', err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [mode, period]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData]);

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol, mode);
    setWatchlistMeta(prev => prev.filter(item => item.symbol !== symbol));
    setMarketData(prev => prev.filter(coin => coin.symbol !== symbol));
    showNotification(`${symbol} takip listesinden kaldırıldı.`, 'info');
  };

  const getMeta = (symbol: string): WatchlistItem | undefined => {
    return watchlistMeta.find(item => item.symbol === symbol);
  };

  return { marketData, watchlistMeta, loading, lastUpdates, handleRemove, getMeta, period, setPeriod, fetchData };
};
