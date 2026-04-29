import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../../services/apiClient';

interface GlobalSettings {
  siteTitle: string;
  siteDescription: string;
  gtmId: string;
  recaptchaSiteKey: string;
}

interface SettingsContextType {
  settings: GlobalSettings | null;
  loading: boolean;
  error: string | null;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const DEFAULT_SETTINGS: GlobalSettings = {
  siteTitle: 'MoneyAnalyze',
  siteDescription: 'Crypto & Stock Analysis Platform',
  gtmId: '',
  recaptchaSiteKey: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI',
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettings | null>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;

    const fetchSettings = async () => {
      while (attempts < MAX_ATTEMPTS && !cancelled) {
        try {
          attempts += 1;
          const res = await api.get('/settings/public', { signal: controller.signal });
          if (cancelled) return;
          // Backend hem {data: {...}} hem {data: {data: {...}}} dönebilir — toleranslı oku
          const payload = res.data?.data ?? res.data;
          setSettings({ ...DEFAULT_SETTINGS, ...(payload || {}) });
          setError(null);
          setLoading(false);
          return;
        } catch (err: any) {
          if (cancelled) return;
          if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
          if (attempts >= MAX_ATTEMPTS) {
            console.error('Settings context error:', err);
            // Public ayar çekilemese de uygulama açılabilsin diye fallback uygula
            setSettings(DEFAULT_SETTINGS);
            setError('Genel ayarlar yüklenemedi, varsayılanlarla devam ediliyor.');
            setLoading(false);
            return;
          }
          // Exponential backoff: 500ms, 1500ms
          await new Promise((r) => setTimeout(r, 500 * attempts * attempts));
        }
      }
    };

    fetchSettings();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
