import { useState, useEffect, useRef, useCallback } from 'react';
import apiClient from '../../services/apiClient';

export interface StockHistoryItem {
  time: string;
  date: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
}

export interface TechnicalSummary {
  signal: string;
  score: number;
  color: string;
  signals: string[];
  pivots: {
    p: number;
    r1: number;
    r2: number;
    s1: number;
    s2: number;
  };
}

export const useStockDetailLogic = (symbol?: string) => {
  const [history, setHistory] = useState<StockHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const [change, setChange] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [timeframe, setTimeframe] = useState<'1d' | '5d' | '1mo' | '3mo' | '1y' | '5y' | 'all'>('1mo');
  const [fundamentals, setFundamentals] = useState<any>(null);
  const [technicalSummary, setTechnicalSummary] = useState<TechnicalSummary | null>(null);
  
  // Backtest & Optimization States
  const [backtestData, setBacktestData] = useState<any>(null);
  const [backtestLoading, setBacktestLoading] = useState(false);
  const [backtestPeriod, setBacktestPeriod] = useState('weekly');
  const [optimizedData, setOptimizedData] = useState<any>(null);
  const [optimizedLoading, setOptimizedLoading] = useState(false);

  const abortRef = useRef<AbortController | null>(null);

  const fetchBacktest = useCallback(async (period: string) => {
    if (!symbol) return;
    try {
      setBacktestLoading(true);
      const cleanSymbol = symbol.replace('.IS', '');
      const res = await apiClient.get(`/stock/backtest/${cleanSymbol}?period=${period}`);
      setBacktestData(res.data);
    } catch (err) {
      console.error("Backtest error:", err);
    } finally {
      setBacktestLoading(false);
    }
  }, [symbol]);

  const fetchOptimization = useCallback(async (period: string) => {
    if (!symbol) return;
    try {
      setOptimizedLoading(true);
      const cleanSymbol = symbol.replace('.IS', '');
      const res = await apiClient.get(`/stock/optimize/${cleanSymbol}?period=${period}`);
      setOptimizedData(res.data);
    } catch (err) {
      console.error("Optimization error:", err);
    } finally {
      setOptimizedLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    fetchBacktest(backtestPeriod);
    fetchOptimization(backtestPeriod);
  }, [backtestPeriod, fetchBacktest, fetchOptimization]);

  const fetchHistory = useCallback(async () => {
    if (!symbol) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const cleanSymbol = symbol.replace('.IS', '');

      const infoRes = await apiClient.get(`/stock/info/${cleanSymbol}`, { signal: controller.signal });
      const quote = infoRes.data.quote;

      setFundamentals({
        marketCap: quote.marketCap,
        peRatio: quote.trailingPE,
        dividendYield: quote.dividendYield,
        high52w: quote.fiftyTwoWeekHigh,
        low52w: quote.fiftyTwoWeekLow,
        name: quote.name
      });

      const analysisRes = await apiClient.post('/stock/analyze', {
        symbol: `${cleanSymbol}.IS`,
        timeframe
      }, { signal: controller.signal });

      const analysisData = analysisRes.data.data;

      const mappedHistory: StockHistoryItem[] = analysisData.history.map((item: any) => ({
        time: item.time || new Date(item.timestamp || Date.now()).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        date: item.date || item.time || '',
        price: item.close || item.price || 0,
        open: item.open || 0,
        high: item.high || 0,
        low: item.low || 0,
        volume: item.volume || 0
      }));

      setHistory(mappedHistory);
      setPrice(quote.price || 0);
      setChange(quote.change || 0);
      setChangePercent(quote.changePercent || 0);
      setLastUpdated(infoRes.data.lastUpdated || new Date().toISOString());

      const summary: TechnicalSummary = {
        signal: analysisData.signal || 'NÖTR',
        score: 50,
        color: getSignalColor(analysisData.signal),
        signals: [],
        pivots: analysisData.pivots || { p: 0, r1: 0, r2: 0, s1: 0, s2: 0 }
      };

      setTechnicalSummary(summary);
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      console.error('Error fetching stock history:', error);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 30000);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchHistory]);

  return {
    history,
    loading,
    price,
    changePercent,
    change,
    lastUpdated,
    timeframe,
    setTimeframe,
    technicalSummary,
    fundamentals,
    backtestData,
    backtestLoading,
    backtestPeriod,
    setBacktestPeriod,
    optimizedData,
    optimizedLoading,
    refreshAll: () => {
      fetchHistory();
      fetchBacktest(backtestPeriod);
      fetchOptimization(backtestPeriod);
    }
  };
};

function getSignalColor(signal: string): string {
  switch (signal) {
    case 'GÜÇLÜ_AL':
    case 'AL':
      return '#0F9D58';
    case 'GÜÇLÜ_SAT':
    case 'SAT':
      return '#DB4437';
    default:
      return '#FFA000';
  }
}
