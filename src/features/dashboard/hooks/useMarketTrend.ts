import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../../../services/apiClient';

export const useMarketTrend = (symbol: string) => {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!symbol) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchTrend = async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const isStock = symbol.startsWith('XU') || symbol.includes('.IS');
        const url = isStock
          ? `/stock/history/${symbol.replace('.IS', '')}?period=1d`
          : `/market/history/${symbol.replace('/', '')}?interval=1h&limit=24`;

        const response = await api.get(url, { signal: controller.signal });
        if (cancelled) return;

        const data = Array.isArray(response.data)
          ? response.data
          : (response.data?.data || []);

        if (data.length > 0) {
          setTrendData(data);
          setError(null);
        }
      } catch (err: any) {
        if (axios.isCancel(err) || err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        if (cancelled) return;
        setError('Veri alınamadı');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTrend();
    const interval = setInterval(fetchTrend, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [symbol]);

  return { trendData, loading, error };
};
