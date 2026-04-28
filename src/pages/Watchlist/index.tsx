import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWatchlistLogic } from './logic';
import * as S from './styles';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../components/ui/Card.styles';
import { TableContainer, Table, Th, Td, TableRow } from '../../components/ui/Table.styles';
import { Star, TrendingUp, TrendingDown, Eye, Trash2, History } from 'lucide-react';
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

const SettingsPanel = styled.div`
  background: #fff;
  border: 1px solid #e8eaed;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const SettingItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label {
    font-size: 12px;
    font-weight: 700;
    color: #5F6368;
  }
  input {
    padding: 10px;
    border: 1px solid #dadce0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    &:focus { border-color: #1a73e8; outline: none; }
  }
`;

const Watchlist: React.FC = () => {
  const { mode } = useMarketMode();
  const navigate = useNavigate();
  const { marketData, watchlistMeta, loading, lastUpdates, handleRemove, getMeta, period, setPeriod, fetchData, analysisSettings, updateSettings } = useWatchlistLogic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editedSettings, setEditedSettings] = useState<any>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (analysisSettings) setEditedSettings(analysisSettings);
  }, [analysisSettings]);

  const handleBuy = (coin: any) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  const handleScanAll = async () => {
    try {
      setIsScanning(true);
      
      // İzleme listesinde olanları taramaya dahil etmemek için sembolleri topla
      const excludeSymbols = watchlistMeta.map(item => item.symbol);
      
      const res = await api.post('/stock/analyze-all', { 
        period,
        excludeSymbols 
      });
      
      const foundCount = res.data.signalsFound || 0;
      const signals = res.data.signals || [];
      
      if (foundCount > 0) {
        // Bulunanları kalıcı listeye ekle
        const { addToWatchlist } = await import('../../services/watchlist.api');
        signals.forEach((s: any) => {
          addToWatchlist(s.symbol, s.price, 'stock');
        });

        showNotification(`${period} periyodu için tarama tamamlandı. ${foundCount} yeni hisse izleme listenize eklendi.`, 'success');
      } else {
        showNotification(`${period} periyodu için tarama tamamlandı, kriterlere uygun yeni hisse bulunamadı.`, 'info');
      }
      
      await fetchData();
      setIsScanning(false);
    } catch (err) {
      console.error('Tarama hatası:', err);
      showNotification('Tarama sırasında bir hata oluştu.', 'error');
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
              <Th>Sinyal Tarihi</Th>
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
                  <Td style={{ fontSize: '12px', color: '#5F6368' }}>
                    {meta?.addedAt ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <History size={12} />
                        {new Date(meta.addedAt).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    ) : '-'}
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
                onClick={() => navigate('/dashboard/tracking')}
                style={{ fontSize: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <History size={14} /> Hareket Kaydı
              </Button>

              <Button
                $variant="secondary"
                onClick={() => setShowSettings(!showSettings)}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                {showSettings ? '⚙️ Ayarları Kapat' : '⚙️ Analiz Ayarları'}
              </Button>

              <Button
                $variant="primary"
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

      {showSettings && editedSettings && (
        <SettingsPanel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>📊 Tarama Kriterleri & Ağırlıklar</h3>
            <span style={{ fontSize: '12px', color: '#5F6368' }}>Bu ayarlar tüm tarama sonuçlarını etkiler.</span>
          </div>
          
          <SettingsGrid>
            <SettingItem>
              <label>Trend Puanı (SMA20 {'>'} SMA50)</label>
              <input 
                type="number" 
                value={editedSettings.uptrendWeight} 
                onChange={e => setEditedSettings({ ...editedSettings, uptrendWeight: parseInt(e.target.value) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Golden Cross Puanı</label>
              <input 
                type="number" 
                value={editedSettings.goldenCrossWeight} 
                onChange={e => setEditedSettings({ ...editedSettings, goldenCrossWeight: parseInt(e.target.value) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Minimum RSI</label>
              <input 
                type="number" 
                value={editedSettings.rsiMin} 
                onChange={e => setEditedSettings({ ...editedSettings, rsiMin: parseInt(e.target.value) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Maximum RSI</label>
              <input 
                type="number" 
                value={editedSettings.rsiMax} 
                onChange={e => setEditedSettings({ ...editedSettings, rsiMax: parseInt(e.target.value) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Hacim Çarpanı (x Ort.)</label>
              <input 
                type="number" 
                step="0.1"
                value={editedSettings.volumeMultiplier} 
                onChange={e => setEditedSettings({ ...editedSettings, volumeMultiplier: parseFloat(e.target.value) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Fiyat Kırılımı (% Artış)</label>
              <input 
                type="number" 
                step="0.01"
                value={(editedSettings.priceBreakout - 1) * 100} 
                onChange={e => setEditedSettings({ ...editedSettings, priceBreakout: 1 + (parseFloat(e.target.value) / 100) })}
              />
            </SettingItem>
            <SettingItem>
              <label>Min. Toplam Skor (Sinyal İçin)</label>
              <input 
                type="number" 
                value={editedSettings.minScore} 
                onChange={e => setEditedSettings({ ...editedSettings, minScore: parseInt(e.target.value) })}
              />
            </SettingItem>
          </SettingsGrid>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button $variant="primary" onClick={() => updateSettings(editedSettings)}>Ayarları Kaydet</Button>
            <Button $variant="secondary" onClick={() => setEditedSettings(analysisSettings)}>Sıfırla</Button>
          </div>
        </SettingsPanel>
      )}

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
        <Button $variant="primary" onClick={async () => {
          const sym = prompt('Eklemek istediğiniz hisse sembolünü girin (Örn: THYAO):');
          if (!sym) return;
          const cleanSym = sym.toUpperCase();
          try {
            // Eklemeden önce mevcut fiyatı çekelim — addToWatchlist 0/negatif fiyatları filtreliyor
            const apiClient = (await import('../../services/apiClient')).default;
            const res = await apiClient.get(`/stock/info/${cleanSym}`);
            const price = Number(res.data?.quote?.price) || 1;
            const m = await import('../../services/watchlist.api');
            m.addToWatchlist(cleanSym, price, 'stock');
            fetchData();
          } catch {
            const m = await import('../../services/watchlist.api');
            // Fiyat alınamasa bile takip listesine ekleyebilelim — placeholder 1
            m.addToWatchlist(cleanSym, 1, 'stock');
            fetchData();
          }
        }}>
          + Hisse Ekle
        </Button>
      </div>

      {renderTable(marketData.filter(c => !c.isOpportunity), false)}

      {isModalOpen && selectedCoin && (
        <BuyModal
          onClose={() => setIsModalOpen(false)}
          coin={selectedCoin}
          onSuccess={fetchData}
        />
      )}
    </PageContainer>
  );
};

export default Watchlist;
