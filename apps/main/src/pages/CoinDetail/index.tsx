import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCoinDetailLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ChartContainer } from '../../components/charts/ChartContainer';
import { TimeframeButtons, DEFAULT_CRYPTO_TIMEFRAMES } from '../../components/ui/TimeframeButton';
import { TechnicalPanel } from '../../components/panels/TechnicalPanel';
import { BotStatusPanel } from '../../components/panels/BotStatusPanel';
import { HStack } from '../../components/primitives/Flex';
import { ArrowLeft, Calendar, Zap, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as S from './CoinDetail.styles';

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
    watchlistInfo,
    updateEntryPrice,
  } = useCoinDetailLogic(symbol);

  if (loading && bots.length === 0) {
    return <LoadingState>{symbol} detayları yükleniyor...</LoadingState>;
  }

  return (
    <PageContainer>
      <S.BackButtonContainer style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Button
          $variant="secondary"
          $size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Geri
        </Button>
        <Button
          $variant="primary"
          $size="sm"
          onClick={() => navigate(`/dashboard/stock-activity/${symbol}`)}
        >
          <Clock size={16} /> Kripto Hareket Geçmişi
        </Button>
      </S.BackButtonContainer>

      <PageHeader>
        <HStack $justify="space-between" $align="flex-start" $fullWidth style={{ flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <HStack $align="center" $gap="md">
              <PageTitle>{symbol}</PageTitle>
              <S.PriceDisplay>
                ${price}
              </S.PriceDisplay>
            </HStack>
            <PageSubtitle>
              Teknik analiz ve bot yönetimi.
            </PageSubtitle>
          </div>

          {watchlistInfo && (
            <Card style={{ minWidth: '240px', border: '1px solid #1A73E820', background: '#1A73E805' }}>
              <Card.Body style={{ padding: '12px 16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#5F6368', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={14} color="#1A73E8" /> İZLEME LİSTESİ DURUMU
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: '#9AA0A6' }}>Giriş Fiyatı</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>${watchlistInfo.entryPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.65rem', color: '#9AA0A6' }}>Kâr/Zarar</div>
                    {(() => {
                      const currentVal = parseFloat(price.replace(/,/g, ''));
                      const changePct = ((currentVal - watchlistInfo.entryPrice) / watchlistInfo.entryPrice) * 100;
                      return (
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: changePct >= 0 ? '#0F9D58' : '#DB4437' }}>
                          {changePct >= 0 ? '+' : ''}{changePct.toFixed(2)}%
                        </div>
                      );
                    })()}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5F6368' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> Ekleme Tarihi</span>
                    <span style={{ fontWeight: 600, color: '#3C4043' }}>
                      {watchlistInfo.createdAt ? new Date(watchlistInfo.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5F6368' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> Ekleme Saati</span>
                    <span style={{ fontWeight: 600, color: '#3C4043' }}>
                      {watchlistInfo.createdAt ? new Date(watchlistInfo.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.7rem', color: '#5F6368' }}>
                    <span>İzleme Periyodu</span>
                    <span style={{ fontWeight: 700, color: '#1A73E8', background: '#1A73E810', padding: '2px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
                      {watchlistInfo.period || 'Manuel'}
                    </span>
                  </div>
                </div>
                
                {/* Bölünme Uyarısı ve Düzeltme */}
                {(() => {
                  const currentVal = parseFloat(price.replace(/,/g, ''));
                  const changePct = ((currentVal - watchlistInfo.entryPrice) / watchlistInfo.entryPrice) * 100;
                  if (Math.abs(changePct) > 35) {
                    return (
                      <div style={{ marginTop: '12px', padding: '8px', background: '#F4B40015', borderRadius: '8px', border: '1px solid #F4B40030' }}>
                        <div style={{ fontSize: '0.65rem', color: '#B08900', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertCircle size={12} /> BÜYÜK DEĞİŞİM TESPİT EDİLDİ
                        </div>
                        <Button 
                          $variant="primary" 
                          $size="sm" 
                          style={{ width: '100%', marginTop: '6px', fontSize: '10px', height: '24px' }}
                          onClick={() => {
                            const newPrice = prompt("Yeni giriş fiyatını (maliyeti) giriniz:", (watchlistInfo.entryPrice).toString());
                            if (newPrice) updateEntryPrice(parseFloat(newPrice));
                          }}
                        >
                          Maliyeti Düzelt
                        </Button>
                      </div>
                    );
                  }
                  return null;
                })()}
              </Card.Body>
            </Card>
          )}
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
