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
      
      // 1. İşlemleri Çek
      const resTxs = await getHistory({ signal: controller.signal } as any);
      const rawTxs = resTxs.data?.transactions || resTxs.data?.data || resTxs.data;
      
      // 2. YZ Sinyallerini Çek
      const resSignals = await api.get('/stock/signals', { signal: controller.signal });
      const rawSignals = Array.isArray(resSignals.data) ? resSignals.data : [];

      let combined: any[] = [];

      if (Array.isArray(rawTxs)) {
        combined = [...combined, ...rawTxs.filter((tx: any) => 
          tx.symbol.includes('.IS') || tx.symbol.length <= 6
        ).map((tx: any) => ({ ...tx, entryType: 'TRANSACTION' }))];
      }

      combined = [...combined, ...rawSignals.map((sig: any) => ({
        id: `sig_${sig.id}`,
        symbol: sig.symbol,
        type: 'SIGNAL',
        price: sig.entryPrice,
        amount: '-',
        total: '-',
        createdAt: sig.createdAt,
        period: sig.period,
        entryType: 'AI_SIGNAL'
      }))];

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
