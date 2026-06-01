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

  if (loading && !balance) return <S.LoadingContainer>Yükleniyor...</S.LoadingContainer>;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>
          Cüzdan
          {isLive && (
            <S.LiveBadgeContainer>
              <Badge type={isRealData ? "AL" : "NÖTR"}>BINANCE LIVE</Badge>
              <S.StatusIndicator $isActive={isRealData}>
                <S.StatusDot $isActive={isRealData} />
                {isRealData ? 'Bağlantı Aktif' : 'Bağlantı Bekleniyor'}
              </S.StatusIndicator>
            </S.LiveBadgeContainer>
          )}
        </PageTitle>
        <PageSubtitle>
          {isLive 
            ? 'Binance hesabınızdaki varlıkların TL karşılığı ve anlık durumu.' 
            : 'Simülasyon hesabı bakiyeniz ve nakit işlemleriniz.'}
        </PageSubtitle>
      </PageHeader>

      {error && (
        <S.ErrorAlert>
          ⚠️ {error}
        </S.ErrorAlert>
      )}

      <S.HeaderSection>
        <S.BalanceInfo>
          <h3>{isLive ? 'Toplam Tahmini Değer (TL)' : 'Toplam Bakiyem'}</h3>
          <S.BalanceValue $isRealData={isRealData}>
            {(balanceTRY ?? 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <S.BalanceUnit>TL</S.BalanceUnit>
          </S.BalanceValue>
          <S.BalanceEquivalent>
            ≈ {(balance ?? 0).toLocaleString('tr-TR')} <S.EquivalentUnit>USDT</S.EquivalentUnit>
            {usdtTryRate && <S.ExchangeRate>(1 USDT = {usdtTryRate} TL)</S.ExchangeRate>}
          </S.BalanceEquivalent>
        </S.BalanceInfo>
        
        {!isLive ? (
          <S.AddButton onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Bakiye Yükle
          </S.AddButton>
        ) : (
          <S.AddButton
            onClick={handleTestBuy}
            disabled={tradeLoading}
            style={{ background: '#0f9d58', color: 'white' }}
          >
            <ShoppingCart size={20} /> {tradeLoading ? 'İşleniyor...' : '20 TL ile BTC Al'}
          </S.AddButton>
        )}
      </S.HeaderSection>

      {isLive && assets && assets.length > 0 && (
        <S.HistorySection $marginBottom="40px">
          <S.AssetsHeaderRow>
            <PieChartIcon size={20} color="#1a73e8" />
            <S.SectionTitle>Varlık Bakiyeleri</S.SectionTitle>
          </S.AssetsHeaderRow>
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
                    <S.SymbolCell>{asset.symbol}</S.SymbolCell>
                    <Td>{(asset.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</Td>
                    <S.PriceCell>
                      {(asset.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </S.PriceCell>
                    <S.ValueCell>
                      {(asset.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </S.ValueCell>
                    <S.FreeCell>{(asset.free || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</S.FreeCell>
                    <S.LockedCell>{(asset.locked || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</S.LockedCell>
                    <Td><Badge type="NÖTR">{asset.symbol}</Badge></Td>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </S.HistorySection>
      )}

      <S.HistorySection>
        <S.TransactionHeaderRow>
          <WalletIcon size={20} color="#1a73e8" />
          <S.SectionTitle>{isLive ? 'Son İşlemler' : 'Hesap Hareketleri'}</S.SectionTitle>
        </S.TransactionHeaderRow>
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
                  <S.AmountCell>{tx.amount.toLocaleString('tr-TR')} {tx.symbol}</S.AmountCell>
                  <S.DescriptionCell>{tx.description || 'İşlem'}</S.DescriptionCell>
                  <Td>{new Date(tx.createdAt).toLocaleString('tr-TR')}</Td>
                </TableRow>
              )) : (
                <TableRow>
                  <S.EmptyCell colSpan={4}>
                    Henüz bir işlem kaydı bulunmuyor.
                  </S.EmptyCell>
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