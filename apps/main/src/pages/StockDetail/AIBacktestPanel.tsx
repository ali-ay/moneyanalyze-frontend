import React from 'react';
import * as S from './AIBacktestPanel.styles';
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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

const ChartWrapper = styled.div`
  margin-top: 24px;
  padding: 16px;
  background: #F8FBFF;
  border-radius: 12px;
  border: 1px solid #E8F0FE;
`;

const ChartTitle = styled.div`
  font-size: 0.8125rem;
  font-weight: 700;
  color: #202124;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RulesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const RuleTag = styled.span`
  padding: 4px 10px;
  background: #E8F0FE;
  color: #1A73E8;
  border-radius: 12px;
  font-size: 0.65rem;
  font-weight: 600;
  white-space: nowrap;
`;

const RULE_LABELS: Record<string, string> = {
  ABOVE_SMA200: 'Fiyat SMA200 üzerinde',
  SMA_BULLISH_STACK: 'Kısa SMA > Uzun SMA',
  MACD_POSITIVE: 'MACD sinyal çizgisinin üzerinde',
  VOLUME_CONFIRMED: 'Hacim onayı ✓',
  OVERSOLD_RSI: 'RSI aşırı satım',
  PRICE_STRETCHED_LOW: 'Fiyat düşük',
  EXTREME_OVERSOLD: 'Aşırı satım (RSI<30)',
  EXPLOSIVE_VOLUME: 'Patlayıcı hacim',
  MOMENTUM_ACCELERATING: 'Momentum güçleniyor',
  PRICE_BREAKOUT: 'Fiyat kırılması',
};

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
        <S.HeaderContainer>
          <S.HeaderLeft>
            <Zap size={20} color="#1A73E8" fill="#1A73E8" />
            <S.HeaderTitle>AI Strateji Optimizasyonu</S.HeaderTitle>
          </S.HeaderLeft>
          <S.PeriodTabsContainer>
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
          </S.PeriodTabsContainer>
        </S.HeaderContainer>
      </Card.Header>
      <Card.Body>
        {(loading || optimizedLoading) ? (
          <S.LoadingContainer>
            <Loader2 className="animate-spin" size={32} color="#1A73E8" />
          </S.LoadingContainer>
        ) : data ? (
          <>
            {showOptimization && (
              <S.OptimizationBox>
                <S.OptimizationHeader>
                  <S.OptimizationBadge>
                    <Sparkles size={16} />
                  </S.OptimizationBadge>
                  <S.OptimizationInfo>
                    <S.OptimizationLabel>
                      BU HİSSE İÇİN EN İYİ ÇALIŞAN STRATEJİ (AI SEÇİMİ)
                    </S.OptimizationLabel>
                    <S.OptimizationDetails>
                      RSI {optimizedData.rsiThreshold} Altı | SMA {optimizedData.smaShort}/{optimizedData.smaLong} Kesişimi
                    </S.OptimizationDetails>
                  </S.OptimizationInfo>
                  <S.OptimizationScore>
                    <S.ScoreLabel>AI BAŞARI SKORU</S.ScoreLabel>
                    <S.ScoreValue>%{optimizedData.winRate.toFixed(1)}</S.ScoreValue>
                  </S.OptimizationScore>
                </S.OptimizationHeader>

                <S.SaveSignalButton
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
                >
                  <TrendingUp size={16} />
                  BU SİNYALİ TAKİP LİSTEME KAYDET
                </S.SaveSignalButton>
              </S.OptimizationBox>
            )}

            <S.DescriptionText>
              {showOptimization
                ? "Yapay zeka, bu hisse için yukarıdaki parametreleri en verimli strateji olarak belirledi. İşte bu özel stratejinin geçmiş performansı:"
                : `Bu hissede ${period === 'weekly' ? 'Haftalık' : period === 'monthly' ? 'Aylık' : period} strateji şartları sağlandığında oluşan geçmiş performans verileri:`
              }
            </S.DescriptionText>
            
            <StatsGrid>
              <StatItem>
                <div className="label"><Target size={12} /> Başarı Oranı</div>
                <S.StatValue as="div" className="value" $positive={data.winRate > 60}>
                  %{data.winRate.toFixed(1)}
                </S.StatValue>
              </StatItem>
              <StatItem>
                <div className="label"><TrendingUp size={12} /> Ort. Getiri</div>
                <S.StatValue as="div" className="value" $positive={data.avgProfit > 0}>
                  %{data.avgProfit.toFixed(2)}
                </S.StatValue>
              </StatItem>
              <StatItem>
                <div className="label"><CheckCircle2 size={12} /> Risk/Reward</div>
                <S.StatValue as="div" className="value" $positive={data.riskReward ? data.riskReward > 1 : false}>
                  {data.riskReward ? data.riskReward.toFixed(2) : '-'}
                </S.StatValue>
              </StatItem>
              <StatItem>
                <div className="label"><CheckCircle2 size={12} /> Sinyal Sayısı</div>
                <div className="value">{data.totalSignals}</div>
              </StatItem>
            </StatsGrid>

            {data.recentSignals && data.recentSignals.length > 5 && (
              <ChartWrapper>
                <ChartTitle>
                  <TrendingUp size={16} /> Son 15 Sinyal Kâr/Zarar Dağılımı
                </ChartTitle>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={data.recentSignals.slice(-15)} margin={{ top: 10, right: 30, left: 10, bottom: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8F0FE" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: '#5F6368' }}
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      formatter={(date: string) => new Date(date).toLocaleDateString('tr-TR', { month: '2-digit', day: '2-digit' })}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#5F6368' }} label={{ value: 'Kâr/Zarar (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#202124',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '12px'
                      }}
                      formatter={(value: any) => `${value > 0 ? '+' : ''}${value.toFixed(2)}%`}
                      labelFormatter={(label: any) => new Date(label).toLocaleDateString('tr-TR')}
                    />
                    <Bar
                      dataKey="profit"
                      fill="#1A73E8"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartWrapper>
            )}

            {data.recentSignals && data.recentSignals.length > 0 && (
              <SignalHistory>
                <S.SignalHistoryHeader>
                  <History size={14} /> {isExpanded ? 'TÜM GEÇMİŞ SİNYALLER' : 'SON 5 SİNYAL PERFORMANSI'}
                </S.SignalHistoryHeader>
                {signalsToShow.map((sig: any, idx: number) => (
                  <HistoryRow key={idx}>
                    <span className="date">{new Date(sig.date).toLocaleDateString('tr-TR')}</span>
                    <span className="price">₺{sig.entryPrice.toFixed(2)} ➔ ₺{sig.exitPrice.toFixed(2)}</span>
                    <S.SignalRow>
                      <S.SignalProfit className="profit" $positive={sig.profit > 0}>
                        {sig.profit > 0 ? '+' : ''}{sig.profit.toFixed(2)}%
                      </S.SignalProfit>
                      <InfoIconWrapper>
                        <Info size={14} />
                        <div className="tooltip">
                          <S.TooltipLabel>TETIKLENEN KURALLAR</S.TooltipLabel>
                          {sig.rules && sig.rules.length > 0 ? (
                            <RulesContainer>
                              {sig.rules.map((rule: string, rIdx: number) => (
                                <RuleTag key={rIdx} title={rule}>
                                  {RULE_LABELS[rule] || rule}
                                </RuleTag>
                              ))}
                            </RulesContainer>
                          ) : (
                            <span>Kural verisi bulunamadı</span>
                          )}
                        </div>
                      </InfoIconWrapper>
                    </S.SignalRow>
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

            <S.DisclaimerText>
              <AlertCircle size={12} /> Geçmiş performans, gelecekteki sonuçların garantisi değildir.
            </S.DisclaimerText>
          </>
        ) : (
          <S.NoDataContainer>
            Veri alınamadı.
          </S.NoDataContainer>
        )}
      </Card.Body>
    </PanelContainer>
  );
};
