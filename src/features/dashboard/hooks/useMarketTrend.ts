import { useState, useEffect } from 'react';
import axios from 'axios';

export const useMarketTrend = (symbol: string) => {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrend = async () => {
    try {
      const isStock = symbol.startsWith('XU') || symbol.includes('.IS');
      let url = '';
      
      if (isStock) {
        const cleanSym = symbol.replace('.IS', '');
        url = `http://localhost:5001/api/stock/history/${cleanSym}?period=1d`;
      } else {
        const cleanSymbol = symbol.replace('/', '');
        url = `http://localhost:5001/api/market/history/${cleanSymbol}?interval=1h&limit=24`;
      }

      const response = await axios.get(url);
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || []);
      
      if (data.length > 0) {
        setTrendData(data);
        setError(null);
      }
    } catch (err: any) {
      console.error('Trend fetch error:', err);
      setError('Veri alınamadı');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrend();
    const interval = setInterval(fetchTrend, 60000); // 1 dk
    return () => clearInterval(interval);
  }, [symbol]);

  return { trendData, loading, error };
};
