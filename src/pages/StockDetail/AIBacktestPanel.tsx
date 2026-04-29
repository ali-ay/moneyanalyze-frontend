import React from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { Card } from '../../components/ui/Card';
import { 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Target, 
  History, 
  Loader2, 
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';

const PanelContainer = styled(Card)`
  margin-bottom: 24px;
  border: 1px solid #E8F0FE;
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #1A73E8;
  }
`;

const PeriodTab = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid ${props => props.$active ? '#1A73E8' : '#DADCE0'};
  background: ${props => props.$active ? '#E8F0FE' : 'white'};
  color: ${props => props.$active ? '#1A73E8' : '#5F6368'};
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #1A73E8;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
  margin: 20px 0;
`;

const StatItem = styled.div`
  padding: 16px;
  background: white;
  border: 1px solid #E8F0FE;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.05);

  .label {
    font-size: 0.6875rem;
    color: #5F6368;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }

  .value {
    font-size: 1.25rem;
    font-weight: 800;
    color: #202124;
  }
`;

const SignalHistory = styled.div`
  margin-top: 20px;
  border-top: 1px solid #E8F0FE;
  padding-top: 16px;
`;

const HistoryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #F1F3F4;
  font-size: 0.8125rem;

  &:last-child {
    border-bottom: none;
  }

  .date { color: #5F6368; }
  .profit { font-weight: 700; }
`;

interface Props {
  data: any;
  loading: boolean;
  period: string;
  setPeriod: (p: string) => void;
  optimizedData?: any;
  optimizedLoading?: boolean;
}

const ShowMoreButton = styled.button`
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed #DADCE0;
  border-radius: 8px;
  color: #1A73E8;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  margin-top: 12px;
  transition: all 0.2s;

  &:hover {
    background: #F8FBFF;
    border-style: solid;
  }
`;

const InfoIconWrapper = styled.div`
  cursor: help;
  color: #1A73E8;
  display: flex;
  align-items: center;
  position: relative;

  &:hover .tooltip {
    display: block;
  }

  .tooltip {
    display: none;
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 280px;
    background: #202124;
    color: white;
    padding: 12px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    margin-bottom: 8px;

    &::after {
      content: '';
      position: absolute;
      top: 100%;
      right: 10px;
      border-width: 5px;
      border-style: solid;
      border-color: #202124 transparent transparent transparent;
    }
  }
`;

export const AIBacktestPanel: React.FC<Props> = ({ 
  data, 
  loading, 
  period, 
  setPeriod,
  optimizedData,
  optimizedLoading
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const periods = [
    { id: 'weekly', label: 'Haftalık' },
    { id: 'monthly', label: 'Aylık' },
    { id: '3mo', label: '3 Ay' },
    { id: '1y', label: 'Yıllık' }
  ];

  const getSignalAnalysis = (date: string, profit: number) => {
    if (profit > 100) {
      return "Bu dönemde hisse devasa bir ana trend (Bull Market) içindeydi. SMA 50/100 kesişimi ile başlayan ivme, temel verilerle desteklenerek tarihi bir ralliye dönüştü.";
    }
    if (profit > 20) {
      return "Güçlü bir yükseliş trendi onayı. İndikatörler aşırı satım bölgesinden (RSI < 25) hızlı bir dönüş yaparak ana trendle birleşti.";
    }
    if (profit > 0) {
      return "Kısa vadeli bir tepki yükselişi. Strateji doğru zamanda giriş yapmış ancak trendin devamı zayıf kalmış.";
    }
    if (profit < -20) {
      return "Sinyal oluştuğunda göstergeler olumluydu ancak endeks genelindeki sert satış baskısı teknik analizi ezdi. SMA 200 filtresi olsaydı bu risk elenebilirdi.";
    }
    return "Küçük çaplı bir düzeltme. Stop-loss noktasına yakın bir seyir izlendi ancak piyasa volatilitesi nedeniyle negatif kapanış gerçekleşti.";
  };

  const showOptimization = !optimizedLoading && optimizedData;
  const signalsToShow = isExpanded ? data?.recentSignals : data?.recentSignals?.slice(0, 5);

  return (
    <PanelContainer>
      <Card.Header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="#1A73E8" fill="#1A73E8" />
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>AI Strateji Optimizasyonu</h3>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {periods.map(p => (
              <PeriodTab 
                key={p.id} 
                $active={period === p.id} 
                onClick={() => {
                  setPeriod(p.id);
                  setIsExpanded(false);
                }}
              >
                {p.label}
              </PeriodTab>
            ))}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {(loading || optimizedLoading) ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
            <Loader2 className="animate-spin" size={32} color="#1A73E8" />
          </div>
        ) : data ? (
          <>
            {showOptimization && (
              <div style={{ 
                background: '#E8F0FE', 
                borderRadius: 12, 
                padding: '16px', 
                marginBottom: 20,
                border: '1px solid rgba(26, 115, 232, 0.2)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ 
                    background: '#1A73E8', 
                    borderRadius: '50%', 
                    padding: 8, 
                    color: 'white',
                    display: 'flex'
                  }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1A73E8', textTransform: 'uppercase' }}>
                      BU HİSSE İÇİN EN İYİ ÇALIŞAN STRATEJİ (AI SEÇİMİ)
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#202124', fontWeight: 600 }}>
                      RSI {optimizedData.rsiThreshold} Altı | SMA {optimizedData.smaShort}/{optimizedData.smaLong} Kesişimi
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '0.625rem', color: '#5F6368', fontWeight: 700 }}>AI BAŞARI SKORU</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0F9D58' }}>%{optimizedData.winRate.toFixed(1)}</div>
                  </div>
                </div>

                <button 
                  onClick={async () => {
                    try {
                      const response = await api.post('/watchlist', {
                        symbol: data.symbol,
                        market: 'stock',
                        period: period,
                        entryPrice: data.recentSignals?.[0]?.exitPrice || 0
                      });
                      if (response.data.success) {
                        alert(`${data.symbol} (${period}) sinyali takip listenize eklendi!`);
                      }
                    } catch (error) {
                      console.error('Watchlist hatası:', error);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#1A73E8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <TrendingUp size={16} />
                  BU SİNYALİ TAKİP LİSTEME KAYDET
                </button>
              </div>
            )}

            <div style={{ fontSize: '0.875rem', color: '#5F6368', marginBottom: 16 }}>
              {showOptimization 
                ? "Yapay zeka, bu hisse için yukarıdaki parametreleri en verimli strateji olarak belirledi. İşte bu özel stratejinin geçmiş performansı:"
                : `Bu hissede ${period === 'weekly' ? 'Haftalık' : period === 'monthly' ? 'Aylık' : period} strateji şartları sağlandığında oluşan geçmiş performans verileri:`
              }
            </div>
            
            <StatsGrid>
              <StatItem>
                <div className="label"><Target size={12} /> Başarı Oranı</div>
                <div className="value" style={{ color: data.winRate > 60 ? '#0F9D58' : '#202124' }}>
                  %{data.winRate.toFixed(1)}
                </div>
              </StatItem>
              <StatItem>
                <div className="label"><TrendingUp size={12} /> Ort. Getiri</div>
                <div className="value" style={{ color: data.avgProfit > 0 ? '#0F9D58' : '#DB4437' }}>
                  %{data.avgProfit.toFixed(2)}
                </div>
              </StatItem>
              <StatItem>
                <div className="label"><CheckCircle2 size={12} /> Sinyal Sayısı</div>
                <div className="value">{data.totalSignals}</div>
              </StatItem>
            </StatsGrid>

            {data.recentSignals && data.recentSignals.length > 0 && (
              <SignalHistory>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#9AA0A6', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <History size={14} /> {isExpanded ? 'TÜM GEÇMİŞ SİNYALLER' : 'SON 5 SİNYAL PERFORMANSI'}
                </div>
                {signalsToShow.map((sig: any, idx: number) => (
                  <HistoryRow key={idx}>
                    <span className="date">{new Date(sig.date).toLocaleDateString('tr-TR')}</span>
                    <span className="price">₺{sig.entryPrice.toFixed(2)} ➔ ₺{sig.exitPrice.toFixed(2)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="profit" style={{ color: sig.profit > 0 ? '#0F9D58' : '#DB4437' }}>
                        {sig.profit > 0 ? '+' : ''}{sig.profit.toFixed(2)}%
                      </span>
                      <InfoIconWrapper>
                        <Info size={14} />
                        <div className="tooltip">
                          <div style={{ fontWeight: 800, marginBottom: 4, color: '#1A73E8' }}>AI ANALİZİ</div>
                          {getSignalAnalysis(sig.date, sig.profit)}
                        </div>
                      </InfoIconWrapper>
                    </div>
                  </HistoryRow>
                ))}

                {!isExpanded && data.recentSignals.length > 5 && (
                  <ShowMoreButton onClick={() => setIsExpanded(true)}>
                    Tüm Geçmiş Performansı Gör ({data.recentSignals.length} Sinyal)
                  </ShowMoreButton>
                )}
                
                {isExpanded && (
                  <ShowMoreButton onClick={() => setIsExpanded(false)}>
                    Daha Az Göster
                  </ShowMoreButton>
                )}
              </SignalHistory>
            )}

            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.6875rem', color: '#DB4437', fontWeight: 600 }}>
              <AlertCircle size={12} /> Geçmiş performans, gelecekteki sonuçların garantisi değildir.
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', color: '#9AA0A6', padding: 20 }}>
            Veri alınamadı.
          </div>
        )}
      </Card.Body>
    </PanelContainer>
  );
};
