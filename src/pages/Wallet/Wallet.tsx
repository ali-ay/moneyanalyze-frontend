import { useEffect, useState } from 'react';
import { walletApi } from '../../api/wallet';
import Sidebar from '../../components/Sidebar/Sidebar';
import * as S from './Wallet.styles';

const Wallet = () => {
  const [data, setData] = useState<any>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await walletApi.getPortfolio();
        console.log("Gelen Cüzdan Verisi:", res.data); // Veri geliyor mu kontrol et
        setData(res.data);
      } catch (err) {
        console.error("Cüzdan yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <S.Layout>
      <Sidebar />
      <S.MainContent>
        <h1>Cüzdanım</h1>
        <S.BalanceCard>
          <h3>Toplam Bakiyeniz</h3>
          <h2>${data?.balance?.toLocaleString() || '0.00'} USDT</h2>
        </S.BalanceCard>

        <h3>Varlıklarım</h3>
        {data?.portfolio?.length > 0 ? (
            <S.PortfolioTable>
              <thead>
                <tr>
                  <S.Th>Sembol</S.Th>
                  <S.Th>Miktar</S.Th>
                  <S.Th>Ort. Maliyet</S.Th>
                  <S.Th>Toplam Değer</S.Th>
                  <S.Th>Kar / Zarar</S.Th>
                  <S.Th>Güncel Değer</S.Th>
                </tr>
              </thead>
              <tbody>
                {data.portfolio.map((item: any) => {
                  // Örnek: anlikFiyat'ın Binance'ten geldiğini varsayalım. 
                  // Eğer gelmiyorsa useEffect ile fiyatları bir objede toplayabiliriz.
                  const currentPrice = item.currentPrice || item.averagePrice; // Şimdilik fallback
                  const profitLoss = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.id}>
                      <S.Td><strong>{item.symbol}</strong></S.Td>
                      <S.Td>{(item.amount || 0).toFixed(4)}</S.Td>
                      
                      {/* Ortalama Maliyet */}
                      <S.Td>${item.averagePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</S.Td>
                      
                      {/* ANLIK FİYAT (Yeni Eklenen) */}
                      <S.Td style={{ color: isProfit ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                        ${currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </S.Td>

                      {/* KAR / ZARAR YÜZDESİ (Yeni Eklenen) */}
                      <S.Td style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                        {isProfit ? '▲' : '▼'} {Math.abs(profitLoss).toFixed(2)}%
                      </S.Td>

                      {/* TOPLAM DEĞER (Anlık fiyata göre) */}
                      <S.Td>
                        ${(item.amount * currentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </S.Td>
                    </tr>
                  );
                })}
              </tbody>
          </S.PortfolioTable>
        ) : (
          <p>Henüz hiç coin almamışsınız.</p>
        )}
      </S.MainContent>
    </S.Layout>
  );
};

export default Wallet;