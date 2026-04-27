import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoinDetailLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { MetricsGrid, MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../components/ui/Card.styles';
import { Bot, Power, Zap, ArrowLeft, TrendingUp, Calendar, Activity, ChevronDown, BarChart3, Waves, Layers, Mountain } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line
} from 'recharts';
import styled from 'styled-components';

// UI Components
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input, InputGroup, Label } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';

const STRATEGY_ICONS: Record<string, React.ReactNode> = {
  RSI: <TrendingUp size={16} />,
  MACD: <BarChart3 size={16} />,
  BB: <Waves size={16} />,
  EMA_CROSS: <Activity size={16} />,
  STOCH: <Zap size={16} />,
  VWAP: <Layers size={16} />,
  ADX: <Power size={16} />,
  ICHIMOKU: <Mountain size={16} />,
};

const STRATEGY_DESCRIPTIONS: Record<string, string> = {
  RSI: "RSI 30 altı alım, 70 üstü satım sinyallerini takip eder.",
  MACD: "Trend dönüşümlerini MACD kesişimleriyle yakalar.",
  BB: "Bollinger bantları dışına taşmaları izler.",
  EMA_CROSS: "Hareketli ortalama kesişimlerini takip eder.",
  STOCH: "Hızlı momentum dönüşlerini yakalar.",
  VWAP: "Hacim ağırlıklı fiyat ortalamasını baz alır.",
  ADX: "Trendin gücünü ölçerek hatalı sinyalleri eler.",
  ICHIMOKU: "Kapsamlı bulut analizi ile trend takibi yapar.",
};

const BotList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: ${props => props.theme.spacing.lg};
`;

const BotRow = styled.div<{ $isActive: boolean }>`
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.$isActive ? '#0f9d58' : '#eee'};
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: ${props => props.$isActive ? '#0f9d58' : '#1A73E8'};
  }
`;

const BotRowHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 16px;
  cursor: pointer;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    gap: 10px;
    padding: 10px 12px;
  }
`;

const BotRowIcon = styled.div<{ $isActive: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${props => props.$isActive ? 'rgba(26, 115, 232, 0.1)' : props.theme.colors.background};
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.textSecondary};
`;

const BotRowInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BotRowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.theme.colors.textMain};
`;

const BotRowSubtitle = styled.div`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ExpandIcon = styled.div<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  transition: transform 0.2s;
  transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const BotRowConfig = styled.div`
  border-top: 1px solid #eee;
  padding: 16px;
`;

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
`;

const BackButton = styled(Button)`
  margin-bottom: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContainer = styled(Card)`
  padding: 24px;
  margin-top: 32px;
  height: 400px;
  background: ${props => props.theme.colors.surface};
  position: relative;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

const TimeframeContainer = styled.div`
  display: flex;
  gap: 4px;
  background: #f1f3f4;
  padding: 4px;
  border-radius: 8px;
`;

const TimeframeButton = styled.button`
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #1A73E8;
  }
`;

const ChartTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.theme.colors.textMain};
`;

const InfoBadge = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  display: inline-block;
  margin-right: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const LegendContainer = styled.div`
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #eee;
`;

const CoinDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const {
    bots, loading, pendingChanges, hasChanges, applyChanges, updatingBot, activeBotCount, toggleBotLocal, updateBotConfig, history, price, isBBActive, isEMACrossActive, isVWAPActive, isIchimokuActive, isRSIActive, isMACDActive, isStochActive, isADXActive, timeframe, setTimeframe
  } = useCoinDetailLogic(symbol);

  const [showBBInfo, setShowBBInfo] = useState(false);
  const [showEMAInfo, setShowEMAInfo] = useState(false);
  const [showVWAPInfo, setShowVWAPInfo] = useState(false);
  const [showIchimokuInfo, setShowIchimokuInfo] = useState(false);
  const [showRSIInfo, setShowRSIInfo] = useState(false);
  const [showMACDInfo, setShowMACDInfo] = useState(false);
  const [expandedBotId, setExpandedBotId] = useState<string | null>(null);

  if (loading && bots.length === 0) return <LoadingState>{symbol} detayları yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <BackButton $variant="secondary" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Dashboard'a Dön
      </BackButton>

      <PageHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <PageTitle>{symbol}</PageTitle>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1A73E8' }}>${price}</div>
          </div>
          <PageSubtitle>
            Bu coine özel botları yönetin. Sadece Bot Yönetimi sayfasında aktif ettiğiniz stratejiler burada görünür.
          </PageSubtitle>
        </div>
        {hasChanges && (
          <Button $variant="success" onClick={applyChanges} style={{ boxShadow: '0 4px 12px rgba(15, 157, 88, 0.3)' }}>
            <Zap size={18} fill="white" /> Değişiklikleri Uygula
          </Button>
        )}
      </PageHeader>

      <ChartContainer>
        <ChartHeader>
          <ChartTitle>
            <Calendar size={18} color="#1A73E8" /> Fiyat Geçmişi
          </ChartTitle>

          <TimeframeContainer>
            {['1D', '5D', '1M', '3M', '1Y', '5Y'].map((tf) => (
              <TimeframeButton 
                key={tf} 
                style={{ 
                  backgroundColor: timeframe === tf ? '#fff' : 'transparent',
                  color: timeframe === tf ? '#1A73E8' : '#5F6368',
                  boxShadow: timeframe === tf ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
                onClick={() => setTimeframe(tf)}
              >
                {tf}
              </TimeframeButton>
            ))}
          </TimeframeContainer>

          <div style={{ fontSize: '12px', color: '#9AA0A6' }}>{symbol}/USDT</div>
        </ChartHeader>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#9AA0A6' }}
                minTickGap={30}
              />
              <YAxis
                hide
                domain={['auto', 'auto']}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  fontSize: '12px'
                }}
                formatter={(value: any) => [`$${value}`, 'Fiyat']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#1A73E8"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
                zIndex={10}
              />

              {isBBActive && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="bbUpper" 
                    stroke="#db4437" 
                    strokeWidth={1} 
                    strokeDasharray="5 5" 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bbLower" 
                    stroke="#0f9d58" 
                    strokeWidth={1} 
                    strokeDasharray="5 5" 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="bbMiddle" 
                    stroke="#9AA0A6" 
                    strokeWidth={1} 
                    strokeDasharray="3 3" 
                    dot={false} 
                    opacity={0.5}
                  />
                </>
              )}

              {isEMACrossActive && (
                <>
                  <Line 
                    type="monotone" 
                    dataKey="emaShort" 
                    stroke="#FF9800" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="emaLong" 
                    stroke="#9C27B0" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </>
              )}

              {isVWAPActive && (
                <Line 
                  type="monotone" 
                  dataKey="vwap" 
                  stroke="#607D8B" 
                  strokeWidth={2} 
                  dot={false} 
                  strokeDasharray="3 3"
                />
              )}

              {isIchimokuActive && (
                <>
                  <Line type="monotone" dataKey="tenkan" stroke="#db4437" strokeWidth={1} dot={false} />
                  <Line type="monotone" dataKey="kijun" stroke="#1A73E8" strokeWidth={1} dot={false} />
                  <Area type="monotone" dataKey="spanA" stroke="none" fill="#0f9d58" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="spanB" stroke="none" fill="#db4437" fillOpacity={0.1} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartContainer>

      {(isRSIActive || isMACDActive) && (
        <ChartContainer style={{ height: '250px', marginTop: '16px' }}>
          <ChartHeader>
            <ChartTitle>
              <Activity size={18} color="#1A73E8" /> Osilatörler {isRSIActive && '(RSI)'} {isMACDActive && '(MACD)'}
            </ChartTitle>
          </ChartHeader>
          <ResponsiveContainer width="100%" height="150px">
            <AreaChart data={history}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="time" hide />
              <YAxis hide domain={isRSIActive ? [0, 100] : ['auto', 'auto']} />
              <Tooltip />
              {isRSIActive && (
                <Area type="monotone" dataKey="rsi" stroke="#9C27B0" fill="#9C27B0" fillOpacity={0.1} />
              )}
              {isMACDActive && (
                <Line type="monotone" dataKey="macd" stroke="#FF9800" dot={false} />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}

      <MetricsGrid style={{ marginTop: '32px' }}>
        <MetricCard>
          <CardHeader>
            <CardTitle>Aktif Stratejiler</CardTitle>
            <CardIcon $variant="primary"><Bot size={20} /></CardIcon>
          </CardHeader>
          <CardValue>{activeBotCount} / {bots.length}</CardValue>
        </MetricCard>

        <MetricCard>
          <CardHeader>
            <CardTitle>Bot Durumu</CardTitle>
            <CardIcon $variant={activeBotCount > 0 ? 'success' : 'danger'}><Power size={20} /></CardIcon>
          </CardHeader>
          <CardValue>{activeBotCount > 0 ? 'ÇALIŞIYOR' : 'DURDURULDU'}</CardValue>
        </MetricCard>
      </MetricsGrid>


      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px' }}>Otomasyon Botları</h2>
        <p style={{ color: '#9AA0A6', fontSize: '14px', marginBottom: '24px' }}>
          Sadece {symbol} için çalışacak botları buradan aktif edebilirsiniz.
        </p>

        {bots.length > 0 ? (
          <BotList>
            {bots.map((bot) => {
              const isActive = (bot.id in pendingChanges) ? pendingChanges[bot.id] : bot.isActive;
              const isExpanded = expandedBotId === bot.id;
              return (
                <BotRow key={bot.id} $isActive={isActive}>
                  <BotRowHeader onClick={() => setExpandedBotId(isExpanded ? null : bot.id)}>
                    <BotRowIcon $isActive={isActive}>
                      {STRATEGY_ICONS[bot.strategy] || <Bot size={16} />}
                    </BotRowIcon>
                    <BotRowInfo>
                      <BotRowTitle>
                        {bot.name}
                        <Badge $variant="neutral" $size="sm">{bot.strategy}</Badge>
                      </BotRowTitle>
                      <BotRowSubtitle>
                        {STRATEGY_DESCRIPTIONS[bot.strategy] || bot.description}
                      </BotRowSubtitle>
                    </BotRowInfo>
                    <ExpandIcon $expanded={isExpanded}>
                      <ChevronDown size={18} />
                    </ExpandIcon>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Switch checked={isActive} onChange={() => toggleBotLocal(bot.id)} />
                    </div>
                  </BotRowHeader>

                  {isExpanded && (
                    <BotRowConfig>
                      {bot.strategy === 'BB' && (
                        <>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '12px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowBBInfo(!showBBInfo); }}>
                            {showBBInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showBBInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#db4437" /> <strong>Üst Bant:</strong> Satış Bölgesi</InfoItem>
                              <InfoItem><InfoBadge $color="#9AA0A6" /> <strong>Orta Bant:</strong> Ortalama Fiyat</InfoItem>
                              <InfoItem><InfoBadge $color="#0f9d58" /> <strong>Alt Bant:</strong> Alım Bölgesi</InfoItem>
                            </LegendContainer>
                          )}
                        </>
                      )}

                      {bot.strategy === 'EMA_CROSS' && (
                        <div style={{ marginBottom: '16px' }}>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '8px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowEMAInfo(!showEMAInfo); }}>
                            {showEMAInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showEMAInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#FF9800" /> <strong>Kısa EMA (9):</strong> Hızlı Trend</InfoItem>
                              <InfoItem><InfoBadge $color="#9C27B0" /> <strong>Uzun EMA (21):</strong> Ana Trend</InfoItem>
                              <div style={{ fontSize: '10px', color: '#9AA0A6', marginTop: '8px', fontStyle: 'italic' }}>
                                Turuncu moru yukarı keserse AL, aşağı keserse SAT sinyali üretilir.
                              </div>
                            </LegendContainer>
                          )}
                        </div>
                      )}

                      {bot.strategy === 'VWAP' && (
                        <div style={{ marginBottom: '16px' }}>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '8px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowVWAPInfo(!showVWAPInfo); }}>
                            {showVWAPInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showVWAPInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#607D8B" /> <strong>VWAP:</strong> Hacim Ağırlıklı Ortalama</InfoItem>
                            </LegendContainer>
                          )}
                        </div>
                      )}

                      {bot.strategy === 'ICHIMOKU' && (
                        <div style={{ marginBottom: '16px' }}>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '8px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowIchimokuInfo(!showIchimokuInfo); }}>
                            {showIchimokuInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showIchimokuInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#db4437" /> <strong>Tenkan:</strong> 9 Periyot Orta</InfoItem>
                              <InfoItem><InfoBadge $color="#1A73E8" /> <strong>Kijun:</strong> 26 Periyot Orta</InfoItem>
                              <InfoItem><InfoBadge $color="rgba(15, 157, 88, 0.2)" /> <strong>Bulut:</strong> Trend Yönü</InfoItem>
                            </LegendContainer>
                          )}
                        </div>
                      )}

                      {bot.strategy === 'RSI' && (
                        <div style={{ marginBottom: '16px' }}>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '8px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowRSIInfo(!showRSIInfo); }}>
                            {showRSIInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showRSIInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#9C27B0" /> <strong>RSI:</strong> 30 Altı Aşırı Satış, 70 Üstü Aşırı Alım</InfoItem>
                            </LegendContainer>
                          )}
                        </div>
                      )}

                      {bot.strategy === 'MACD' && (
                        <div style={{ marginBottom: '16px' }}>
                          <Button $variant="secondary" $size="sm" $fullWidth style={{ fontSize: '11px', marginBottom: '8px', height: '30px' }} onClick={(e) => { e.stopPropagation(); setShowMACDInfo(!showMACDInfo); }}>
                            {showMACDInfo ? 'Bilgileri Gizle' : 'Grafik Çizgi Anlamları'}
                          </Button>
                          {showMACDInfo && (
                            <LegendContainer>
                              <InfoItem><InfoBadge $color="#FF9800" /> <strong>MACD:</strong> Trendin gücünü ve yönünü takip eder.</InfoItem>
                            </LegendContainer>
                          )}
                        </div>
                      )}

                      {(bot.strategy === 'STOCH' || bot.strategy === 'ADX') && (
                        <div style={{ marginBottom: '16px' }}>
                          <p style={{ fontSize: '11px', color: '#9AA0A6', background: '#f8f9fa', padding: '8px', borderRadius: '4px' }}>
                            Bu strateji için grafik görselleştirmesi yakında eklenecektir.
                          </p>
                        </div>
                      )}

                      <Button
                        $variant="primary"
                        $size="sm"
                        $fullWidth
                        onClick={() => updateBotConfig(bot.id, bot.config)}
                        disabled={updatingBot === bot.id}
                      >
                        {updatingBot === bot.id ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                      </Button>
                    </BotRowConfig>
                  )}
                </BotRow>
              );
            })}
          </BotList>
        ) : (
          <EmptyState>
            <Bot size={48} color="#9AA0A6" style={{ marginBottom: '16px', opacity: 0.5 }} />
            <h3 style={{ color: '#5F6368', marginBottom: '8px' }}>Görüntülenecek Bot Bulunamadı</h3>
            <p style={{ color: '#9AA0A6', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
              Bu sayfada botları görebilmek için önce <strong>Bot Yönetimi</strong> sayfasından kullanmak istediğiniz stratejileri aktif etmelisiniz.
            </p>
            <Button
              $variant="secondary"
              style={{ marginTop: '20px' }}
              onClick={() => navigate('/bots')}
            >
              Bot Yönetimine Git
            </Button>
          </EmptyState>
        )}
      </div>
    </PageContainer>
  );
};

export default CoinDetail;
