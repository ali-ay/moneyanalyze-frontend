import { useState, useEffect, useCallback } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../core/providers/NotificationContext';
import { useMarketMode } from '../../context/MarketModeContext';

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

export const useBotManagement = () => {
  const { mode } = useMarketMode();
  const { showNotification } = useNotification();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingBot, setUpdatingBot] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingChanges, setPendingChanges] = useState(false);

  const [activeBotCount, setActiveBotCount] = useState(0);
  const [buyAmount, setBuyAmount] = useState<number>(10);
  const [settingsLoading, setSettingsLoading] = useState(false);

  const fetchBots = useCallback(async () => {
    try {
      setLoading(true);
      // Mode'a göre symbol belirle: crypto -> ALL, stock -> ALL_STOCK
      const targetSymbol = mode === 'crypto' ? 'ALL' : 'ALL_STOCK';
      
      const [botsRes, settingsRes] = await Promise.all([
        api.get(`/bots/my?symbol=${targetSymbol}`),
        api.get('/settings')
      ]);
      setBots(botsRes.data.data || []);
      setBuyAmount(settingsRes.data.data?.buyAmount || 10);
      setPendingChanges(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Botlar yüklenemedi.');
    } finally {
      setLoading(false);
    }
  }, [mode]);

  useEffect(() => {
    fetchBots();
  }, [fetchBots]);

  // Sadece yerel durumu değiştirir
  const toggleBot = (botId: string) => {
    setBots(prev =>
      prev.map(bot => (bot.id === botId ? { ...bot, isActive: !bot.isActive } : bot))
    );
    setPendingChanges(true);
  };

  // Tüm değişiklikleri tek seferde kaydet
  const applyChanges = async () => {
    try {
      setLoading(true);
      const updates = bots.map(b => ({ id: b.id, isActive: b.isActive }));
      await api.put('/bots/batch-update', { updates });
      setPendingChanges(false);
      showNotification('Bot durumları başarıyla güncellendi.', 'success');
      await fetchBots(); // Verileri tazele
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Güncelleme başarısız oldu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateBotConfig = async (botId: string, config: any) => {
    try {
      setUpdatingBot(botId);
      const res = await api.put(`/bots/${botId}/config`, { config });
      if (res.data.success) {
        const updated = res.data.data;
        setBots(prev =>
          prev.map(bot => (bot.id === updated.id ? { ...bot, config: updated.config } : bot))
        );
        showNotification('Bot ayarları güncellendi.', 'success');
        return true;
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Bot ayarı güncellenemedi.', 'error');
      return false;
    } finally {
      setUpdatingBot(null);
    }
  };

  const updateBuyAmount = async (amount: number) => {
    try {
      setSettingsLoading(true);
      await api.put('/settings', { buyAmount: amount });
      setBuyAmount(amount);
      showNotification('Alım tutarı güncellendi.', 'success');
      await fetchBots();
    } catch (err: any) {
      showNotification('Güncelleme hatası: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    setActiveBotCount(bots.filter(b => b.isActive).length);
  }, [bots]);

  return { 
    bots, 
    loading, 
    pendingChanges, 
    applyChanges,
    updatingBot, 
    error, 
    activeBotCount, 
    toggleBot, 
    updateBotConfig,
    buyAmount, 
    setBuyAmount, 
    updateBuyAmount, 
    settingsLoading 
  };
};
