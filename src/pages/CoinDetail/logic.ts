import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../core/providers/NotificationContext';

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

export const useCoinDetailLogic = (symbol: string | undefined) => {
  const { showNotification } = useNotification();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<{ time: string, price: number }[]>([]);
  const [timeframe, setTimeframe] = useState('1M');
  const [price, setPrice] = useState<string>('0.00');
  const [updatingBot, setUpdatingBot] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState<Record<string, boolean>>({});
  const [hasChanges, setHasChanges] = useState(false);

  const isBBActive = useMemo(() => {
    const bbBot = bots.find(b => b.strategy === 'BB');
    if (!bbBot) return false;
    return (bbBot.id in pendingChanges) ? pendingChanges[bbBot.id] : bbBot.isActive;
  }, [bots, pendingChanges]);

  const isEMACrossActive = useMemo(() => {
    const emaBot = bots.find(b => b.strategy === 'EMA_CROSS');
    if (!emaBot) return false;
    return (emaBot.id in pendingChanges) ? pendingChanges[emaBot.id] : emaBot.isActive;
  }, [bots, pendingChanges]);

  const isVWAPActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'VWAP');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  const isIchimokuActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'ICHIMOKU');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  const isRSIActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'RSI');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  const isMACDActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'MACD');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  const isStochActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'STOCH');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  const isADXActive = useMemo(() => {
    const bot = bots.find(b => b.strategy === 'ADX');
    if (!bot) return false;
    return (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
  }, [bots, pendingChanges]);

  // Botları getir (Sadece bu sembol için) — abort destekli
  const fetchBotsAbortRef = useRef<AbortController | null>(null);
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
      // 401 zaten apiClient tarafından ele alınıyor; user feedback'i sadece gerçek hatalar için göster
      if (error?.response?.status !== 401) {
        showNotification('Botlar yüklenirken bir hata oluştu.', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [symbol, showNotification]);

  const TIMEFRAME_CONFIGS: Record<string, { interval: string, limit: number, displayCount: number }> = {
    '1D': { interval: '15m', limit: 150, displayCount: 96 },
    '5D': { interval: '1h', limit: 170, displayCount: 120 },
    '1M': { interval: '1d', limit: 100, displayCount: 30 },
    '3M': { interval: '1d', limit: 150, displayCount: 90 },
    '1Y': { interval: '1w', limit: 120, displayCount: 52 },
    '5Y': { interval: '1M', limit: 130, displayCount: 60 }
  };

  // Geçmiş verileri getir — abort destekli
  const fetchHistoryAbortRef = useRef<AbortController | null>(null);
  const fetchHistory = useCallback(async () => {
    const currentSymbol = symbol?.trim();
    if (!currentSymbol) return;

    const config = TIMEFRAME_CONFIGS[timeframe];

    fetchHistoryAbortRef.current?.abort();
    const controller = new AbortController();
    fetchHistoryAbortRef.current = controller;

    try {
      const response = await api.get(`/market/history/${currentSymbol}`, {
        signal: controller.signal,
        params: {
          interval: config.interval,
          limit: config.limit
        }
      });
      
      if (response.data.success) {
        const rawData = response.data.data;
        
        // 1. Bollinger Bantlarını Hesapla
        const periodBB = 20;
        const stdDevMult = 2;
        
        let enrichedData = rawData.map((item: any, index: number) => {
          if (index < periodBB - 1) return item;
          const slice = rawData.slice(index - periodBB + 1, index + 1).map((d: any) => d.price);
          const mean = slice.reduce((a: number, b: number) => a + b, 0) / periodBB;
          const variance = slice.reduce((sum: number, p: number) => sum + Math.pow(p - mean, 2), 0) / periodBB;
          const stdDev = Math.sqrt(variance);
          return { ...item, bbUpper: mean + (stdDevMult * stdDev), bbLower: mean - (stdDevMult * stdDev), bbMiddle: mean };
        });

        // 2. EMA Hesapla
        const calculateEMAArr = (prices: number[], period: number) => {
          const k = 2 / (period + 1);
          let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
          const emaArr = Array(period - 1).fill(null).concat([ema]);
          for (let i = period; i < prices.length; i++) {
            ema = prices[i] * k + ema * (1 - k);
            emaArr.push(ema);
          }
          return emaArr;
        };
        const prices = rawData.map((d: any) => d.price);
        const ema9 = calculateEMAArr(prices, 9);
        const ema21 = calculateEMAArr(prices, 21);

        // 3. VWAP Hesapla
        let vwapSum = 0;
        let volSum = 0;
        const vwapArr = rawData.map((d: any) => {
          vwapSum += d.price * d.volume;
          volSum += d.volume;
          return volSum === 0 ? d.price : vwapSum / volSum;
        });

        // 4. Ichimoku Hesapla
        const getHighLowMid = (arr: any[], len: number) => {
          if (arr.length < len) return null;
          const slice = arr.slice(-len);
          const high = Math.max(...slice.map(d => d.price));
          const low = Math.min(...slice.map(d => d.price));
          return (high + low) / 2;
        };

        // 5. RSI, MACD, Stoch, ADX (Oscillators)
        // Not: Bu hesaplamalar için utility fonksiyonları kullanmak daha temiz olur ama 
        // burada inline yapalım veya basitleştirilmiş versiyonları ekleyelim.

        const calculateRSIArr = (prices: number[], period: number = 14) => {
          const rsiArr = Array(period).fill(null);
          for (let i = period; i < prices.length; i++) {
            let gains = 0, losses = 0;
            for (let j = i - period + 1; j <= i; j++) {
              const diff = prices[j] - prices[j-1];
              if (diff >= 0) gains += diff; else losses -= diff;
            }
            const rs = (gains/period) / (losses/period || 1);
            rsiArr.push(100 - (100 / (1 + rs)));
          }
          return rsiArr;
        };

        const rsiValues = calculateRSIArr(prices, 14);

        const finalData = enrichedData.map((item: any, index: number) => {
          const tenkan = getHighLowMid(rawData.slice(0, index + 1), 9);
          const kijun = getHighLowMid(rawData.slice(0, index + 1), 26);
          
          return {
            ...item,
            emaShort: ema9[index],
            emaLong: ema21[index],
            vwap: vwapArr[index],
            tenkan,
            kijun,
            spanA: tenkan && kijun ? (tenkan + kijun) / 2 : null,
            spanB: getHighLowMid(rawData.slice(0, index + 1), 52),
            rsi: rsiValues[index],
            // MACD (Basit)
            macd: ema9[index] && ema21[index] ? ema9[index] - ema21[index] : null
          };
        });

        setHistory(finalData.slice(-config.displayCount));
      }
    } catch (error: any) {
      if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
      console.error('Geçmiş verisi yüklenemedi:', error);
    }
  }, [symbol, timeframe]);

  useEffect(() => {
    fetchBots();
    fetchHistory();
    return () => {
      fetchBotsAbortRef.current?.abort();
      fetchHistoryAbortRef.current?.abort();
    };
  }, [fetchBots, fetchHistory]);

  // Binance WebSocket ile Fiyatları Canlı Güncelle (otomatik reconnect ile)
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
          const incomingData = JSON.parse(event.data);
          const newPrice = parseFloat(incomingData.c);
          if (Number.isFinite(newPrice)) {
            setPrice(newPrice.toLocaleString('en-US', { minimumFractionDigits: 2 }));
          }
        } catch { /* parse hatası - sessizce yut */ }
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

  // Bot durumunu yerel olarak değiştir (Taslak olarak tut)
  const toggleBotLocal = (botId: string) => {
    const bot = bots.find(b => b.id === botId);
    if (!bot) return;

    const newStatus = !((botId in pendingChanges) ? pendingChanges[botId] : bot.isActive);
    
    setPendingChanges(prev => ({
      ...prev,
      [botId]: newStatus
    }));
    setHasChanges(true);
  };

  // Değişiklikleri sunucuya gönder
  const applyChanges = async () => {
    try {
      setLoading(true);
      const updates = Object.entries(pendingChanges).map(([id, isActive]) => ({
        id,
        isActive
      }));

      const response = await api.put('/bots/batch-update', { updates });
      if (response.data.success) {
        showNotification('Değişiklikler başarıyla uygulandı.', 'success');
        setPendingChanges({});
        setHasChanges(false);
        await fetchBots();
      }
    } catch (error: any) {
      showNotification('Güncelleme sırasında bir hata oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Bot ayarlarını güncelle
  const updateBotConfig = async (botId: string, config: any) => {
    try {
      setUpdatingBot(botId);
      const response = await api.put(`/bots/${botId}/config`, { config });
      if (response.data.success) {
        showNotification('Bot ayarları güncellendi.', 'success');
        await fetchBots();
      }
    } catch (error: any) {
      showNotification('Ayarlar kaydedilirken bir hata oluştu.', 'error');
    } finally {
      setUpdatingBot(null);
    }
  };

  const activeBotCount = useMemo(() => {
    return bots.filter(b => {
      if (b.id in pendingChanges) return pendingChanges[b.id];
      return b.isActive;
    }).length;
  }, [bots, pendingChanges]);

  return {
    bots,
    loading,
    updatingBot,
    pendingChanges,
    hasChanges,
    activeBotCount,
    toggleBotLocal,
    updateBotConfig,
    applyChanges,
    fetchBots,
    history,
    price,
    isBBActive,
    isEMACrossActive,
    isVWAPActive,
    isIchimokuActive,
    isRSIActive,
    isMACDActive,
    isStochActive,
    isADXActive,
    timeframe,
    setTimeframe
  };
};
