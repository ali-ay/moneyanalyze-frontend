import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../../../services/apiClient';
import { getHistory } from '../../../services/wallet.api';

export const useTrackingLogLogic = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [livePrices, setLivePrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTransactions = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);

      // Üç kaynaktan paralel ve **birbirinden bağımsız** veri çek.
      // Promise.allSettled — biri patlasa bile diğerleri görünsün.
      const [txsResult, signalsResult, watchlistResult] = await Promise.allSettled([
        getHistory({ signal: controller.signal } as any),
        api.get('/stock/signals', { signal: controller.signal }),
        api.get('/watchlist?market=stock', { signal: controller.signal }),
      ]);

      let combined: any[] = [];

      // 1. İşlemler
      if (txsResult.status === 'fulfilled') {
        const r = txsResult.value;
        const rawTxs = r.data?.transactions || r.data?.data || r.data;
        if (Array.isArray(rawTxs)) {
          combined = [...combined, ...rawTxs.filter((tx: any) =>
            tx.symbol?.includes('.IS') || (tx.symbol && tx.symbol.length <= 6)
          ).map((tx: any) => ({ ...tx, entryType: 'TRANSACTION' }))];
        }
      } else {
        console.warn('[TrackingLog] transactions/history başarısız:', txsResult.reason?.message);
      }

      // 2. AI Sinyalleri
      if (signalsResult.status === 'fulfilled') {
        const rawSignals = Array.isArray(signalsResult.value.data) ? signalsResult.value.data : [];
        combined = [...combined, ...rawSignals.map((sig: any) => ({
          id: `sig_${sig.id}`,
          symbol: sig.symbol,
          type: 'SIGNAL',
          price: sig.entryPrice,
          amount: '-',
          total: '-',
          createdAt: sig.updatedAt || sig.createdAt,
          period: sig.period,
          entryType: 'AI_SIGNAL'
        }))];
      } else {
        console.warn('[TrackingLog] /stock/signals başarısız:', signalsResult.reason?.message);
      }

      // 3. Watchlist (manuel tarama / manuel ekleme)
      if (watchlistResult.status === 'fulfilled') {
        const rawWatchlist = Array.isArray(watchlistResult.value.data?.data)
          ? watchlistResult.value.data.data
          : [];
        combined = [...combined, ...rawWatchlist.map((w: any) => ({
          id: `wl_${w.id}`,
          symbol: w.symbol,
          type: 'WATCHLIST',
          price: w.entryPrice ?? w.currentPrice ?? 0,
          amount: '-',
          total: '-',
          createdAt: w.createdAt,
          period: w.period,
          entryType: 'WATCHLIST_MANUAL'
        }))];
      } else {
        console.warn('[TrackingLog] /watchlist başarısız:', watchlistResult.reason?.message);
      }

      // Tarihe göre sırala
      combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setTransactions(combined);

      // Benzersiz sembolleri topla ve fiyatlarını çek
      const uniqueSymbols = Array.from(new Set(combined.map(t => t.symbol.replace('.IS', ''))));
      fetchPrices(uniqueSymbols);
    } catch (err) {
      console.error("Yükleme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrices = async (symbols: string[]) => {
    if (symbols.length === 0) return;
    try {
      const res = await api.get(`/stock/bulk-info?symbols=${symbols.join(',')}`);
      if (res.data.quotes) {
        const prices: { [key: string]: number } = {};
        res.data.quotes.forEach((q: any) => {
          prices[q.symbol] = q.price;
        });
        setLivePrices(prev => ({ ...prev, ...prices }));
      }
    } catch (err) {
      console.error("Fiyat çekme hatası:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    const interval = setInterval(() => {
      const symbols = Array.from(new Set(transactions.map(t => t.symbol.replace('.IS', ''))));
      fetchPrices(symbols);
    }, 60000);
    return () => {
      abortRef.current?.abort();
      clearInterval(interval);
    };
  }, [fetchTransactions, transactions.length]);

  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>({ key: 'createdAt', direction: 'desc' });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTransactions = useMemo(() => {
    let sortableItems = [...transactions];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortConfig.key) {
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'symbol':
            aValue = a.symbol;
            bValue = b.symbol;
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'currentPrice':
            aValue = livePrices[a.symbol.replace('.IS', '')] || 0;
            bValue = livePrices[b.symbol.replace('.IS', '')] || 0;
            break;
          case 'profit':
            const ap = livePrices[a.symbol.replace('.IS', '')] || a.price;
            const bp = livePrices[b.symbol.replace('.IS', '')] || b.price;
            aValue = (ap - a.price) / a.price;
            bValue = (bp - b.price) / b.price;
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
  }, [transactions, sortConfig, livePrices]);

  return { transactions: sortedTransactions, livePrices, loading, refresh: fetchTransactions, sortConfig, requestSort };
};
