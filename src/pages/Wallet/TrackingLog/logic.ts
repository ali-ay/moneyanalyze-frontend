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
      const res = await getHistory({ signal: controller.signal } as any);
      const rawData = res.data?.transactions || res.data?.data || res.data;

      if (Array.isArray(rawData)) {
        // Sadece BIST hisselerini filtrele (Sembol sonunda .IS olanlar veya manual listemizdekiler)
        const stockTxs = rawData.filter(tx => 
          tx.symbol.includes('.IS') || tx.symbol.length <= 6
        );
        setTransactions(stockTxs);

        // Benzersiz sembolleri topla ve fiyatlarını çek
        const uniqueSymbols = Array.from(new Set(stockTxs.map(t => t.symbol.replace('.IS', ''))));
        fetchPrices(uniqueSymbols);
      }
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

  return { transactions, livePrices, loading, refresh: fetchTransactions };
};
