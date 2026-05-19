import { useState, useEffect, useCallback } from 'react';
import api from '../../services/apiClient';

export const useAIAnalysisLogic = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [historyLogs, setHistoryLogs] = useState<any[]>([]);
  const [livePrices, setLivePrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState('weekly');

  const fetchLivePrices = async (symbols: string[]) => {
    if (symbols.length === 0) return;
    try {
      const cleanSymbols = symbols.map(s => s.replace('.IS', '').toUpperCase());
      const res = await api.get(`/stock/bulk-info?symbols=${cleanSymbols.join(',')}`);
      if (res.data.quotes) {
        const prices: { [key: string]: number } = {};
        res.data.quotes.forEach((q: any) => {
          prices[q.symbol] = q.price;
        });
        setLivePrices(prev => ({ ...prev, ...prices }));
      }
    } catch (err) {
      console.error("Fiyatlar çekilemedi:", err);
    }
  };

  const fetchOpportunities = useCallback(async (period: string) => {
    try {
      setLoading(true);
      const [oppRes, logsRes] = await Promise.all([
        api.get(`/stock/opportunities?period=${period}`),
        api.get(`/stock/activity-logs?period=${period}`)
      ]);
      
      setOpportunities(oppRes.data);
      if (logsRes.data && logsRes.data.data) {
        setHistoryLogs(logsRes.data.data.slice(0, 50)); // Son 50 işlemi göster
      }
      
      const symbols = oppRes.data.map((o: any) => o.symbol);
      fetchLivePrices(symbols);
    } catch (error) {
      console.error('Veriler yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities(activePeriod);
  }, [activePeriod, fetchOpportunities]);

  return {
    opportunities,
    historyLogs,
    livePrices,
    loading,
    activePeriod,
    setActivePeriod,
    refresh: () => fetchOpportunities(activePeriod)
  };
};
