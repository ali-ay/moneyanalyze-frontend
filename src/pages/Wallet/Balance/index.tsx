import { useState } from 'react';
import * as S from './styles';
import { useWallet } from './logic';
import DepositModal from '../../../components/modals/DepositModal';
import { Plus, Wallet as WalletIcon, PieChart as PieChartIcon, ShoppingCart } from 'lucide-react';
import { PageContainer, PageHeader, PageTitle, PageSubtitle } from '../../../components/ui/Layout.styles';
import { TableContainer, Table, Th, Td, TableRow, Badge } from '../../../components/ui/Table.styles';
import { walletApi } from '../../../services/wallet.api';

const WalletBalance = () => {
  const { balance, balanceTRY, usdtTryRate, assets, transactions, tradingMode, loading, error, isRealData, handleDepositSubmit, fetchWalletData } = useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);

  const handleTestBuy = async () => {
    if (!window.confirm("20 TL tutarında BTC alımı yapılacaktır. Onaylıyor musunuz?")) return;
    
    try {
      setTradeLoading(true);
      const res = await walletApi.executeTrade('BTCTRY', 'BUY', 20);
      alert("Alım Başarılı! \nDetaylar: " + JSON.stringify(res.data.data));
      await fetchWalletData();
    } catch (err: any) {
      alert("Alım Hatası: " + err.message);
    } finally {
      setTradeLoading(false);
    }
  };
  
  const isLive = tradingMode === 'LIVE';

  if (loading && !balance) return <div style={{ padding: '40px', textAlign: 'center' }}>Yükleniyor...</div>;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          Cüzdan 
          {isLive && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', verticalAlign: 'middle', marginLeft: 15 }}>
              <Badge type={isRealData ? "AL" : "NÖTR"}>BINANCE LIVE</Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: isRealData ? '#0f9d58' : '#db4437' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: isRealData ? '#0f9d58' : '#db4437' }} />
                {isRealData ? 'Bağlantı Aktif' : 'Bağlantı Bekleniyor'}
              </div>
            </div>
          )}
        </PageTitle>
        <PageSubtitle>
          {isLive 
            ? 'Binance hesabınızdaki varlıkların TL karşılığı ve anlık durumu.' 
            : 'Simülasyon hesabı bakiyeniz ve nakit işlemleriniz.'}
        </PageSubtitle>
      </PageHeader>

      {error && (
        <div style={{ background: '#fce8e6', color: '#d93025', padding: '16px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #f5c2c7', fontSize: '14px', fontWeight: 500 }}>
          ⚠️ {error}
        </div>
      )}

      <S.HeaderSection>
        <S.BalanceInfo>
          <h3>{isLive ? 'Toplam Tahmini Değer (TL)' : 'Toplam Bakiyem'}</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: isRealData ? '#1a73e8' : '#9AA0A6' }}>
            {(balanceTRY ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
            <span style={{fontSize: '1.2rem', fontWeight: 600, marginLeft: 8, color: '#5F6368'}}>TL</span>
          </div>
          <div style={{ marginTop: '8px', fontSize: '1.1rem', color: '#5F6368' }}>
            ≈ {(balance ?? 0).toLocaleString('tr-TR')} <span style={{fontWeight: 600}}>USDT</span>
            {usdtTryRate && <span style={{ fontSize: '0.9rem', marginLeft: 12, color: '#9AA0A6' }}>(1 USDT = {usdtTryRate} TL)</span>}
          </div>
        </S.BalanceInfo>
        
        {!isLive ? (
          <S.AddButton onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Bakiye Yükle
          </S.AddButton>
        ) : (
          <S.AddButton 
            onClick={handleTestBuy} 
            disabled={tradeLoading}
            style={{ background: '#0f9d58' }}
          >
            <ShoppingCart size={20} /> {tradeLoading ? 'İşleniyor...' : '20 TL ile BTC Al'}
          </S.AddButton>
        )}
      </S.HeaderSection>

      {isLive && assets && assets.length > 0 && (
        <S.HistorySection style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <PieChartIcon size={20} color="#1a73e8" />
            <h3 style={{ margin: 0 }}>Varlık Bakiyeleri</h3>
          </div>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <Th>Varlık</Th>
                  <Th>Miktar</Th>
                  <Th>Birim Fiyat (USDT)</Th>
                  <Th>Toplam Değer (USDT)</Th>
                  <Th>Kullanılabilir</Th>
                  <Th>Kilitli</Th>
                  <Th>Sembol</Th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, idx) => (
                  <TableRow key={asset.symbol || idx}>
                    <Td style={{ fontWeight: 'bold' }}>{asset.symbol}</Td>
                    <Td>{(asset.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Td>
                    <Td style={{ color: '#1a73e8', fontWeight: 600 }}>
                      {(asset.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Td>
                    <Td style={{ fontWeight: 'bold' }}>
                      {(asset.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Td>
                    <Td style={{ color: '#0f9d58' }}>{(asset.free || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</Td>
                    <Td style={{ color: '#f4b400' }}>{(asset.locked || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</Td>
                    <Td><Badge type="NÖTR">{asset.symbol}</Badge></Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </S.HistorySection>
      )}

      <S.HistorySection>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <WalletIcon size={20} color="#1a73e8" />
          <h3 style={{ margin: 0 }}>{isLive ? 'Son İşlemler' : 'Hesap Hareketleri'}</h3>
        </div>
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>İşlem</Th>
                <Th>Miktar</Th>
                <Th>Açıklama</Th>
                <Th>Tarih</Th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? transactions.map((tx: any) => (
                <TableRow key={tx.id}>
                  <Td>
                    <Badge type={tx.type === 'DEPOSIT' || tx.type === 'BUY' ? 'AL' : 'SAT'}>
                      {tx.type === 'DEPOSIT' ? 'PARA YATIRMA' : tx.type === 'BUY' ? 'ALIM' : tx.type === 'SELL' ? 'SATIM' : 'ÇEKME'}
                    </Badge>
                  </Td>
                  <Td style={{ fontWeight: 'bold' }}>{tx.amount.toLocaleString('tr-TR')} {tx.symbol}</Td>
                  <Td style={{ color: '#5F6368' }}>{tx.description || 'İşlem'}</Td>
                  <Td>{new Date(tx.createdAt).toLocaleString('tr-TR')}</Td>
                </TableRow>
              )) : (
                <TableRow>
                  <Td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#9AA0A6' }}>
                    Henüz bir işlem kaydı bulunmuyor.
                  </Td>
                </TableRow>
              )}
            </tbody>
          </Table>
        </TableContainer>
      </S.HistorySection>

      {isModalOpen && (
        <DepositModal 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={handleDepositSubmit} 
        />
      )}
    </PageContainer>
  );
};

export default WalletBalance;