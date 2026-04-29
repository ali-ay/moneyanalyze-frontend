import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../app/providers/NotificationContext';

export interface BotData {
  id: string;
  name: string;
  description: string | null;
  strategy: string;
  symbol: string;
  isActive: boolean;
  limit: number;
  config: any;
  createdAt: string;
}

export interface TechnicalIndicators {
  bb: { upper: number; lower: number; middle: number };
  ema: { ema9: number; ema21: number };
  vwap: number;
  ichimoku: { tenkan: number; kijun: number; spanA: number; spanB: number };
  rsi: { value: number; overbought: number; oversold: number };
  macd: { macd: number; signal: number; histogram: number };
  stochastic: { k: number; d: number };
  adx: { adx: number; plusDI: number; minusDI: number };
}

export interface ChartData {
  time: string;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  price: number;
  volume?: number;
}

export const useCoinDetailLogic = (symbol: string | undefined) => {
  const { showNotification } = useNotification();

  // State
  const [bots, setBots] = useState<BotData[]>([]);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);
  const [history, setHistory] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [price, setPrice] = useState<string>('0.00');
  const [updatingBot, setUpdatingBot] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('1d');

  // Abort refs for cleanup
  const fetchBotsAbortRef = useRef<AbortController | null>(null);
  const fetchAnalysisAbortRef = useRef<AbortController | null>(null);

  // Fetch TA indicators from backend
  const fetchAnalysis = useCallback(async () => {
    const currentSymbol = symbol?.trim();
    if (!currentSymbol) return;

    fetchAnalysisAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAnalysisAbortRef.current = controller;

    try {
      const response = await api.post('/market/analyze', {
        symbol: currentSymbol,
        timeframe,
        limit: 500
      }, { signal: controller.signal });

      if (response.data.success) {
        const data = response.data.data;
        setIndicators(data.indicators);
        setHistory(data.history);
      }
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      if (error?.response?.status !== 401) {
        showNotification('Teknik analiz yüklenirken bir hata oluştu.', 'error');
      }
    }
  }, [symbol, timeframe, showNotification]);

  // Fetch bots for this symbol
  const fetchBots = useCallback(async () => {
    const currentSymbol = symbol?.trim();
    if (!currentSymbol) return;

    fetchBotsAbortRef.current?.abort();
    const controller = new AbortController();
    fetchBotsAbortRef.current = controller;

    try {
      setLoading(true);
      const response = await api.get(`/bots/my?symbol=${currentSymbol}`, { signal: controller.signal });
      if (response.data.success) {
        setBots(response.data.data);
      }
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      if (error?.response?.status !== 401) {
        showNotification('Botlar yüklenirken bir hata oluştu.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, showNotification]);

  // Fetch both on mount and when symbol changes
  useEffect(() => {
    fetchBots();
    fetchAnalysis();
    return () => {
      fetchBotsAbortRef.current?.abort();
      fetchAnalysisAbortRef.current?.abort();
    };
  }, [fetchBots, fetchAnalysis]);

  // WebSocket for live price updates
  useEffect(() => {
    if (!symbol) return;

    let cancelled = false;
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let attempts = 0;

    const connect = () => {
      if (cancelled) return;
      const streamSymbol = symbol.toLowerCase().endsWith('usdt')
        ? symbol.toLowerCase()
        : `${symbol.toLowerCase()}usdt`;
      ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamSymbol}@ticker`);

      ws.onopen = () => { attempts = 0; };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const newPrice = parseFloat(data.c);
          if (Number.isFinite(newPrice)) {
            setPrice(newPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          }
        } catch { /* parse error */ }
      };

      ws.onclose = () => {
        if (cancelled) return;
        const delay = Math.min(30000, 1000 * Math.pow(2, attempts));
        attempts += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      if (ws) {
        ws.onclose = null;
        ws.close();
      }
    };
  }, [symbol]);

  // Toggle bot status locally then sync with server
  const toggleBot = async (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    try {
      setUpdatingBot(botId);
      const response = await api.put(`/bots/${botId}/toggle`, {});
      if (response.data.success) {
        setBots(prev => prev.map(b => b.id === botId ? { ...b, isActive: !b.isActive } : b));
        showNotification(`Bot ${bot.strategy} ${!bot.isActive ? 'açıldı' : 'kapatıldı'}.`, 'success');
      }
    } catch (error: any) {
      showNotification('Bot güncellenirken bir hata oluştu.', 'error');
    } finally {
      setUpdatingBot(null);
    }
  };

  // Update bot configuration
  const updateBotConfig = async (botId: string, config: any) => {
    try {
      setUpdatingBot(botId);
      const response = await api.put(`/bots/${botId}/config`, { config });
      if (response.data.success) {
        setBots(prev => prev.map(b => b.id === botId ? { ...b, config } : b));
        showNotification('Bot ayarları güncellendi.', 'success');
      }
    } catch (error: any) {
      showNotification('Ayarlar kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setUpdatingBot(null);
    }
  };

  const activeBotCount = bots.filter(b => b.isActive).length;

  return {
    bots,
    indicators,
    history,
    loading,
    price,
    timeframe,
    setTimeframe,
    updatingBot,
    activeBotCount,
    toggleBot,
    updateBotConfig,
    fetchBots,
    fetchAnalysis
  };
};
