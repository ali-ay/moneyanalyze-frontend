import React, { useState } from 'react';
import styled from 'styled-components';
import { Maximize2, MoreVertical, Loader2 } from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Card } from '../../../components/ui/Card';
import { useMarketTrend } from '../hooks/useMarketTrend';

const IndexList = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  &::-webkit-scrollbar { height: 4px; }
  &::-webkit-scrollbar-thumb { background: #eee; border-radius: 4px; }
`;

const IndexCard = styled.div<{ $active?: boolean }>`
  background: ${props => props.$active ? '#1A73E8' : (props.theme?.colors?.surfaceHover || '#F8F9FA')};
  padding: 12px 16px;
  border-radius: 12px;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const IndexName = styled.span<{ $active?: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.$active ? 'rgba(255,255,255,0.8)' : '#5F6368'};
`;

const IndexPrice = styled.span<{ $active?: boolean }>`
  font-size: 16px;
  font-weight: 800;
  color: ${props => props.$active ? '#FFFFFF' : '#202124'};
`;

const IndexChange = styled.span<{ $isUp: boolean, $active?: boolean }>`
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.$active ? 'rgba(255,255,255,0.9)' : (props.$isUp ? '#0F9D58' : '#DB4437')};
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  font-size: 11px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    flex-direction: column;
    gap: 12px;
  }

  .item {
    display: flex;
    align-items: center;
    gap: 6px;
    .indicator { width: 6px; height: 6px; border-radius: 50%; background: ${props => props.theme?.colors?.primary || '#1A73E8'}; }
    span { color: ${props => props.theme?.colors?.textMain || '#202124'}; }
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 180px;
  color: #1A73E8;
`;

export const MarketTrendSection: React.FC = () => {
  const [symbol, setSymbol] = useState('XU100');
  const { trendData, loading, error } = useMarketTrend(symbol);
  
  const [indexPrices, setIndexPrices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get('/api/stock/bulk-info?symbols=XU100,XU050,XU030');
        setIndexPrices(res.data.quotes || []);
      } catch (e) {}
    };
    fetchPrices();
    const inv = setInterval(fetchPrices, 60000);
    return () => clearInterval(inv);
  }, []);

  const latestPrice = trendData.length > 0 ? trendData[trendData.length - 1].price : 0;
  const highPrice = trendData.length > 0 ? Math.max(...trendData.map(d => d.price)) : 0;
  const lowPrice = trendData.length > 0 ? Math.min(...trendData.map(d => d.price)) : 0;

  return (
    <Card $padding="24px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>BIST Endeksleri</h3>
        <div style={{ display: 'flex', gap: 12, color: '#9AA0A6' }}>
          <Maximize2 size={16} style={{ cursor: 'pointer' }} />
          <MoreVertical size={16} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <IndexList>
        {(indexPrices.length > 0 ? indexPrices : [
          { symbol: 'XU100', name: 'BIST 100', price: 0, changePercent: 0 },
          { symbol: 'XU050', name: 'BIST 50', price: 0, changePercent: 0 },
          { symbol: 'XU030', name: 'BIST 30', price: 0, changePercent: 0 }
        ]).map(idx => {
          const isActive = symbol === idx.symbol;
          const isUp = idx.changePercent >= 0;
          return (
            <IndexCard key={idx.symbol} $active={isActive} onClick={() => setSymbol(idx.symbol)}>
              <IndexName $active={isActive}>{idx.name.replace('BIST ', '')}</IndexName>
              <IndexPrice $active={isActive}>
                {idx.price > 0 ? idx.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '---'}
              </IndexPrice>
              <IndexChange $isUp={isUp} $active={isActive}>
                {isUp ? '▲' : '▼'} %{Math.abs(idx.changePercent).toFixed(2)}
              </IndexChange>
            </IndexCard>
          );
        })}
      </IndexList>

      <div style={{ flex: 1, minHeight: 180, position: 'relative' }}>
        {loading ? (
          <LoadingOverlay><Loader2 className="animate-spin" size={24} /></LoadingOverlay>
        ) : error ? (
          <LoadingOverlay style={{ color: '#DB4437', fontSize: '12px' }}>{error}</LoadingOverlay>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#1A73E8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                formatter={(val) => [`₺${Number(val).toLocaleString('tr-TR')}`, 'Değer']}
              />
              <Area type="monotone" dataKey="price" stroke="none" fillOpacity={1} fill="url(#chartGrad)" />
              <Line type="monotone" dataKey="price" stroke="#1A73E8" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#1A73E8', stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <StatsBar>
        <div className="item"><div className="indicator" /> GÜNCEL: <span>₺{latestPrice.toLocaleString('tr-TR')}</span></div>
        <div className="item">GÜN YÜKSEK: <span>₺{highPrice.toLocaleString('tr-TR')}</span></div>
        <div className="item">GÜN DÜŞÜK: <span>₺{lowPrice.toLocaleString('tr-TR')}</span></div>
      </StatsBar>
    </Card>
  );
};
