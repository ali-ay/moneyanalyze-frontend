import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { walletApi } from '../../api/wallet'; // 1. API importu eklendi
import Sidebar from '../../components/Sidebar/Sidebar';
import VIPPanels from '../../components/AnalyticCard/VIPPanels';
import ScannerTable from '../../components/ScannerTable/ScannerTable';
import BuyModal from '../../components/BuyModal/BuyModal'; // 2. Modal importu eklendi
import * as S from './Dashboard.styles';

const Dashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);

// İşlem yapılan coinleri ve son sinyallerini tutmak için state
// Örn: { "BTCUSDT": "AL", "ETHUSDT": "SAT" }
const [processedSignals, setProcessedSignals] = useState<Record<string, string>>({});

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await api.get('/watchlist/market');
      const newData = res.data;

      for (const coin of newData) {
        const lastSignal = processedSignals[coin.symbol];

        // 1. ALIM KOŞULU: Sinyal "AL" ise VE daha önce bu coin için "AL" işlemi yapmadıysak
        if (coin.signal === 'AL' && lastSignal !== 'AL') {
          try {
            await api.post('/wallet/buy', {
              symbol: coin.symbol,
              amount: 1000 / coin.price,
              price: coin.price
            });
            
            // İşlemi hafızaya al: "Bu coin için AL yapıldı"
            setProcessedSignals(prev => ({ ...prev, [coin.symbol]: 'AL' }));
            console.log(`[BOT] ${coin.symbol} için ilk alım yapıldı. Sinyal değişene kadar tekrar alınmayacak.`);
          } catch (err) {
            console.error("[BOT] Alım hatası:", err);
          }
        }

        // 2. SATIŞ KOŞULU: Sinyal "SAT" ise VE daha önce bu coin için "SAT" işlemi yapmadıysak
        else if (coin.signal === 'SAT' && lastSignal !== 'SAT') {
          try {
            // Hafızada 'AL' kaydı varsa veya portföyde bu coin varsa sat
            await api.post('/wallet/sell', {
              symbol: coin.symbol,
              price: coin.price
              // Not: Backend tümünü satacak şekilde ayarlı değilse miktar eklenmeli
            });

            // İşlemi hafızaya al: "Bu coin için SAT yapıldı"
            setProcessedSignals(prev => ({ ...prev, [coin.symbol]: 'SAT' }));
            console.log(`[BOT] ${coin.symbol} için satış yapıldı. Yeni AL sinyali gelene kadar bekleniyor.`);
          } catch (err) {
            console.error("[BOT] Satış hatası:", err);
          }
        }
      }

      setMarketData(newData);
    } catch (err) {
      console.error("Market verisi çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  const interval = setInterval(fetchData, 30000);
  return () => clearInterval(interval);
}, [processedSignals]); // processedSignals değişimini takip etmeli

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
    } catch (err) {
      alert("Alım işlemi sırasında bir hata oluştu. Bakiyenizi kontrol edin.");
    }
  };

  const handleFollow = (symbol: string) => {
    console.log(`Following: ${symbol}`);
  };

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
              data={marketData} // 3. 'filteredData' yerine 'marketData' kullanıldı
              onFollow={handleFollow} 
              onBuy={(coin) => setSelectedCoin(coin)} 
            />
          </>
        )}
      </S.MainContent>

      {/* 4. Modal return bloğunun içine, Layout'un sonuna eklendi */}
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