import React, { useState, useEffect, useMemo } from 'react';
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
import { useMarketMode } from '../../../context/MarketModeContext';
import api from '../../../services/apiClient';

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
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${props => props.$active ? 'rgba(255,255,255,0.8)' : '#5F6368'};
`;

const IndexPrice = styled.span<{ $active?: boolean }>`
  font-size: 1rem;
  font-weight: 800;
  color: ${props => props.$active ? '#FFFFFF' : '#202124'};
`;

const IndexChange = styled.span<{ $isUp: boolean, $active?: boolean }>`
  font-size: 0.6875rem;
  font-weight: 700;
  color: ${props => props.$active ? 'rgba(255,255,255,0.9)' : (props.$isUp ? '#0F9D58' : '#DB4437')};
`;

const StatsBar = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  font-size: 0.6875rem;
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

interface IndexEntry {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
}

const STOCK_INDICES: IndexEntry[] = [
  { symbol: 'XU100', name: 'BIST 100', price: 0, changePercent: 0 },
  { symbol: 'XU050', name: 'BIST 50', price: 0, changePercent: 0 },
  { symbol: 'XU030', name: 'BIST 30', price: 0, changePercent: 0 },
];

const CRYPTO_TICKERS: IndexEntry[] = [
  { symbol: 'BTCUSDT', name: 'BTC', price: 0, changePercent: 0 },
  { symbol: 'ETHUSDT', name: 'ETH', price: 0, changePercent: 0 },
  { symbol: 'BNBUSDT', name: 'BNB', price: 0, changePercent: 0 },
  { symbol: 'SOLUSDT', name: 'SOL', price: 0, changePercent: 0 },
];

export const MarketTrendSection: React.FC = () => {
  const { mode } = useMarketMode();
  const defaults = useMemo(
    () => (mode === 'stock' ? STOCK_INDICES : CRYPTO_TICKERS),
    [mode]
  );
  const [symbol, setSymbol] = useState(defaults[0].symbol);
  const [indexPrices, setIndexPrices] = useState<IndexEntry[]>(defaults);
  const { trendData, loading, error } = useMarketTrend(symbol);

  // Mode değişince ilk sembolü resetle
  useEffect(() => {
    setSymbol(defaults[0].symbol);
    setIndexPrices(defaults);
  }, [defaults]);

  // Mode'a göre fiyat fetch
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchPrices = async () => {
      try {
        if (mode === 'stock') {
          const res = await api.get('/stock/bulk-info?symbols=XU100,XU050,XU030', {
            signal: controller.signal,
          });
          if (cancelled) return;
          const quotes = res.data?.quotes || [];
          setIndexPrices(
            STOCK_INDICES.map(idx => {
              const q = quotes.find((x: any) => x.symbol === idx.symbol);
              return q
                ? { ...idx, price: q.price || 0, changePercent: q.changePercent || 0 }
                : idx;
            })
          );
        } else {
          const results = await Promise.all(
            CRYPTO_TICKERS.map(async t => {
              try {
                const res = await api.get(`/market/ticker/${t.symbol}`, {
                  signal: controller.signal,
                });
                return {
                  ...t,
                  price: parseFloat(res.data.lastPrice) || 0,
                  changePercent: parseFloat(res.data.priceChangePercent) || 0,
                };
              } catch {
                return t;
              }
            })
          );
          if (!cancelled) setIndexPrices(results);
        }
      } catch (e: any) {
        if (e?.name === 'CanceledError' || e?.code === 'ERR_CANCELED') return;
      }
    };

    fetchPrices();
    const inv = setInterval(fetchPrices, 60000);
    return () => {
      cancelled = true;
      clearInterval(inv);
      controller.abort();
    };
  }, [mode]);

  const latestPrice = trendData.length > 0 ? trendData[trendData.length - 1].price : 0;
  const highPrice = trendData.length > 0 ? Math.max(...trendData.map(d => d.price)) : 0;
  const lowPrice = trendData.length > 0 ? Math.min(...trendData.map(d => d.price)) : 0;

  const currency = mode === 'stock' ? '₺' : '$';
  const sectionTitle = mode === 'stock' ? 'BIST Endeksleri' : 'Kripto Piyasalar';

  const formatPrice = (val: number) =>
    mode === 'stock'
      ? val.toLocaleString('tr-TR', { minimumFractionDigits: 2 })
      : val.toLocaleString('en-US', { minimumFractionDigits: 2 });

  return (
    <Card $padding="24px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{sectionTitle}</h3>
        <div style={{ display: 'flex', gap: 12, color: '#9AA0A6' }}>
          <Maximize2 size={16} style={{ cursor: 'pointer' }} />
          <MoreVertical size={16} style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <IndexList>
        {indexPrices.map(idx => {
          const isActive = symbol === idx.symbol;
          const isUp = idx.changePercent >= 0;
          return (
            <IndexCard
              key={idx.symbol}
              $active={isActive}
              onClick={() => setSymbol(idx.symbol)}
            >
              <IndexName $active={isActive}>{idx.name}</IndexName>
              <IndexPrice $active={isActive}>
                {idx.price > 0 ? formatPrice(idx.price) : '---'}
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
          <LoadingOverlay style={{ color: '#DB4437', fontSize: '0.75rem' }}>{error}</LoadingOverlay>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <ComposedChart data={trendData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={['auto', 'auto']} hide />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '0.6875rem' }}
                formatter={(val) => [`${currency}${formatPrice(Number(val))}`, 'Değer']}
              />
              <Area type="monotone" dataKey="price" stroke="none" fillOpacity={1} fill="url(#chartGrad)" />
              <Line type="monotone" dataKey="price" stroke="#1A73E8" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: '#1A73E8', stroke: '#fff' }} />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      <StatsBar>
        <div className="item"><div className="indicator" /> GÜNCEL: <span>{currency}{formatPrice(latestPrice)}</span></div>
        <div className="item">GÜN YÜKSEK: <span>{currency}{formatPrice(highPrice)}</span></div>
        <div className="item">GÜN DÜŞÜK: <span>{currency}{formatPrice(lowPrice)}</span></div>
      </StatsBar>
    </Card>
  );
};
