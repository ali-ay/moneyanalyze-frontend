import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../../../services/apiClient';

interface ProfileData {
  id: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  status: string;
  binanceApiKey: string | null;
  binanceSecretKey: string | null;
  tradingMode: 'SIMULATION' | 'LIVE';
  createdAt: string;
}

export const useProfileLogic = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [binanceApiKey, setBinanceApiKey] = useState('');
  const [binanceSecretKey, setBinanceSecretKey] = useState('');
  const [tradingMode, setTradingMode] = useState<'SIMULATION' | 'LIVE'>('SIMULATION');

  const abortRef = useRef<AbortController | null>(null);
  const fetchProfile = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const res = await api.get('/users/profile', { signal: controller.signal });
      if (controller.signal.aborted) return;
      const data = res.data.data;
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setTradingMode(data.tradingMode || 'SIMULATION');
      setBinanceApiKey('');
      setBinanceSecretKey('');
      setError(null);
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      if (err?.response?.status === 401) return; // apiClient logout tetikledi
      console.error("Profil yüklenemedi:", err);
      setError(err.response?.data?.message || "Profil bilgileri alınamadı.");
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    return () => abortRef.current?.abort();
  }, [fetchProfile]);

  const updateProfile = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const payload: any = { firstName, lastName, tradingMode };

      // Binance key alanları sadece dolu gönderilmişse güncelle
      if (binanceApiKey.trim()) payload.binanceApiKey = binanceApiKey.trim();
      if (binanceSecretKey.trim()) payload.binanceSecretKey = binanceSecretKey.trim();

      const res = await api.put('/users/profile', payload);
      const data = res.data.data;
      setProfile(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setTradingMode(data.tradingMode || 'SIMULATION');
      setBinanceApiKey('');
      setBinanceSecretKey('');
      setSuccess('Profil başarıyla güncellendi!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Profil güncellenemedi.');
    } finally {
      setSaving(false);
    }
  };

  const resetAccount = async () => {
    if (!window.confirm('Tüm işlem geçmişiniz, varlıklarınız silinecek ve bakiyeniz 10.000 USDT olarak sıfırlanacaktır. Bu işlem geri alınamaz! Emin misiniz?')) {
      return;
    }

    try {
      setSaving(true);
      await api.post('/users/reset-account');
      setSuccess('Hesap başarıyla sıfırlandı.');
      fetchProfile(); // Bakiyeyi ve varsa diğer değişen verileri yenile
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Hesap sıfırlanamadı.');
    } finally {
      setSaving(false);
    }
  };

  const [progress, setProgress] = useState<{ current: number; total: number; isRunning: boolean; message: string } | null>(null);
  const [historyProgress, setHistoryProgress] = useState<{ current: number; total: number; isSyncing: boolean; percent: number; currentSymbol: string } | null>(null);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await api.get('/stock/analysis-status');
      const data = res.data.data;
      setProgress(data);
      return data.isRunning;
    } catch (err) {
      console.error('Progress fetch error:', err);
      return false;
    }
  }, []);

  const fetchHistoryProgress = useCallback(async () => {
    try {
      const res = await api.get('/stock/sync-history-status');
      const data = res.data.data;
      setHistoryProgress(data);
      return data.isSyncing;
    } catch (err) {
      console.error('History progress fetch error:', err);
      return false;
    }
  }, []);

  // Eğer sayfa açıldığında zaten çalışan bir analiz veya eşitleme varsa takip et
  useEffect(() => {
    let interval: any;
    let historyInterval: any;

    const check = async () => {
      const isRunning = await fetchProgress();
      if (isRunning) {
        interval = setInterval(async () => {
          const stillRunning = await fetchProgress();
          if (!stillRunning) clearInterval(interval);
        }, 1000);
      }

      const isSyncing = await fetchHistoryProgress();
      if (isSyncing) {
        historyInterval = setInterval(async () => {
          const stillSyncing = await fetchHistoryProgress();
          if (!stillSyncing) clearInterval(historyInterval);
        }, 1500);
      }
    };
    check();
    return () => {
      clearInterval(interval);
      clearInterval(historyInterval);
    };
  }, [fetchProgress, fetchHistoryProgress]);

  const runAIScan = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await api.post('/stock/analyze-all');
      
      // Hemen polling başlat
      const interval = setInterval(async () => {
        const isRunning = await fetchProgress();
        if (!isRunning) {
          clearInterval(interval);
          setSaving(false);
          setSuccess('Yapay zeka taraması başarıyla tamamlandı!');
          setTimeout(() => setSuccess(null), 5000);
        }
      }, 1000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Analiz başlatılamadı.');
      setSaving(false);
    }
  };

  const runFullHistorySync = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      await api.post('/stock/sync-all-history');
      
      // Hemen polling başlat
      const interval = setInterval(async () => {
        const isSyncing = await fetchHistoryProgress();
        if (!isSyncing) {
          clearInterval(interval);
          setSaving(false);
          setSuccess('Tüm geçmiş veriler başarıyla eşitlendi!');
          setTimeout(() => setSuccess(null), 5000);
        }
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Eşitleme başlatılamadı.');
      setSaving(false);
    }
  };

  return {
    profile, loading, saving, error, success, progress, historyProgress,
    firstName, setFirstName,
    lastName, setLastName,
    binanceApiKey, setBinanceApiKey,
    binanceSecretKey, setBinanceSecretKey,
    tradingMode, setTradingMode,
    updateProfile,
    resetAccount,
    runAIScan,
    runFullHistorySync,
  };
};