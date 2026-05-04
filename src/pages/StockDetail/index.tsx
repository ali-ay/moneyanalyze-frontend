import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as S from './StockDetail.styles';
import styled from 'styled-components';
import { useStockDetailLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { TimeframeButtons, DEFAULT_STOCK_TIMEFRAMES } from '../../components/ui/TimeframeButton';
import { TechnicalPanel } from '../../components/panels/TechnicalPanel';
import { Grid } from '../../components/primitives/Grid';
import { HStack } from '../../components/primitives/Flex';
import { ArrowLeft, TrendingUp, TrendingDown, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AIBacktestPanel } from './AIBacktestPanel';
import { StrategyManagementPanel } from './StrategyManagementPanel';

const PriceDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PriceText = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
`;

const ChangeBadge = styled.div<{ $positive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: ${props => props.theme.radius.md};
  font-weight: 600;
  font-size: 0.875rem;
  background: ${props => props.$positive
    ? `${props.theme.colors.success}15`
    : `${props.theme.colors.danger}15`};
  color: ${props => props.$positive
    ? props.theme.colors.success
    : props.theme.colors.danger};
`;

const FundamentalCard = styled.div`
  padding: 16px;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.radius.md};
`;

const FundamentalLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const FundamentalValue = styled.div`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
`;

const formatNumber = (n?: number) => {
  if (n === undefined || n === null) return '-';
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(2)}K`;
  return n.toLocaleString();
};

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const {
    history,
    loading,
    price,
    changePercent,
    change,
    timeframe,
    setTimeframe,
    technicalSummary,
    fundamentals,
    backtestData,
    backtestLoading,
    backtestPeriod,
    setBacktestPeriod,
    setBacktestPeriod,
    optimizedData,
    optimizedLoading,
    specificSettings,
    settingsLoading,
    saveSpecificSettings,
    triggerManualAnalysis,
    isAnalyzing
  } = useStockDetailLogic(symbol);

  if (loading && history.length === 0) {
    return <LoadingState>{symbol} detayları yükleniyor...</LoadingState>;
  }

  const isUp = (changePercent || 0) >= 0;

  return (
    <PageContainer>
      <S.BackButton>
        <Button
          $variant="secondary"
          $size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Geri
        </Button>
      </S.BackButton>

      <PageHeader>
        <HStack $justify="space-between" $align="flex-start" $fullWidth>
          <div>
            <PageTitle>{fundamentals?.name || symbol}</PageTitle>
            <PageSubtitle>{symbol} • BIST</PageSubtitle>
            <S.PriceDisplayWrapper>
                <PriceDisplay>
                  <PriceText>₺{price.toFixed(2)}</PriceText>
                  <ChangeBadge $positive={isUp}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isUp ? '+' : ''}
                    {change.toFixed(2)} ({isUp ? '+' : ''}
                    {changePercent.toFixed(2)}%)
                  </ChangeBadge>
                </PriceDisplay>
            </S.PriceDisplayWrapper>
          </div>
        </HStack>
      </PageHeader>

      <ChartContainer
        title="Fiyat Grafiği"
        actions={
          <TimeframeButtons
            options={DEFAULT_STOCK_TIMEFRAMES}
            value={timeframe}
            onChange={(v) => setTimeframe(v as typeof timeframe)}
          />
        }
        isEmpty={history.length === 0}
      >
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={history}>
            <defs>
              <linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1A73E8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1A73E8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: '0.625rem', fill: '#9AA0A6' }}
              minTickGap={30}
            />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                fontSize: '0.75rem',
              }}
              formatter={(value: any) => [`₺${value}`, 'Fiyat']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1A73E8"
              strokeWidth={2}
              fill="url(#stockColor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      {fundamentals && (
        <S.CardWithMargin as={Card}>
          <Card.Body>
            <S.SectionTitle>
              Temel Veriler
            </S.SectionTitle>
            <Grid $columns="repeat(auto-fit, minmax(150px, 1fr))" $gap="md">
              <FundamentalCard>
                <FundamentalLabel>Piyasa Değeri</FundamentalLabel>
                <FundamentalValue>₺{formatNumber(fundamentals.marketCap)}</FundamentalValue>
              </FundamentalCard>
              <FundamentalCard>
                <FundamentalLabel>F/K Oranı</FundamentalLabel>
                <FundamentalValue>
                  {fundamentals.peRatio?.toFixed(2) || '-'}
                </FundamentalValue>
              </FundamentalCard>
              <FundamentalCard>
                <FundamentalLabel>Temettü Verimi</FundamentalLabel>
                <FundamentalValue>
                  {fundamentals.dividendYield
                    ? `${(fundamentals.dividendYield * 100).toFixed(2)}%`
                    : '-'}
                </FundamentalValue>
              </FundamentalCard>
              <FundamentalCard>
                <FundamentalLabel>52H En Yüksek</FundamentalLabel>
                <FundamentalValue>
                  ₺{fundamentals.high52w?.toFixed(2) || '-'}
                </FundamentalValue>
              </FundamentalCard>
              <FundamentalCard>
                <FundamentalLabel>52H En Düşük</FundamentalLabel>
                <FundamentalValue>
                  ₺{fundamentals.low52w?.toFixed(2) || '-'}
                </FundamentalValue>
              </FundamentalCard>
            </Grid>
          </Card.Body>
        </S.CardWithMargin>
      )}

      <StrategyManagementPanel
        symbol={symbol || ''}
        period={backtestPeriod}
        setPeriod={setBacktestPeriod}
        specificSettings={specificSettings}
        loading={settingsLoading}
        onSave={(s) => saveSpecificSettings(backtestPeriod, s)}
        onAnalyze={() => triggerManualAnalysis(backtestPeriod)}
        isAnalyzing={isAnalyzing}
      />

      <AIBacktestPanel 
        data={backtestData} 
        loading={backtestLoading} 
        period={backtestPeriod}
        setPeriod={setBacktestPeriod}
        optimizedData={optimizedData}
        optimizedLoading={optimizedLoading}
      />

      {technicalSummary && (
        <TechnicalPanel
          indicators={null}
          signal={technicalSummary.signal as any}
          score={technicalSummary.score}
          loading={loading}
        />
      )}
    </PageContainer>
  );
};

export default StockDetail;
