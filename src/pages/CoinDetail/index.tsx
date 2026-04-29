import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoinDetailLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { Button } from '../../components/ui/Button';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { TimeframeButtons, DEFAULT_CRYPTO_TIMEFRAMES } from '../../components/ui/TimeframeButton';
import { TechnicalPanel } from '../../components/panels/TechnicalPanel';
import { BotStatusPanel } from '../../components/panels/BotStatusPanel';
import { HStack } from '../../components/primitives/Flex';
import { ArrowLeft, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CoinDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const navigate = useNavigate();
  const {
    bots,
    indicators,
    history,
    loading,
    price,
    timeframe,
    setTimeframe,
    updatingBot,
    toggleBot,
  } = useCoinDetailLogic(symbol);

  if (loading && bots.length === 0) {
    return <LoadingState>{symbol} detayları yükleniyor...</LoadingState>;
  }

  return (
    <PageContainer>
      <Button
        $variant="secondary"
        $size="sm"
        onClick={() => navigate(-1)}
        style={{ marginBottom: '16px', alignSelf: 'flex-start' }}
      >
        <ArrowLeft size={16} /> Geri
      </Button>

      <PageHeader>
        <HStack $justify="space-between" $align="flex-start" $fullWidth>
          <div>
            <HStack $align="center" $gap="md">
              <PageTitle>{symbol}</PageTitle>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1A73E8' }}>
                ${price}
              </div>
            </HStack>
            <PageSubtitle>
              Teknik analiz ve bot yönetimi.
            </PageSubtitle>
          </div>
        </HStack>
      </PageHeader>

      <ChartContainer
        title="Fiyat Geçmişi"
        actions={
          <TimeframeButtons
            options={DEFAULT_CRYPTO_TIMEFRAMES}
            value={timeframe}
            onChange={setTimeframe}
          />
        }
        isEmpty={!history || history.length === 0}
      >
        <ResponsiveContainer width="100%" height={300}>
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
              formatter={(value: any) => [`$${value}`, 'Fiyat']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1A73E8"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>

      <TechnicalPanel
        indicators={indicators as any}
        loading={loading}
      />

      <BotStatusPanel
        bots={bots}
        loading={loading}
        updatingBotId={updatingBot}
        onToggle={toggleBot}
      />
    </PageContainer>
  );
};

export default CoinDetail;
