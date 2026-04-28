import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import api from '../../../services/apiClient';
import { getPortfolio } from '../../../services/portfolio.api';
import { useNotification } from '../../../core/providers/NotificationContext';

export const useWalletLogic = () => {
  const { showNotification } = useNotification();
  const [rawAssets, setRawAssets] = useState<any[]>([]);
  const [balanceUSD, setBalanceUSD] = useState(0);
  const [balanceTRY, setBalanceTRY] = useState(0);
  const [tradingMode, setTradingMode] = useState<'SIMULATION' | 'LIVE'>('SIMULATION');
  const [livePrices, setLivePrices] = useState<{ [key: string]: number }>({});
  const [lastUpdates, setLastUpdates] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const [backendStats, setBackendStats] = useState<any>(null);

  const portfolioAbortRef = useRef<AbortController | null>(null);
  const fetchPortfolio = useCallback(async () => {
    portfolioAbortRef.current?.abort();
    const controller = new AbortController();
    portfolioAbortRef.current = controller;

    try {
      setLoading(true);
      const res = await getPortfolio({ signal: controller.signal } as any);
      if (controller.signal.aborted) return;
      const data = res.data?.data || {};

      setRawAssets(data.assets || []);
      setBalanceUSD(data.balance || 0);
      setBalanceTRY(data.balanceTRY || 0);
      setTradingMode(data.tradingMode || 'SIMULATION');
      setBackendStats(data.stats); // Backend'den gelen hazır istatistikler
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      if (err?.response?.status === 401) return;
      console.error("Veri çekme hatası:", err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
    return () => portfolioAbortRef.current?.abort();
  }, [fetchPortfolio]);

  // Backend'den gelen asset verilerini formatla
  const assets = useMemo(() => {
    return rawAssets
      .filter((a: any) => tradingMode === 'LIVE' || a.symbol !== 'USDT')
      .map((a: any) => {
        const cleanSymbol = a.symbol.replace('USDT', '');
        return {
          ...a,
          symbol: cleanSymbol,
          originalSymbol: a.symbol,
        };
      });
  }, [rawAssets, tradingMode]);

  // Asset sembollerini ayrı bir memo ile takip et (sadece sembol listesi değişirse WS yeniden bağlansın)
  const symbolList = useMemo(() => {
    return assets.map(a => a.symbol).sort().join(',');
  }, [assets]);

  // WebSocket Bağlantısı ve İlk Fiyat Çekimi (otomatik reconnect ile)
  useEffect(() => {
    if (!symbolList) return;

    let cancelled = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let reconnectAttempts = 0;

    const connect = () => {
      if (cancelled) return;

      const streams = assets.map(a => `${a.symbol.toLowerCase()}usdt@ticker`).join('/');
      const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts = 0;
        console.log('📡 Portföy fiyat akışı bağlandı');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const data = message.data;
          if (data?.s && data?.c) {
            const cleanSymbol = data.s.replace('USDT', '');
            const newPrice = parseFloat(data.c);
            setLivePrices(prev => {
              if (prev[cleanSymbol] === newPrice) return prev;
              return { ...prev, [cleanSymbol]: newPrice };
            });
          }
        } catch { /* parse hatası - sessizce yut */ }
      };

      ws.onerror = (err) => {
        console.error('WebSocket hatası:', err);
      };

      ws.onclose = () => {
        if (cancelled) return;
        // Exponential backoff: 1s, 2s, 4s, ... max 30s
        const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempts));
        reconnectAttempts += 1;
        reconnectTimer = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      const ws = wsRef.current;
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
        ws.onclose = null; // close event'inin reconnect tetiklemesini engelle
        ws.close();
      }
      wsRef.current = null;
    };
  }, [symbolList]);

  // Backend'den gelen hazır istatistikleri kullan
  const stats = useMemo(() => {
    if (!backendStats) return { totalValue: 0, totalCost: 0, profitLoss: 0, profitPercent: 0, isProfit: true };

    return {
      totalValue: backendStats.totalAssetValueUSD,
      totalCost: backendStats.totalCostUSD,
      profitLoss: backendStats.totalProfitLossUSD,
      profitPercent: backendStats.profitPercent,
      isProfit: backendStats.isProfit
    };
  }, [backendStats]);

  // Sadece Varlıkların (Coinlerin) Değeri - Nakit hariç
  const assetOnlyUSD = stats.totalValue;
  const assetOnlyTRY = backendStats?.totalAssetValueTRY || 0;

  const handleFastSell = async (asset: any, currentPrice: number) => {
    const sellAmount = Number(asset.amount);
    const price = Number(currentPrice);

    if (!sellAmount || sellAmount <= 0) {
      showNotification("Satılacak miktar bulunamadı.", 'error');
      return;
    }

    if (!price || price <= 0) {
      showNotification("Fiyat henüz yüklenmedi, lütfen bekleyin.", 'error');
      return;
    }

    try {
      setLoading(true);
      // userId'yi frontend'den GÖNDERMİYORUZ — backend req.user.id (JWT)
      // üzerinden alıyor. Bu güvenlik için kritik.
      const payload = {
        symbol: asset.originalSymbol || asset.symbol,
        sellAmount: sellAmount,
        sellPrice: price,
        totalGain: Number((sellAmount * price).toFixed(8))
      };

      await api.post('/portfolio/sell', payload);
      showNotification(`${asset.symbol} başarıyla satıldı.`, 'success');
      await fetchPortfolio(); // Listeyi yenile
    } catch (err: any) {
      showNotification("Satış hatası: " + (err.response?.data?.message || err.message), 'error');
    } finally {
      setLoading(false);
    }
  };

  // BIST hisselerini belirle ve fiyatlarını çek
  useEffect(() => {
    const stockAssets = assets.filter(a => a.originalSymbol.includes('.IS') || !a.originalSymbol.endsWith('USDT'));
    if (stockAssets.length === 0) return;

    let cancelled = false;
    const controller = new AbortController();

    const fetchStockPrices = async () => {
      try {
        const prices: { [key: string]: number } = {};
        const updates: { [key: string]: string } = {};

        await Promise.all(stockAssets.map(async (asset) => {
          try {
            const res = await api.get(`/stock/info/${asset.symbol}`, { signal: controller.signal });
            if (res.data.quote) {
              prices[asset.symbol] = res.data.quote.price;
              updates[asset.symbol] = res.data.lastUpdated || new Date().toISOString();
            }
          } catch (e: any) {
            if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return;
            updates[asset.symbol] = asset.updatedAt;
          }
        }));

        if (cancelled) return;
        setLivePrices(prev => ({ ...prev, ...prices }));
        setLastUpdates(prev => ({ ...prev, ...updates }));
      } catch (err: any) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        console.error("Hisse fiyatları çekilemedi:", err);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
      controller.abort();
    };
  }, [assets]);

  return {
    assets, livePrices, lastUpdates, loading, stats,
    balanceUSD, balanceTRY,
    assetOnlyUSD, assetOnlyTRY,
    handleFastSell, fetchPortfolio
  };
};