import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStockDetailLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { MetricsGrid, MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../components/ui/Card.styles';
import { ArrowLeft, TrendingUp, Calendar, Star } from 'lucide-react';
import {
  Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Cell, Line, ReferenceLine
} from 'recharts';
import styled from 'styled-components';

import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import api from '../../services/apiClient';

const ChartOptionsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const ChartOptionItem = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 12px;
  background: ${props => props.$active ? '#f0f7ff' : '#f8f9fa'};
  border: 1px solid ${props => props.$active ? '#1A73E8' : 'transparent'};
  transition: all 0.2s;

  &:hover {
    background: ${props => props.$active ? '#e1efff' : '#f1f3f4'};
  }
`;

const Checkbox = styled.div<{ $active: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 2px solid ${props => props.$active ? '#1A73E8' : '#dadce0'};
  background: ${props => props.$active ? '#1A73E8' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &::after {
    content: '';
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    display: ${props => props.$active ? 'block' : 'none'};
    margin-bottom: 2px;
  }
`;

const OptionLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const OptionTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
`;

const OptionDesc = styled.span`
  font-size: 11px;
  color: #5F6368;
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
  min-height: 400px;
  background: ${props => props.theme.colors.surface};
  position: relative;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 12px;
    min-height: 350px;
  }
`;

const ResponsiveHeader = styled(PageHeader)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 20px;
  }
`;

const ResponsiveMetricsGrid = styled(MetricsGrid)`
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    width: 100%;
  }
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
  overflow-x: auto;
  max-width: 100%;

  &::-webkit-scrollbar { display: none; }
`;

const TimeframeButton = styled.button`
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

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

const FundamentalSection = styled(Card)`
  margin-top: 32px;
  padding: 24px;

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 16px;
  }
`;

const FundamentalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const FundamentalItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const FLabel = styled.span`
  font-size: 12px;
  color: #5F6368;
`;

const FValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
`;

const RangeBar = styled.div`
  height: 6px;
  background: #eee;
  border-radius: 3px;
  position: relative;
  margin-top: 8px;
`;

