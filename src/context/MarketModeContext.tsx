import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';

type MarketMode = 'crypto' | 'stock';

interface MarketModeContextType {
  mode: MarketMode;
  setMode: (mode: MarketMode) => void;
}

const MarketModeContext = createContext<MarketModeContextType | undefined>(undefined);

const isValidMode = (val: string | null): val is MarketMode => val === 'crypto' || val === 'stock';

export const MarketModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<MarketMode>(() => {
    try {
      const saved = localStorage.getItem('marketMode');
      return isValidMode(saved) ? saved : 'crypto';
    } catch {
      return 'crypto';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('marketMode', mode);
    } catch { /* ignore */ }
  }, [mode]);

  const setMode = useCallback((newMode: MarketMode) => {
    setModeState(newMode);
  }, []);

  // Tüketicilerde gereksiz re-render'ı önle
  const value = useMemo(() => ({ mode, setMode }), [mode, setMode]);

  return (
    <MarketModeContext.Provider value={value}>
      {children}
    </MarketModeContext.Provider>
  );
};

export const useMarketMode = () => {
  const context = useContext(MarketModeContext);
  if (!context) {
    throw new Error('useMarketMode must be used within MarketModeProvider');
  }
  return context;
};
