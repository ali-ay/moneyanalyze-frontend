import { useEffect, useState, useRef } from 'react';
import api from '../../api/axios';
import { walletApi } from '../../api/wallet';
import Sidebar from '../../components/Sidebar/Sidebar';
import VIPPanels from '../../components/AnalyticCard/VIPPanels';
import ScannerTable from '../../components/ScannerTable/ScannerTable';
import BuyModal from '../../components/BuyModal/BuyModal';
import { io } from 'socket.io-client';
import * as S from './Dashboard.styles';

const SOCKET_URL = "https://moneyanalyze-backend-eu.onrender.com";

interface MarketCoin {
  symbol: string;
  price: number;
  signal?: string;
  totalScore?: number;
}

const Dashboard = () => {
  const [marketData, setMarketData] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  
  // Botun aynı döngüde çakışmaması için ref kullanıyoruz
  const isProcessing = useRef(false);

  // 1. WebSocket: Canlı Fiyat Takibi
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('tickerUpdate', (data) => {
      setMarketData(prevData => 
        prevData.map(coin => {
          if (coin.symbol === data.symbol) {
            return { ...coin, price: parseFloat(data.price) };
          }
          return coin;
        })
      );
    });

    return () => { socket.disconnect(); };
  }, []);

  // 2. Bot Mantığı & Market Verisi Çekme
  const fetchData = async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;

    try {
      // Market ve Cüzdan verisini eş zamanlı çekiyoruz
      const [marketRes, walletRes] = await Promise.all([
        api.get('/watchlist/market'),
        walletApi.getPortfolio()
      ]);

      const newData = marketRes.data;
      const myPortfolio = walletRes.data.portfolio || [];

      for (const coin of newData) {
        // Sepet Kontrolü: Bu coin zaten cüzdanımda var mı?
        const isAlreadyInPortfolio = myPortfolio.some(
          (item: any) => item.symbol === coin.symbol
        );

        // ALIM KOŞULU: Sinyal AL ise VE sepetimde yoksa
        if (coin.signal === 'AL' && !isAlreadyInPortfolio) {
          try {
            await api.post('/wallet/buy', {
              symbol: coin.symbol,
              amount: 1000 / parseFloat(coin.price), // 1000 USDT'lik alım örneği
              price: parseFloat(coin.price)
            });
            console.log(`[BOT] ${coin.symbol} ilk kez keşfedildi ve alındı.`);
          } catch (err) {
            console.error("[BOT] Alım hatası:", err);
          }
        }
        
        // SATIŞ KOŞULU: Sinyal SAT ise VE sepetimde varsa sat
        else if (coin.signal === 'SAT' && isAlreadyInPortfolio) {
          try {
            await api.post('/wallet/sell', {
              symbol: coin.symbol,
              price: parseFloat(coin.price)
            });
            console.log(`[BOT] ${coin.symbol} SAT sinyaliyle elden çıkarıldı.`);
          } catch (err) {
            console.error("[BOT] Satış hatası:", err);
          }
        }
      }

      setMarketData(newData);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
      isProcessing.current = false;
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 saniyede bir analiz
    return () => clearInterval(interval);
  }, []);

  // Manuel alım onayı
  const handleBuyConfirm = async (amount: number) => {
    if (!selectedCoin) return;
    try {
      await walletApi.buyCoin({
        symbol: selectedCoin.symbol,
        amount: amount,
        price: selectedCoin.price
      });
      alert(`${amount} adet ${selectedCoin.symbol} başarıyla alındı!`);
      setSelectedCoin(null);
      fetchData(); // Listeyi güncelle
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  const handleFollow = (symbol: string) => console.log(`Following: ${symbol}`);

  return (
    <S.Layout>
      <Sidebar />
      <S.MainContent>
        <S.Header>
          <h1>Market Scanner</h1>
        </S.Header>
        
        {loading ? <p>Yükleniyor...</p> : (
          <>
            <VIPPanels data={marketData} />
            <ScannerTable 
              data={marketData} 
              onFollow={handleFollow} 
              onBuy={(coin) => setSelectedCoin(coin)} 
            />
          </>
        )}
      </S.MainContent>

      {selectedCoin && (
        <BuyModal 
          coin={selectedCoin} 
          onClose={() => setSelectedCoin(null)} 
          onConfirm={handleBuyConfirm}
        />
      )}
    </S.Layout>
  );
};

export default Dashboard;