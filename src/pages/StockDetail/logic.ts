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
  ma20?: number;
  ma50?: number;
  rsi?: number;
  bb?: {
    upper: number;
    middle: number;
    lower: number;
  };
  macd?: {
    line: number;
    signal: number;
    histogram: number;
  };
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
  const abortRef = useRef<AbortController | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!symbol) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    try {
      const cleanSymbol = symbol.replace('.IS', '');

      // Fetch stock info (fundamentals)
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

      // Fetch technical analysis from backend
      const analysisRes = await apiClient.post('/stock/analyze', {
        symbol: `${cleanSymbol}.IS`,
        timeframe,
        limit: 500
      }, { signal: controller.signal });

      const analysisData = analysisRes.data.data;

      // Map backend response to frontend format
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

      // Create technical summary from backend analysis
      const summary: TechnicalSummary = {
        signal: analysisData.signal || 'NÖTR',
        score: 50, // Backend would provide this in FAZE 3
        color: getSignalColor(analysisData.signal),
        signals: [],
        pivots: analysisData.pivots || { p: 0, r1: 0, r2: 0, s1: 0, s2: 0 }
      };

      setTechnicalSummary(summary);
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      console.error('Error fetching stock history:', error);
      setHistory([]);
      setTechnicalSummary(null);
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
    fundamentals
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