const RangeIndicator = styled.div<{ $pos: number }>`
  width: 12px;
  height: 12px;
  background: #1A73E8;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: absolute;
  top: -3px;
  left: ${props => props.$pos}%;
  transform: translateX(-50%);
`;

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const { 
    history, loading, price, changePercent, change, 
    lastUpdated, timeframe, setTimeframe, technicalSummary,
    fundamentals 
  } = useStockDetailLogic(symbol);
  
  const [activeViews, setActiveViews] = useState<string[]>(['area', 'candle']);

  if (loading && history.length === 0) return <LoadingState>{symbol} detayları yükleniyor...</LoadingState>;

  const isUp = (changePercent || 0) >= 0;
  const changeColor = isUp ? '#0F9D58' : '#DB4437';

  const toggleView = (view: string) => {
    setActiveViews(prev => {
      if (prev.includes(view)) {
        if (prev.length === 1) return prev; // En az bir tane aktif kalmalı
        return prev.filter(v => v !== view);
      }
      return [...prev, view];
    });
  };

  // Heikin-Ashi Hesaplama
  const calculateHeikinAshi = (data: any[]) => {
    const haData: any[] = [];
    let prevOpen = data[0]?.open;
    let prevClose = data[0]?.price;

    data.forEach((d) => {
      const haClose = (d.open + d.high + d.low + d.price) / 4;
      const haOpen = (prevOpen + prevClose) / 2;
      const haHigh = Math.max(d.high, haOpen, haClose);
      const haLow = Math.min(d.low, haOpen, haClose);

      haData.push({
        ...d,
        haOpen,
        haClose,
        haHigh,
        haLow,
        open: haOpen,
        price: haClose,
        high: haHigh,
        low: haLow
      });

      prevOpen = haOpen;
      prevClose = haClose;
    });
    return haData;
  };

  const chartData = activeViews.includes('heikin') ? calculateHeikinAshi(history) : history;

  const renderChart = () => {
    const showArea = activeViews.includes('area');
    const showCandle = activeViews.includes('candle');
    const showLine = activeViews.includes('line');
    const showHeikin = activeViews.includes('heikin');
    const showMA20 = activeViews.includes('ma20');
    const showMA50 = activeViews.includes('ma50');
    const showRSI = activeViews.includes('rsi');
    const showMACD = activeViews.includes('macd');
    const showBB = activeViews.includes('bb');
    const showPivots = activeViews.includes('pivots');
    const showIndex = activeViews.includes('index');

    return (
      <ComposedChart data={chartData} margin={{ top: 20, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9AA0A6' }} minTickGap={20} />
        
        {/* Y-Axes for different scales */}
        <YAxis yAxisId="price" domain={['auto', 'auto']} hide />
        <YAxis yAxisId="rsi" domain={[0, 100]} hide />
        <YAxis yAxisId="macd" domain={['auto', 'auto']} hide />
        <YAxis yAxisId="percent" orientation="right" domain={['auto', 'auto']} hide={!showIndex} tick={{ fontSize: 10, fill: '#9AA0A6' }} />

        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' }}
          content={({ active, payload }: any) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              const isGreen = d.price >= d.open;
              return (
                <div style={{ background: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #eee' }}>
                  <div style={{ fontWeight: 700, marginBottom: '8px' }}>{d.time}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
                    <span style={{ color: '#5F6368' }}>Açılış:</span> <span style={{ fontWeight: 600 }}>₺{d.open}</span>
                    <span style={{ color: '#5F6368' }}>Kapanış:</span> <span style={{ fontWeight: 600, color: isGreen ? '#0F9D58' : '#DB4437' }}>₺{d.price}</span>
                    <span style={{ color: '#5F6368' }}>Yüksek:</span> <span style={{ fontWeight: 600 }}>₺{d.high}</span>
                    <span style={{ color: '#5F6368' }}>Düşük:</span> <span style={{ fontWeight: 600 }}>₺{d.low}</span>
                    {showMA20 && d.ma20 && <><span style={{ color: '#F4B400' }}>MA 20:</span> <span style={{ fontWeight: 600 }}>₺{d.ma20}</span></>}
                    {showMA50 && d.ma50 && <><span style={{ color: '#4285F4' }}>MA 50:</span> <span style={{ fontWeight: 600 }}>₺{d.ma50}</span></>}
                    {showBB && d.bb && (
                      <>
                        <span style={{ color: '#E91E63' }}>BB Üst:</span> <span style={{ fontWeight: 600 }}>₺{d.bb.upper}</span>
                        <span style={{ color: '#E91E63' }}>BB Alt:</span> <span style={{ fontWeight: 600 }}>₺{d.bb.lower}</span>
                      </>
                    )}
                    {showRSI && <><span style={{ color: '#9C27B0' }}>RSI:</span> <span style={{ fontWeight: 600 }}>{d.rsi}</span></>}
                    {showMACD && <><span style={{ color: '#1A73E8' }}>MACD:</span> <span style={{ fontWeight: 600 }}>{d.macd?.line}</span></>}
                    {showIndex && (
                      <>
                        <span style={{ color: '#1A73E8' }}>Hisse %:</span> <span style={{ fontWeight: 600 }}>{d.stockChange}%</span>
                        <span style={{ color: '#FF9800' }}>BIST 100 %:</span> <span style={{ fontWeight: 600 }}>{d.indexChange}%</span>
                      </>
                    )}
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        
        {showBB && (
          <Area 
            yAxisId="price" 
            dataKey="bb.upper" 
            stroke="none"
            fill="#E91E63"
            fillOpacity={0.05}
          />
        )}
        
        {showArea && <Area yAxisId="price" type="monotone" dataKey="price" stroke="#1A73E8" strokeWidth={0} fillOpacity={1} fill="url(#colorPrice)" />}
        
        {(showCandle || showHeikin) && (
          <>
            <Bar yAxisId="price" dataKey="low" fill="none" stackId="wick" />
            <Bar yAxisId="price" dataKey="high" fill="#ccc" stackId="wick" barSize={1} />
            <Bar yAxisId="price" dataKey="open" fill="none" />
            <Bar yAxisId="price" dataKey="price" barSize={10}>
              {chartData.map((entry, index) => {
                const isGreen = entry.price >= entry.open;
                return <Cell key={`cell-${index}`} fill={isGreen ? '#0F9D58' : '#DB4437'} />;
              })}
            </Bar>
          </>
        )}

        {showLine && <Line yAxisId="price" type="monotone" dataKey="price" stroke="#1A73E8" strokeWidth={2} dot={false} />}
        
        {showIndex && (
          <>
            <Line yAxisId="percent" type="monotone" dataKey="stockChange" stroke="#1A73E8" strokeWidth={2} dot={false} />
            <Line yAxisId="percent" type="monotone" dataKey="indexChange" stroke="#FF9800" strokeWidth={2} dot={false} strokeDasharray="5 5" />
          </>
        )}

        {showMA20 && <Line yAxisId="price" type="monotone" dataKey="ma20" stroke="#F4B400" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />}
        {showMA50 && <Line yAxisId="price" type="monotone" dataKey="ma50" stroke="#4285F4" strokeWidth={1.5} dot={false} strokeDasharray="5 5" />}
        
        {showPivots && technicalSummary?.pivots && (
          <>
            <ReferenceLine yAxisId="price" y={technicalSummary.pivots.r2} stroke="#DB4437" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'R2', fontSize: 9, fill: '#DB4437' }} />
            <ReferenceLine yAxisId="price" y={technicalSummary.pivots.r1} stroke="#DB4437" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'R1', fontSize: 9, fill: '#DB4437' }} />
            <ReferenceLine yAxisId="price" y={technicalSummary.pivots.p} stroke="#9AA0A6" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'P', fontSize: 9, fill: '#9AA0A6' }} />
            <ReferenceLine yAxisId="price" y={technicalSummary.pivots.s1} stroke="#0F9D58" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'S1', fontSize: 9, fill: '#0F9D58' }} />
            <ReferenceLine yAxisId="price" y={technicalSummary.pivots.s2} stroke="#0F9D58" strokeDasharray="3 3" opacity={0.5} label={{ position: 'right', value: 'S2', fontSize: 9, fill: '#0F9D58' }} />
          </>
        )}
        
        {showBB && (
          <>
            <Line yAxisId="price" type="monotone" dataKey="bb.upper" stroke="#E91E63" strokeWidth={1} dot={false} opacity={0.3} />
            <Line yAxisId="price" type="monotone" dataKey="bb.lower" stroke="#E91E63" strokeWidth={1} dot={false} opacity={0.3} />
          </>
        )}
        
        {showRSI && <Line yAxisId="rsi" type="monotone" dataKey="rsi" stroke="#9C27B0" strokeWidth={1} dot={false} opacity={0.6} />}
        
        {showMACD && (
          <>
            <Bar yAxisId="macd" dataKey="macd.histogram" barSize={4} opacity={0.3}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={(entry.macd?.histogram || 0) >= 0 ? '#0F9D58' : '#DB4437'} />
              ))}
            </Bar>
            <Line yAxisId="macd" type="monotone" dataKey="macd.line" stroke="#1A73E8" strokeWidth={1} dot={false} opacity={0.6} />
          </>
        )}
      </ComposedChart>
    );
  };

  return (
    <PageContainer>
      <BackButton $variant="secondary" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={16} /> Dashboard'a Dön
      </BackButton>

      <ResponsiveHeader>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <PageTitle>{symbol}</PageTitle>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#1A73E8' }}>₺{price}</div>
          </div>
          <PageSubtitle>
            BIST hissesi detaylarını görüntüleyin.
          </PageSubtitle>
        </div>
        <ResponsiveMetricsGrid>
          <MetricCard>
            <CardHeader>
              <CardTitle>Anlık Fiyat</CardTitle>
              <CardIcon $variant="primary"><TrendingUp size={20} /></CardIcon>
            </CardHeader>
            <CardValue>₺{price}</CardValue>
            <div style={{ fontSize: '11px', color: '#9AA0A6', marginTop: '4px' }}>
              Son Güncelleme: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </MetricCard>

          <MetricCard>
            <CardHeader>
              <CardTitle>{timeframe.toUpperCase()} Değişim</CardTitle>
              <CardIcon $variant={isUp ? 'success' : 'danger'}><TrendingUp size={20} style={{ transform: isUp ? 'rotate(0deg)' : 'rotate(180deg)' }} /></CardIcon>
            </CardHeader>
            <CardValue style={{ color: changeColor }}>
              {isUp ? '+' : ''}{change}% ({changePercent > 0 ? '+' : ''}{changePercent}₺)
            </CardValue>
          </MetricCard>

          {technicalSummary && (
            <MetricCard style={{ border: `1px solid ${technicalSummary.color}22`, background: `${technicalSummary.color}05` }}>
              <CardHeader>
                <CardTitle>AI Analiz Özeti</CardTitle>
                <div style={{ padding: '4px 8px', borderRadius: '6px', background: technicalSummary.color, color: '#fff', fontSize: '10px', fontWeight: 800 }}>
                  {technicalSummary.signal}
                </div>
              </CardHeader>
              <CardValue style={{ color: technicalSummary.color }}>{technicalSummary.score}/100</CardValue>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '8px' }}>
                {technicalSummary.signals.slice(0, 3).map((s, i) => (
                  <span key={i} style={{ fontSize: '9px', background: '#eee', padding: '2px 6px', borderRadius: '4px', color: '#5F6368' }}>{s}</span>
                ))}
              </div>
            </MetricCard>
          )}
        </ResponsiveMetricsGrid>
      </ResponsiveHeader>

      <ChartContainer>
        <ChartHeader>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ChartTitle style={{ marginRight: '24px' }}>
              <Calendar size={18} color="#1A73E8" /> Grafik ve Analiz
            </ChartTitle>
          </div>

          <TimeframeContainer>
            {['1d', '5d', '1mo', '3mo', '1y', '5y', 'all'].map((tf) => (
              <TimeframeButton
                key={tf}
                style={{
                  backgroundColor: timeframe === tf ? '#fff' : 'transparent',
                  color: timeframe === tf ? '#1A73E8' : '#5F6368',
                  boxShadow: timeframe === tf ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
                }}
                onClick={() => setTimeframe(tf as any)}
              >
                {tf.toUpperCase()}
              </TimeframeButton>
            ))}
          </TimeframeContainer>
        </ChartHeader>

        <div style={{ width: '100%', height: '350px', minHeight: '350px', position: 'relative', overflow: 'hidden' }}>
          {history.length > 0 ? (
            <ResponsiveContainer width="100%" height={350} debounce={50}>
              {renderChart()}
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA0A6', fontSize: '14px' }}>
              Veri bulunamadı
            </div>
          )}
        </div>
        
        {/* Hacim Grafiği */}
        {history.length > 0 && (
          <div style={{ height: '60px', marginTop: '10px', opacity: 0.7, overflow: 'hidden' }}>
            <ResponsiveContainer width="100%" height={60} debounce={50}>
              <BarChart data={chartData}>
                <Bar dataKey="volume">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.price >= entry.open ? '#0F9D58' : '#DB4437'} opacity={0.3} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <ChartOptionsList>
          {[
            { id: 'candle', title: 'Mum Grafikler', desc: 'Fitilli profesyonel görünüm' },
            { id: 'heikin', title: 'Heikin-Ashi', desc: 'Trend filtresi' },
            { id: 'area', title: 'Alan Grafiği', desc: 'Hacimli fiyat' },
            { id: 'line', title: 'Çizgi Grafik', desc: 'Kapanış bazlı' },
            { id: 'ma20', title: 'MA 20', desc: 'Kısa vadeli trend' },
            { id: 'ma50', title: 'MA 50', desc: 'Orta vadeli trend' },
            { id: 'bb', title: 'Bollinger Bantları', desc: 'Volatilite ve kanal analizi' },
            { id: 'pivots', title: 'Destek/Direnç', desc: 'Pivot noktaları ve hedefler' },
            { id: 'index', title: 'Endeks Kıyaslama', desc: 'BIST 100 ile göreceli performans' },
            { id: 'rsi', title: 'RSI', desc: 'Aşırı Alım/Satım' },
            { id: 'macd', title: 'MACD', desc: 'Trend gücü' }
          ].map(opt => (
            <ChartOptionItem 
              key={opt.id} 
              $active={activeViews.includes(opt.id)} 
              onClick={() => toggleView(opt.id)}
            >
              <Checkbox $active={activeViews.includes(opt.id)} />
              <OptionLabel>
                <OptionTitle>{opt.title}</OptionTitle>
                <OptionDesc>{opt.desc}</OptionDesc>
              </OptionLabel>
            </ChartOptionItem>
          ))}
        </ChartOptionsList>
      </ChartContainer>

      {fundamentals && (
        <FundamentalSection>
          <ChartTitle><Calendar size={18} color="#1A73E8" /> Şirket Künyesi ve Temel Analiz</ChartTitle>
          <FundamentalGrid>
            <FundamentalItem>
              <FLabel>Piyasa Değeri</FLabel>
              <FValue>₺{(fundamentals.marketCap / 1000000000).toFixed(2)} Mlr</FValue>
            </FundamentalItem>
            <FundamentalItem>
              <FLabel>F/K Oranı (P/E)</FLabel>
              <FValue>{fundamentals.peRatio ? fundamentals.peRatio.toFixed(2) : '-'}</FValue>
            </FundamentalItem>
            <FundamentalItem>
              <FLabel>Temettü Verimi</FLabel>
              <FValue>%{fundamentals.dividendYield}</FValue>
            </FundamentalItem>
            <FundamentalItem>
              <FLabel>52 Haftalık Aralık</FLabel>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#9AA0A6' }}>
                <span>₺{fundamentals.low52w}</span>
                <span>₺{fundamentals.high52w}</span>
              </div>
              <RangeBar>
                <RangeIndicator $pos={((price - fundamentals.low52w) / (fundamentals.high52w - fundamentals.low52w)) * 100} />
              </RangeBar>
            </FundamentalItem>
          </FundamentalGrid>
        </FundamentalSection>
      )}

      <TradeControlCard symbol={symbol || ''} currentPrice={price} />

      <BotManagementSection symbol={symbol || ''} />
    </PageContainer>
  );
};

