import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlistLogic } from './logic';
import * as S from './styles';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../components/ui/Card.styles';
import { TableContainer, Table, Th, Td, TableRow } from '../../components/ui/Table.styles';
import { Star, TrendingUp, TrendingDown, Eye, Trash2 } from 'lucide-react';
import { BuyModal } from '../../components/modals/BuyModal';
import { useMarketMode } from '../../context/MarketModeContext';
import { useNotification } from '../../core/providers/NotificationContext';
import { Button } from '../../components/ui/Button';
import api from '../../services/apiClient';
import styled from 'styled-components';

const RemoveBtn = styled.button`
  background: none;
  border: none;
  color: #db4437;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: rgba(219, 68, 55, 0.1);
  }
`;

const BuyBtn = styled.button`
  background: #0f9d58;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 16px;
  border-radius: 6px;
  transition: all 0.2s;

  &:hover {
    background: #0b8043;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

const Badge = styled.span<{ type: string }>`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  background: ${props =>
    props.type === 'AL' ? 'rgba(15, 157, 88, 0.1)' :
      props.type === 'SAT' ? 'rgba(219, 68, 55, 0.1)' :
        'rgba(95, 99, 104, 0.1)'};
  color: ${props =>
    props.type === 'AL' ? '#0f9d58' :
      props.type === 'SAT' ? '#db4437' :
        '#5f6368'};
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const ChangeValue = styled.span<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 13px;
  padding: 4px 10px;
  border-radius: 6px;
  color: ${props => props.$isPositive ? props.theme.colors.success : props.theme.colors.danger};
  background: ${props => props.$isPositive ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.textMain};
