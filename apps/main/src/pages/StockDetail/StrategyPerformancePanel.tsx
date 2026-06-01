import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card } from '../../components/ui/Card';
import { Trophy, Activity, Info, ChevronDown, ChevronUp } from 'lucide-react';
import apiClient from '../../services/apiClient';

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Td = styled.td`
  padding: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StrategyName = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: color 0.2s;
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const DescriptionBox = styled.div`
  background: rgba(26, 115, 232, 0.05);
  padding: 12px;
  border-radius: 8px;
  margin-top: 4px;
  margin-bottom: 12px;
  font-size: 0.8125rem;
  line-height: 1.5;
  color: ${props => props.theme.colors.textMain};
  border-left: 4px solid ${props => props.theme.colors.primary};
`;

const CurrentBadge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  margin-left: 8px;
`;

interface Performance {
  strategyId: string;
  winRate: number;
  avgProfit: number;
  totalSignals: number;
  isCurrent: boolean;
  rsiThreshold?: number;
  smaShort?: number;
  smaLong?: number;
  stopLossMultiplier?: number;
}

const getStrategyLogic = (perf: Performance) => {
  const logics: Record<string, string> = {
    SUPERTREND_FOLLOW: `Trend takibi odaklıdır. SuperTrend (10, 3) indikatörü 'Al' konumundayken fiyatın SMA ${perf.smaLong || 50} üzerinde kalmasını kollar. Stop-Loss çarpanı ${perf.stopLossMultiplier || 2.0} olarak ayarlanmıştır.`,
    
    VOLATILITY_BREAKOUT: `Fiyatın Bollinger (20, 2) üst bandını kırmasını ve işlem hacminin son 5 günlük ortalamanın en az 1.3 katı olmasını şart koşar. Volatilite artışını kâra dönüştürmeyi hedefler.`,
    
    TREND_FOLLOWING: `Hızlı ortalamanın (SMA ${perf.smaShort || 20}), yavaş ortalamayı (SMA ${perf.smaLong || 50}) yukarı kesmesini ve MACD'nin pozitif bölgede olmasını bekler. Fiyat SMA 200 üzerindeyse güven skoru artar.`,
    
    MOMENTUM: `İşlem hacminin son 5 günün 1.5 katına çıkmasını ve fiyatın önceki güne göre en az %2 artışla kırılım yapmasını kollar. MACD histogramındaki ivmelenmeyi temel alır.`,
    
    MEAN_REVERSION: `Fiyatın aşırı satım bölgesine (RSI < ${perf.rsiThreshold || 30}) düşmesini ve Bollinger alt bandına dokunmasını bekler. Fiyatın kısa süre içinde ortalamaya (SMA ${perf.smaShort || 20}) döneceği varsayımıyla çalışır.`
  };
  return logics[perf.strategyId] || "Bu strateji için henüz detaylı kural seti tanımlanmadı.";
};

export const StrategyPerformancePanel: React.FC<{ symbol: string; period: string }> = ({ symbol, period }) => {
  const [data, setData] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get(`/stock/strategy-performance/${symbol}?period=${period}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching strategy performance:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, period]);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Performans verileri analiz ediliyor...</div>;
  
  if (data.length === 0) {
    return (
      <Card style={{ marginTop: '24px', border: '1px dashed #444' }}>
        <Card.Body style={{ textAlign: 'center', padding: '30px' }}>
          <Activity size={32} color="#666" style={{ marginBottom: '12px' }} />
          <div style={{ color: '#999', fontSize: '14px' }}>
            Bu hisse için henüz strateji performans kaydı bulunmuyor.
            <br />
            Aşağıdaki <b>"AI Analizi Başlat"</b> butonuna basarak karne notlarını oluşturabilirsiniz.
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ marginTop: '24px' }}>
      <Card.Body>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <Trophy size={20} color="#FFD700" />
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Strateji Karşılaştırma Karne Notları</h3>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Strateji</Th>
              <Th>Win Rate</Th>
              <Th>Ort. Kâr</Th>
              <Th>Sinyal Sayısı</Th>
              <Th>Ayarlar</Th>
              <Th>Durum</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((perf, idx) => (
              <React.Fragment key={idx}>
                <tr>
                  <Td>
                    <StrategyName onClick={() => setExpandedId(expandedId === idx ? null : idx)}>
                      <span style={{ fontWeight: 700 }}>{perf.strategyId}</span>
                      <Info size={14} style={{ opacity: 0.6 }} />
                      {expandedId === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </StrategyName>
                  </Td>
                  <Td>
                    <span style={{ color: perf.winRate >= 70 ? '#28a745' : perf.winRate >= 50 ? '#ffc107' : '#dc3545', fontWeight: 700 }}>
                      %{perf.winRate.toFixed(1)}
                    </span>
                  </Td>
                  <Td>
                    <span style={{ color: perf.avgProfit > 0 ? '#28a745' : '#dc3545', fontWeight: 600 }}>
                      %{perf.avgProfit.toFixed(2)}
                    </span>
                  </Td>
                  <Td>{perf.totalSignals}</Td>
                  <Td style={{ fontSize: '11px', color: '#888' }}>
                    RSI: {perf.rsiThreshold} | SMA: {perf.smaShort}/{perf.smaLong} | SL: {perf.stopLossMultiplier}
                  </Td>
                  <Td>
                    {perf.isCurrent ? (
                      <CurrentBadge>AKTİF</CurrentBadge>
                    ) : (
                      <span style={{ fontSize: '10px', color: '#666' }}>Eski</span>
                    )}
                  </Td>
                </tr>
                {expandedId === idx && (
                  <tr>
                    <Td colSpan={6} style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <DescriptionBox>
                        {getStrategyLogic(perf)}
                      </DescriptionBox>
                    </Td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};
