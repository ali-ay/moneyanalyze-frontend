import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useMarketMode } from '../../../context/MarketModeContext';

export const useDashboardData = () => {
  const { mode } = useMarketMode();
  const [marketData, setMarketData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const endpoint = mode === 'stock'
        ? '/api/stock/list'
        : '/api/market/top-volume';
      const response = await axios.get(endpoint);

      if (response.data?.status === 'error') {
        setError(response.data.message);
        setLoading(false);
        return;
      }

      const dataArray = Array.isArray(response.data)
        ? response.data
        : (response.data?.data && Array.isArray(response.data.data) ? response.data.data : []);

      if (dataArray.length > 0) {
        // Store the full list (top 40) for searching
        setMarketData(dataArray);
        setError(null);
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error: any) {
      console.error('Data fetch error:', error);
      if (error.response?.status === 429) {
        setError('Hız sınırlamasına takıldınız (Rate Limit). Lütfen biraz bekleyin.');
      } else {
        setError('Piyasa verileri alınamadı.');
      }
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { marketData, lastUpdated, loading, error };
};
