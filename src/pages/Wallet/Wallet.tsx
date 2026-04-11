import { useEffect, useState } from 'react';
import { walletApi } from '../../api/wallet';
import Sidebar from '../../components/Sidebar/Sidebar';
import { io } from 'socket.io-client';
import * as S from './Wallet.styles';

const SOCKET_URL = "https://moneyanalyze-backend-eu.onrender.com";

const Wallet = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. WebSocket Bağlantısı
  useEffect(() => {
    const socket = io(SOCKET_URL, { withCredentials: true });

    socket.on('tickerUpdate', (ticker) => {
      setData((prevData: any) => {
        if (!prevData || !prevData.portfolio) return prevData;

        const updatedPortfolio = prevData.portfolio.map((item: any) => {
          if (item.symbol === ticker.symbol) {
            return { ...item, currentPrice: parseFloat(ticker.price) };
          }
          return item;
        });

        return { ...prevData, portfolio: updatedPortfolio };
      });
    });

    return () => { socket.disconnect(); };
  }, []);

  // 2. İlk Veri Yükleme
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await walletApi.getPortfolio();
        const initialData = res.data;
        if (initialData.portfolio) {
          initialData.portfolio = initialData.portfolio.map((item: any) => ({
            ...item,
            currentPrice: item.currentPrice || item.averagePrice
          }));
        }
        setData(initialData);
      } catch (err) {
        console.error("Cüzdan yüklenirken hata:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  if (loading) return <S.MainContent><p>Yükleniyor...</p></S.MainContent>;

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
          <>
            {/* MASAÜSTÜ TABLO GÖRÜNÜMÜ: Wallet.styles.ts içinde mobilde gizlendi */}
            <S.PortfolioTable>
              <thead>
                <tr>
                  <S.Th>Sembol</S.Th>
                  <S.Th>Miktar</S.Th>
                  <S.Th>Ort. Maliyet</S.Th>
                  <S.Th>Güncel Fiyat</S.Th>
                  <S.Th>Kar / Zarar</S.Th>
                  <S.Th>Toplam Değer</S.Th>
                </tr>
              </thead>
              <tbody>
                {data.portfolio.map((item: any) => {
                  const currentPrice = item.currentPrice || item.averagePrice;
                  const profitLoss = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.id}>
                      <S.Td><strong>{item.symbol}</strong></S.Td>
                      <S.Td>{(item.amount || 0).toFixed(4)}</S.Td>
                      <S.Td>${item.averagePrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</S.Td>
                      <S.Td style={{ color: isProfit ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                        ${currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 4 })}
                      </S.Td>
                      <S.Td style={{ color: isProfit ? '#10b981' : '#ef4444' }}>
                        {isProfit ? '▲' : '▼'} {Math.abs(profitLoss).toFixed(2)}%
                      </S.Td>
                      <S.Td>
                        ${(item.amount * currentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                      </S.Td>
                    </tr>
                  );
                })}
              </tbody>
            </S.PortfolioTable>

            {/* MOBİL KART GÖRÜNÜMÜ: Wallet.styles.ts içinde sadece mobilde görünür */}
            <S.MobileCardContainer>
              {data.portfolio.map((item: any) => {
                const currentPrice = item.currentPrice || item.averagePrice;
                const profitLoss = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;
                const isProfit = profitLoss >= 0;

                return (
                  <S.AssetCard key={item.id}>
                    <S.CardRow>
                      <S.SymbolInfo>
                        <strong>{item.symbol}</strong>
                        <span>Miktar: {item.amount.toFixed(4)}</span>
                      </S.SymbolInfo>
                      <S.PriceInfo $isProfit={isProfit}>
                        <div className="price">${currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</div>
                        <div className="profit">
                          {isProfit ? '▲' : '▼'} %{Math.abs(profitLoss).toFixed(2)}
                        </div>
                      </S.PriceInfo>
                    </S.CardRow>
                    
                    <S.CardRow>
                      <S.SymbolInfo>
                        <span>Maliyet: ${item.averagePrice.toFixed(2)}</span>
                      </S.SymbolInfo>
                      <S.PriceInfo>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>Toplam: </span>
                        <strong style={{ color: '#f8fafc' }}>
                          ${(item.amount * currentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                        </strong>
                      </S.PriceInfo>
                    </S.CardRow>
                  </S.AssetCard>
                );
              })}
            </S.MobileCardContainer>
          </>
        ) : (
          <S.EmptyState>Henüz hiç coin almamışsınız.</S.EmptyState>
        )}
      </S.MainContent>
    </S.Layout>
  );
};

export default Wallet;