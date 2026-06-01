import { useState, useCallback, useEffect } from 'react';
import { getPortfolio, depositMoney } from '../../../services/wallet.api';

export const useWallet = () => {
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceTRY, setBalanceTRY] = useState<number | null>(null);
  const [usdtTryRate, setUsdtTryRate] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tradingMode, setTradingMode] = useState<'SIMULATION' | 'LIVE'>('SIMULATION');
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [debug, setDebug] = useState<any>(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getPortfolio();
      
      if (res.data && res.data.success) {
        const data = res.data.data;
        
        if (data.error) {
          setError(data.error);
        }

        setIsRealData(data.isRealData ?? false);

        console.log("📊 Binance Canlı Cüzdan Verisi (TÜMÜ):", data);

        setBalance(data.balance ?? 0);
        setBalanceTRY(data.balanceTRY ?? 0);
        setUsdtTryRate(data.usdtTryRate ?? 0);
        setTransactions(data.transactions ?? []);
        setAssets(data.assets ?? []);
        setTradingMode(data.tradingMode || 'SIMULATION');
        setDebug(data.debug || null);
      }
    } catch (err) {
      console.error("Cüzdan verisi çekilemedi:", err);
      setError("Bağlantı hatası: Sunucuya erişilemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
  }, [fetchWalletData]);

  const handleDepositSubmit = async (amount: string) => {
    const numAmount = Number(amount);
    if (!amount || numAmount <= 0) {
      throw new Error("Lütfen geçerli bir miktar girin.");
    }
    
    try {
      await depositMoney(numAmount);
      await fetchWalletData(); 
    } catch (err: any) {
      console.error("Yatırma işlemi başarısız:", err);
      throw new Error(err.response?.data?.message || "İşlem sırasında bir hata oluştu.");
    }
  };

  return { 
    balance, 
    balanceTRY,
    usdtTryRate,
    assets,
    transactions,
    tradingMode,
    loading, 
    error,
    isRealData,
    debug,
    fetchWalletData,
    handleDepositSubmit 
  };
};