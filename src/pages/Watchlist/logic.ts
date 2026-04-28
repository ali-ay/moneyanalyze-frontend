import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  const [analysisSettings, setAnalysisSettings] = useState<any>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await api.get('/stock/analysis-settings');
      setAnalysisSettings(res.data);
    } catch (err) {
      console.error('Ayarlar yüklenemedi:', err);
    }
  }, []);

  const updateSettings = async (newSettings: any) => {
    try {
      const res = await api.post('/stock/analysis-settings', newSettings);
      setAnalysisSettings(res.data);
      showNotification('Analiz ayarları güncellendi.', 'success');
    } catch (err) {
      showNotification('Ayarlar güncellenemedi.', 'error');
    }
  };

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
        const existing = combinedMeta.find(m => m.symbol === opp.symbol);
        if (existing) {
          // Eğer zaten varsa, sadece fırsat özelliklerini ekle/güncelle
          Object.assign(existing, {
            isOpportunity: true,
            strengthScore: opp.strengthScore,
            signalType: opp.signalType,
            addedPrice: existing.addedPrice || opp.addedPrice // Manuel ekleme fiyatı varsa koru
          });
        } else {
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
    fetchSettings();
    const interval = setInterval(fetchData, 60000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData, fetchSettings]);

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol, mode);
    setWatchlistMeta(prev => prev.filter(item => item.symbol !== symbol));
    setMarketData(prev => prev.filter(coin => coin.symbol !== symbol));
    showNotification(`${symbol} takip listesinden kaldırıldı.`, 'info');
  };

  const getMeta = useCallback((symbol: string): WatchlistItem | undefined => {
    return watchlistMeta.find(item => item.symbol === symbol);
  }, [watchlistMeta]);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...marketData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;
        const aMeta = getMeta(a.symbol);
        const bMeta = getMeta(b.symbol);

        switch (sortConfig.key) {
          case 'symbol':
            aValue = a.symbol;
            bValue = b.symbol;
            break;
          case 'price':
            aValue = Number(a.price);
            bValue = Number(b.price);
            break;
          case 'addedPrice':
            aValue = aMeta?.addedPrice || 0;
            bValue = bMeta?.addedPrice || 0;
            break;
          case 'profit':
            const ap = Number(a.price);
            const bp = Number(b.price);
            const aa = aMeta?.addedPrice || 0;
            const ba = bMeta?.addedPrice || 0;
            aValue = aa > 0 ? (ap - aa) / aa : -999;
            bValue = ba > 0 ? (bp - ba) / ba : -999;
            break;
          case 'strengthScore':
            aValue = a.strengthScore || 0;
            bValue = b.strengthScore || 0;
            break;
          case 'addedAt':
            aValue = aMeta?.addedAt ? new Date(aMeta.addedAt).getTime() : 0;
            bValue = bMeta?.addedAt ? new Date(bMeta.addedAt).getTime() : 0;
            break;
          default:
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [marketData, sortConfig, getMeta]);

  return { 
    marketData: sortedData, 
    watchlistMeta, 
    loading, 
    lastUpdates, 
    handleRemove, 
    getMeta, 
    period, 
    setPeriod, 
    fetchData,
    analysisSettings,
    updateSettings,
    sortConfig,
    requestSort
  };
};
