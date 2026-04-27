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

  const fetchPortfolio = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getPortfolio();
      const data = res.data.data;

      setRawAssets(data.assets || []);
      setBalanceUSD(data.balance || 0);
      setBalanceTRY(data.balanceTRY || 0);
      setTradingMode(data.tradingMode || 'SIMULATION');
      setBackendStats(data.stats); // Backend'den gelen hazır istatistikler

    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolio();
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

  // WebSocket Bağlantısı ve İlk Fiyat Çekimi
  useEffect(() => {
    if (!symbolList) return;

    // 2. Ardından canlı veri akışı için WebSocket'i başlat
    const streams = assets.map(a => `${a.symbol.toLowerCase()}usdt@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/stream?streams=${streams}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
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
      } catch (err) { }
    };

    ws.onerror = (err) => {
      console.error('WebSocket hatası:', err);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
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
      const payload = {
        userId: localStorage.getItem('id'),
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

    const fetchStockPrices = async () => {
      try {
        const prices: { [key: string]: number } = {};
        const updates: { [key: string]: string } = {};

        await Promise.all(stockAssets.map(async (asset) => {
          try {
            const res = await api.get(`/stock/info/${asset.symbol}`);
            if (res.data.quote) {
              prices[asset.symbol] = res.data.quote.price;
              updates[asset.symbol] = res.data.lastUpdated || new Date().toISOString();
            }
          } catch (e) {
            // Hata durumunda asset'in kendi updatedAt değerini kullan
            updates[asset.symbol] = asset.updatedAt;
          }
        }));

        setLivePrices(prev => ({ ...prev, ...prices }));
        setLastUpdates(prev => ({ ...prev, ...updates }));
      } catch (err) {
        console.error("Hisse fiyatları çekilemedi:", err);
      }
    };

    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 60000); // 1 dakikada bir güncelle
    return () => clearInterval(interval);
  }, [assets]);

  return {
    assets, livePrices, lastUpdates, loading, stats,
    balanceUSD, balanceTRY,
    assetOnlyUSD, assetOnlyTRY,
    handleFastSell, fetchPortfolio
  };
};