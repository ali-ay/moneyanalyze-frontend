import { useEffect, useState } from 'react';
import api from '../../../api/axios';
import Sidebar from '../../../components/Sidebar/Sidebar';
import * as S from './History.styles';

// Tip tanımlamasını ekleyelim (Hata almamak için)
interface Transaction {
  id: string;
  createdAt: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: number | string;
  amount: number | string;
  totalValue: number | string;
}

const TransactionHistory = () => {
  const [history, setHistory] = useState<Transaction[]>([]); // any[] yerine Transaction[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/wallet/history');
        setHistory(res.data);
      } catch (err) {
        console.error("Geçmiş yüklenemedi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <S.Layout>
      <Sidebar />
      <S.MainContent>
        <S.HeaderSection>
          <h1>İşlem Geçmişi</h1>
          <p>Botun gerçekleştirdiği tüm alım ve satım hareketleri</p>
        </S.HeaderSection>

        {loading ? (
          <S.LoadingText>Loglar yükleniyor...</S.LoadingText>
        ) : history.length === 0 ? (
          <S.EmptyState>Henüz bir işlem kaydı bulunamadı.</S.EmptyState>
        ) : (
          <S.TableWrapper>
            <S.Table>
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>Varlık</th>
                  <th>İşlem Tipi</th>
                  <th>İşlem Fiyatı</th>
                  <th>Miktar</th>
                  <th>Toplam Tutar</th>
                </tr>
              </thead>
              <tbody>
                {history.map((tx) => {
                  // Verileri güvenli bir şekilde sayıya çevirelim
                  const price = Number(tx.price);
                  const amount = Number(tx.amount);
                  const total = tx.totalValue ? Number(tx.totalValue) : price * amount;

                  return (
                    <tr key={tx.id}>
                      <td>{new Date(tx.createdAt).toLocaleString('tr-TR')}</td>
                      <td className="symbol">{tx.symbol}</td>
                      <td>
                        <S.Badge type={tx.type}>
                          {tx.type === 'BUY' ? 'ALIM' : 'SATIŞ'}
                        </S.Badge>
                      </td>
                      <td>${price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td>{amount}</td>
                      <td className="total">
                        ${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </S.Table>
          </S.TableWrapper>
        )}
      </S.MainContent>
    </S.Layout>
  );
};

export default TransactionHistory;