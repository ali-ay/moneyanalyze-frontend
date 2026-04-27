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
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings/public'); 
        setSettings(res.data.data);
      } catch (err) {
        console.error("Settings context error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
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
