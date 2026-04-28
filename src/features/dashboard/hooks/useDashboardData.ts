import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import api from '../../../services/apiClient';
import { useMarketMode } from '../../../context/MarketModeContext';

export const useDashboardData = () => {
  const { mode } = useMarketMode();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      // Önceki in-flight isteği iptal et — race condition önler
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        if (!cancelled) setLoading(true);
        const endpoint = mode === 'stock' ? '/stock/list' : '/market/top-volume';
        const response = await api.get(endpoint, { signal: controller.signal });

        if (cancelled) return;

        if (response.data?.status === 'error') {
          setError(response.data.message);
          return;
        }

        const dataArray = Array.isArray(response.data)
          ? response.data
          : (Array.isArray(response.data?.data) ? response.data.data : []);

        if (dataArray.length > 0) {
          setMarketData(dataArray);
          setError(null);
        }
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err: any) {
        if (axios.isCancel(err) || err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        if (cancelled) return;
        if (err.response?.status === 429) {
          setError('Hız sınırlamasına takıldınız (Rate Limit). Lütfen biraz bekleyin.');
        } else {
          setError('Piyasa verileri alınamadı.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => {
      cancelled = true;
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [mode]);

  return { marketData, lastUpdated, loading, error };
};
