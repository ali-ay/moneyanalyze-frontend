import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type MarketMode = 'crypto' | 'stock';

interface MarketModeContextType {
  mode: MarketMode;
  setMode: (mode: MarketMode) => void;
}

const MarketModeContext = createContext<MarketModeContextType | undefined>(undefined);

export const MarketModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<MarketMode>(() => {
    const saved = localStorage.getItem('marketMode');
    return (saved as MarketMode) || 'crypto';
  });

  useEffect(() => {
    localStorage.setItem('marketMode', mode);
  }, [mode]);

  const setMode = (newMode: MarketMode) => {
    setModeState(newMode);
  };

  return (
    <MarketModeContext.Provider value={{ mode, setMode }}>
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