`;

const Watchlist: React.FC = () => {
  const { mode } = useMarketMode();
  const navigate = useNavigate();
  const { marketData, loading, lastUpdates, handleRemove, getMeta, period, setPeriod, fetchData } = useWatchlistLogic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { showNotification } = useNotification();

  const handleBuy = (coin: any) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleScanAll = async () => {
    try {
      setIsScanning(true);
      await api.post('/stock/analyze-all');
      showNotification('Tüm periyotlar için derin tarama başlatıldı. Tamamlandığında veriler güncellenecek.', 'success');
      setTimeout(() => setIsScanning(false), 5000);
    } catch (err) {
      showNotification('Tarama başlatılamadı.', 'error');
      setIsScanning(false);
    }
  };

  const buySignals = mode === 'stock'
    ? marketData.filter(c => c.isOpportunity).length
    : marketData.filter(c => c.totalScore >= 4).length;

  const sellSignals = mode === 'stock'
    ? 0
    : marketData.filter(c => c.totalSellScore >= 3).length;

  const periods = [
    { id: 'weekly', label: 'Haftalık' },
    { id: 'monthly', label: 'Aylık' },
    { id: '3mo', label: '3 Aylık' },
    { id: '6mo', label: '6 Aylık' },
    { id: '1y', label: 'Yıllık' }
  ];

  function renderTable(data: any[], isAuto: boolean) {
    if (loading && data.length === 0) return <LoadingState>Yükleniyor...</LoadingState>;
    if (data.length === 0) return (
      <EmptyState style={{ padding: '40px' }}>
        <div style={{ color: '#9AA0A6' }}>{isAuto ? 'Şu an güçlü bir alım sinyali bulunmuyor.' : 'Henüz manuel bir hisse eklemediniz.'}</div>
      </EmptyState>
    );

    return (
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <Th>Durum</Th>
              <Th>Varlık</Th>
              <Th>{isAuto ? 'Sinyal Fiyatı' : 'Eklenme Fiyatı'}</Th>
              <Th>Anlık Fiyat</Th>
              <Th>Kâr / Zarar (%)</Th>
              <Th>Son Güncelleme</Th>
              <Th style={{ textAlign: 'right' }}>İşlemler</Th>
            </tr>
          </thead>
          <tbody>
            {data.map(coin => {
              const meta = getMeta(coin.symbol);
              const currentPrice = parseFloat(String(coin.price).replace(/,/g, '')) || 0;
              const addedPrice = meta?.addedPrice || 0;
              const changePercent = addedPrice > 0
                ? ((currentPrice - addedPrice) / addedPrice * 100)
                : 0;
              const isPositive = changePercent >= 0;
              const isStock = mode === 'stock';
              const currency = isStock ? '₺' : '$';
              const lastUpdate = lastUpdates[coin.symbol];

              return (
                <TableRow
                  key={coin.symbol}
                  onClick={() => isStock ? navigate(`/dashboard/stock/${coin.symbol}`) : null}
                  style={{ cursor: isStock ? 'pointer' : 'default' }}
                >
                  <Td>
                    <Badge type={coin.isOpportunity ? 'AL' : 'NÖTR'}>
                      {coin.isOpportunity ? '🤖 🚀' : '👀 TAKİP'}
                    </Badge>
                  </Td>
                  <Td style={{ fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{coin.symbol}</span>
                      {isAuto && (
                        <span style={{ fontSize: '10px', color: '#1A73E8', fontWeight: 700 }}>
                          SKOR: {coin.strengthScore}
                        </span>
                      )}
                    </div>
                  </Td>
                  <Td>
                    {addedPrice > 0
                      ? `${currency}${addedPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`
                      : '--'}
                  </Td>
                  <Td>
                    <S.LivePrice>
                      <S.LiveDot />
                      {currency}{currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </S.LivePrice>
                  </Td>
                  <Td>
                    {addedPrice > 0 ? (
                      <ChangeValue $isPositive={isPositive}>
                        {isPositive ? '▲' : '▼'} %{Math.abs(changePercent).toFixed(2)}
                      </ChangeValue>
                    ) : '--'}
                  </Td>
                  <Td style={{ fontSize: '12px', color: '#5F6368' }}>
                    {lastUpdate ? new Date(lastUpdate).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                  </Td>
                  <Td>
                    <ActionGroup>
                      <BuyBtn onClick={(e) => { e.stopPropagation(); handleBuy(coin); }}>AL</BuyBtn>
                      <RemoveBtn onClick={(e) => { e.stopPropagation(); handleRemove(coin.symbol); }}>
                        <Trash2 size={14} />
                      </RemoveBtn>
                    </ActionGroup>
                  </Td>
                </TableRow>
              );
            })}
          </tbody>
        </Table>
      </TableContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <PageTitle>Watchlist</PageTitle>
            <PageSubtitle>Takip ettiğiniz varlıkların anlık durumu.</PageSubtitle>
          </div>

          {mode === 'stock' && (
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Button
                $variant="secondary"
                onClick={handleScanAll}
                disabled={isScanning}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                {isScanning ? '⏳ Tarama Yapılıyor...' : '🔍 Tümünü Tara'}
              </Button>

              <div style={{ display: 'flex', gap: '8px', background: '#f1f3f4', padding: '4px', borderRadius: '8px' }}>
                {periods.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPeriod(p.id)}
                    style={{
                      border: 'none',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: period === p.id ? '#fff' : 'transparent',
                      color: period === p.id ? '#1A73E8' : '#5F6368',
                      boxShadow: period === p.id ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                      transition: 'all 0.2s'
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PageHeader>

      <MetricsGrid>
        <MetricCard>
          <CardHeader>
            <CardTitle>Alım Sinyali</CardTitle>
            <CardIcon $variant="success">
              <TrendingUp size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>{buySignals}</CardValue>
        </MetricCard>

        <MetricCard>
          <CardHeader>
            <CardTitle>Satış Sinyali</CardTitle>
            <CardIcon $variant="danger">
              <TrendingDown size={20} />
            </CardIcon>
          </CardHeader>
          <CardValue>{sellSignals}</CardValue>
        </MetricCard>
      </MetricsGrid>

      <SectionTitle>
        <Star size={20} color="#1A73E8" /> Yapay Zeka Fırsatları
        <span style={{ fontSize: '12px', fontWeight: 400, marginLeft: '8px', color: '#5F6368' }}>
          (Son analize göre alım sinyali verenler)
        </span>
      </SectionTitle>

      {renderTable(marketData.filter(c => c.isOpportunity), true)}

      <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SectionTitle>
          <Eye size={20} color="#1A73E8" /> Kişisel Takip Listem
        </SectionTitle>
        <Button $variant="primary" onClick={() => {
          const sym = prompt('Eklemek istediğiniz hisse sembolünü girin (Örn: THYAO):');
          if (sym) {
            import('../../services/watchlist.api').then(m => {
              m.addToWatchlist(sym.toUpperCase(), 'stock');
              fetchData();
            });
          }
        }}>
          + Hisse Ekle
        </Button>
      </div>

      {renderTable(marketData.filter(c => !c.isOpportunity), false)}

      {isModalOpen && selectedCoin && (
        <BuyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coin={selectedCoin}
          onSuccess={fetchData}
        />
      )}
    </PageContainer>
  );
};

export default Watchlist;