const TradeControlCard: React.FC<{ symbol: string, currentPrice: number }> = ({ symbol, currentPrice }) => {
  const [limitBot, setLimitBot] = useState<any>(null);
  const [buyLimit, setBuyLimit] = useState<string>('');
  const [sellLimit, setSellLimit] = useState<string>('');
  const [, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [ownedAmount, setOwnedAmount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [botRes, assetRes] = await Promise.all([
        api.get(`/bots/my?symbol=${symbol}`),
        api.get('/transactions/my-portfolio')
      ]);
      
      const bots = botRes.data.data || [];
      const lb = bots.find((b: any) => b.strategy === 'LIMIT_ORDER');
      setLimitBot(lb);
      if (lb?.config) {
        setBuyLimit(lb.config.buyLimit || '');
        setSellLimit(lb.config.sellLimit || '');
      }

      const assets = assetRes.data.assets || [];
      const currentAsset = assets.find((a: any) => a.symbol === symbol);
      setOwnedAmount(currentAsset?.amount || 0);
    } catch (err) {
      console.error('Trade fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [symbol]);

  const handleManualTrade = async (type: 'BUY' | 'SELL') => {
    if (type === 'BUY' && ownedAmount >= 1) {
      alert('Zaten bu hisseden elinizde var. (1 lot kuralı)');
      return;
    }
    if (type === 'SELL' && ownedAmount < 1) {
      alert('Elinizde bu hisseden bulunmuyor.');
      return;
    }

    try {
      setActionLoading(true);
      await api.post('/transactions/execute', {
        symbol,
        type,
        amount: 1,
        price: currentPrice,
        origin: 'MANUAL'
      });
      alert(`Başarıyla ${type === 'BUY' ? 'alındı' : 'satıldı'}.`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'İşlem başarısız');
    } finally {
      setActionLoading(false);
    }
  };

  const saveLimits = async () => {
    if (!limitBot) return;
    try {
      setActionLoading(true);
      await api.put(`/bots/${limitBot.id}/config`, {
        config: { buyLimit, sellLimit }
      });
      alert('Limitler kaydedildi.');
      fetchData();
    } catch (err) {
      alert('Hata oluştu');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleBot = async () => {
    if (!limitBot) return;
    try {
      await api.put(`/bots/${limitBot.id}/toggle`);
      fetchData();
    } catch (err) {}
  };

  return (
    <Card style={{ marginTop: '32px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <ChartTitle style={{ margin: 0 }}>
          <TrendingUp size={18} color="#1A73E8" /> İşlem Paneli & Limit Emirler
        </ChartTitle>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: ownedAmount > 0 ? '#0F9D58' : '#9AA0A6' }}>
            Portföy: {ownedAmount} Lot
          </span>
          {limitBot && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8f9fa', padding: '6px 12px', borderRadius: '20px', border: '1px solid #eee' }}>
              <span style={{ fontSize: '11px', fontWeight: 700 }}>Bot: {limitBot.isActive ? 'AKTİF' : 'PASİF'}</span>
              <div 
                onClick={toggleBot}
                style={{ width: '32px', height: '16px', borderRadius: '8px', background: limitBot.isActive ? '#0F9D58' : '#ccc', position: 'relative', cursor: 'pointer' }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '2px', left: limitBot.isActive ? '18px' : '2px', transition: '0.2s' }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {/* Manuel İşlemler */}
        <div style={{ padding: '20px', borderRadius: '16px', background: '#f8f9fa', border: '1px solid #eee' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '16px', color: '#3C4043' }}>Manuel İşlem (1 Lot)</div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button 
              $variant="primary" 
              style={{ flex: 1, background: '#0F9D58', borderColor: '#0F9D58' }} 
              onClick={() => handleManualTrade('BUY')}
              disabled={actionLoading || ownedAmount >= 1}
            >
              Satın Al (₺{currentPrice})
            </Button>
            <Button 
              $variant="danger" 
              style={{ flex: 1 }} 
              onClick={() => handleManualTrade('SELL')}
              disabled={actionLoading || ownedAmount < 1}
            >
              Sat (₺{currentPrice})
            </Button>
          </div>
          <div style={{ fontSize: '11px', color: '#5F6368', marginTop: '12px', textAlign: 'center' }}>
            * Manuel işlemler "MANUAL" etiketiyle kaydedilir.
          </div>
        </div>

        {/* Limit Ayarları */}
        <div style={{ padding: '20px', borderRadius: '16px', border: '1px solid #1A73E822', background: '#1A73E805' }}>
          <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '16px', color: '#1A73E8' }}>Otomatik Limit Emirleri</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#5F6368', display: 'block', marginBottom: '4px' }}>Alım Limiti (₺)</label>
              <input 
                type="number" 
                value={buyLimit}
                onChange={e => setBuyLimit(e.target.value)}
                placeholder="Örn: 13"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#5F6368', display: 'block', marginBottom: '4px' }}>Satım Limiti (₺)</label>
              <input 
                type="number" 
                value={sellLimit}
                onChange={e => setSellLimit(e.target.value)}
                placeholder="Örn: 18"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #dadce0', fontSize: '14px' }}
              />
            </div>
          </div>
          <Button 
            $variant="primary" 
            style={{ width: '100%' }} 
            onClick={saveLimits}
            disabled={actionLoading || !limitBot}
          >
            Limitleri Kaydet
          </Button>
          <div style={{ fontSize: '11px', color: '#5F6368', marginTop: '12px', textAlign: 'center' }}>
            * Fiyat limitlere ulaştığında bot otomatik olarak 1 lot işlem yapar.
          </div>
        </div>
      </div>
    </Card>
  );
};

const BotManagementSection: React.FC<{ symbol: string }> = ({ symbol }) => {
  const [bots, setBots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBots = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bots/my?symbol=${symbol}`);
      setBots(res.data.data || []);
    } catch (err) {
      console.error('Bot list error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBots();
  }, [symbol]);

  const toggleBot = async (id: string) => {
    try {
      await api.put(`/bots/${id}/toggle`);
      fetchBots();
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const updateConfig = async (id: string, config: any) => {
    try {
      await api.put(`/bots/${id}/config`, { config });
      fetchBots();
    } catch (err) {
      console.error('Update config error:', err);
    }
  };

  return (
    <Card style={{ marginTop: '32px', padding: '24px' }}>
      <ChartHeader>
        <ChartTitle>
          <Star size={18} color="#1A73E8" /> Bot Yönetimi ({symbol})
        </ChartTitle>
      </ChartHeader>

      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#9AA0A6' }}>Yükleniyor...</div>
      ) : bots.length === 0 ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ color: '#9AA0A6', marginBottom: '12px' }}>Bu hisse için aktif bot bulunmuyor.</div>
          <Button $variant="primary" onClick={() => api.get(`/bots/my?symbol=${symbol}`).then(fetchBots)}>
            Botları Başlat
          </Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {bots.map(bot => (
            <BotCard
              key={bot.id}
              bot={bot}
              onToggle={() => toggleBot(bot.id)}
              onUpdate={(cfg: any) => updateConfig(bot.id, cfg)}
            />
          ))}
        </div>
      )}
    </Card>
  );
};

const BotCard = ({ bot, onToggle, onUpdate }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState(bot.config || {});

  const handleSave = () => {
    onUpdate(config);
    setIsEditing(false);
  };

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      border: '1px solid #eee',
      background: bot.isActive ? '#f8fbff' : '#fff',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px' }}>{bot.name}</div>
          <div style={{ fontSize: '11px', color: '#9AA0A6' }}>{bot.strategy}</div>
        </div>
        <div
          onClick={onToggle}
          style={{
            width: '40px',
            height: '20px',
            borderRadius: '10px',
            background: bot.isActive ? '#0F9D58' : '#ccc',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: '#fff',
            position: 'absolute',
            top: '2px',
            left: bot.isActive ? '22px' : '2px',
            transition: 'all 0.2s'
          }} />
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#5F6368', marginBottom: '16px' }}>
        {bot.description}
      </div>

      {isEditing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {bot.strategy === 'RSI' && (
            <>
              <label style={{ fontSize: '11px' }}>RSI Alt Limit (AL):</label>
              <input
                type="number"
                value={config.rsiLow || 30}
                onChange={e => setConfig({ ...config, rsiLow: Number(e.target.value) })}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
              <label style={{ fontSize: '11px' }}>RSI Üst Limit (SAT):</label>
              <input
                type="number"
                value={config.rsiHigh || 70}
                onChange={e => setConfig({ ...config, rsiHigh: Number(e.target.value) })}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </>
          )}
          {bot.strategy === 'BB' && (
            <>
              <label style={{ fontSize: '11px' }}>Periyot:</label>
              <input
                type="number"
                value={config.bbPeriod || 20}
                onChange={e => setConfig({ ...config, bbPeriod: Number(e.target.value) })}
                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </>
          )}
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <Button $variant="primary" style={{ flex: 1, fontSize: '11px' }} onClick={handleSave}>Kaydet</Button>
            <Button $variant="secondary" style={{ flex: 1, fontSize: '11px' }} onClick={() => setIsEditing(false)}>İptal</Button>
          </div>
        </div>
      ) : (
        <Button
          $variant="secondary"
          style={{ width: '100%', fontSize: '11px', padding: '6px' }}
          onClick={() => setIsEditing(true)}
        >
          Ayarları Düzenle
        </Button>
      )}
    </div>
  );
};

export default StockDetail;
