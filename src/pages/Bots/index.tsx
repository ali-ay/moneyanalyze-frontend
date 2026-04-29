import React, { useState, useEffect } from 'react';
import { useBotManagement } from './logic';
import type { BotData } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../components/ui/Layout.styles';
import { MetricsGrid, MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../components/ui/Card.styles';
import { Bot, Power, Zap, TrendingUp, Save, Settings2 } from 'lucide-react';
import styled from 'styled-components';

// UI Components
import { Button } from '../../components/ui/Button';
import { Input, InputGroup, Label } from '../../components/ui/Input';
import { BotCard } from '../../components/shared/BotCard';

// ─── Styled Components (Sadece Sayfaya Özel Olanlar) ───

const BotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: ${props => props.theme?.spacing?.lg || '24px'};
  margin-top: ${props => props.theme?.spacing?.lg || '24px'};

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const ConfigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const BuyAmountContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    flex-direction: column;
  }
`;

const ApplyChangesButton = styled(Button)`
  box-shadow: 0 4px 12px rgba(15, 157, 88, 0.3);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(-10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

// ─── Sub-Component for Config ───────────────────────────

const BotConfigForm: React.FC<{ bot: BotData, onUpdate: (config: any) => void, isLoading: boolean }> = ({ bot, onUpdate, isLoading }) => {
  const [localConfig, setLocalConfig] = useState<any>(bot.config || {});

  useEffect(() => {
    if (!bot.config) {
      const defaults: any = {};
      if (bot.strategy === 'RSI') { defaults.rsiLow = 30; defaults.rsiHigh = 70; }
      if (bot.strategy === 'STOCH') { defaults.stochLow = 20; defaults.stochHigh = 80; defaults.stochPeriod = 14; }
      if (bot.strategy === 'EMA_CROSS') { defaults.emaShort = 9; defaults.emaLong = 21; }
      if (bot.strategy === 'BB') { defaults.bbPeriod = 20; defaults.bbStdDev = 2; }
      setLocalConfig(defaults);
    }
  }, [bot.strategy, bot.config]);

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prev: any) => ({ ...prev, [key]: Number(value) }));
  };

  const renderContent = () => {
    switch (bot.strategy) {
      case 'RSI':
        return (
          <ConfigGrid>
            <InputGroup><Label>RSI Alt (Al)</Label><Input type="number" value={localConfig.rsiLow || ''} onChange={e => handleChange('rsiLow', e.target.value)} /></InputGroup>
            <InputGroup><Label>RSI Üst (Sat)</Label><Input type="number" value={localConfig.rsiHigh || ''} onChange={e => handleChange('rsiHigh', e.target.value)} /></InputGroup>
          </ConfigGrid>
        );
      case 'STOCH':
        return (
          <ConfigGrid>
            <InputGroup><Label>%K Alt</Label><Input type="number" value={localConfig.stochLow || ''} onChange={e => handleChange('stochLow', e.target.value)} /></InputGroup>
            <InputGroup><Label>%K Üst</Label><Input type="number" value={localConfig.stochHigh || ''} onChange={e => handleChange('stochHigh', e.target.value)} /></InputGroup>
          </ConfigGrid>
        );
      case 'EMA_CROSS':
        return (
          <ConfigGrid>
            <InputGroup><Label>Kısa EMA</Label><Input type="number" value={localConfig.emaShort || ''} onChange={e => handleChange('emaShort', e.target.value)} /></InputGroup>
            <InputGroup><Label>Uzun EMA</Label><Input type="number" value={localConfig.emaLong || ''} onChange={e => handleChange('emaLong', e.target.value)} /></InputGroup>
          </ConfigGrid>
        );
      case 'BB':
        return (
          <ConfigGrid>
            <InputGroup><Label>Periyot</Label><Input type="number" value={localConfig.bbPeriod || ''} onChange={e => handleChange('bbPeriod', e.target.value)} /></InputGroup>
            <InputGroup><Label>Sapma</Label><Input type="number" value={localConfig.bbStdDev || ''} onChange={e => handleChange('bbStdDev', e.target.value)} /></InputGroup>
          </ConfigGrid>
        );
      default:
        return <p style={{ fontSize: '0.75rem', color: '#9AA0A6' }}>Bu strateji için ek ayar bulunmuyor.</p>;
    }
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid #DADCE0', paddingTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600, color: '#9AA0A6', marginBottom: '12px' }}>
        <Settings2 size={14} /> Bot Parametreleri
      </div>
      {renderContent()}
      <Button $variant="primary" $size="sm" $fullWidth onClick={() => onUpdate(localConfig)} disabled={isLoading}>
        {isLoading ? 'Kaydediliyor...' : <><Save size={14} style={{ marginRight: '6px' }} /> Ayarları Kaydet</>}
      </Button>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────

const BotsPage: React.FC = () => {
  const {
    bots, loading, pendingChanges, applyChanges, updatingBot, activeBotCount, toggleBot, updateBotConfig,
    buyAmount, setBuyAmount, updateBuyAmount, settingsLoading,
    mode, currencyLabel
  } = useBotManagement();

  if (loading) return <LoadingState>Bot paneli yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <PageHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <PageTitle>
            Bot Yönetimi — {mode === 'stock' ? 'BIST' : 'Kripto'}
          </PageTitle>
          <PageSubtitle>
            {mode === 'stock'
              ? 'BIST hisseleri için botları yönetin. Sadece bu modda aktif edilen stratejiler hisselere özel uygulanabilir.'
              : 'Kripto stratejilerini küresel olarak yönetin. Aktif stratejiler Coin Detay sayfalarında özelleştirilebilir.'}
          </PageSubtitle>
        </div>
        {pendingChanges && (
          <ApplyChangesButton $variant="success" onClick={applyChanges}>
            <Zap size={18} fill="white" /> Değişiklikleri Uygula
          </ApplyChangesButton>
        )}
      </PageHeader>

      <MetricsGrid>
        <MetricCard>
          <CardHeader>
            <CardTitle>Toplam Bot</CardTitle>
            <CardIcon $variant="primary"><Bot size={20} /></CardIcon>
          </CardHeader>
          <CardValue>{bots.length}</CardValue>
        </MetricCard>
        <MetricCard>
          <CardHeader>
            <CardTitle>Aktif Bot</CardTitle>
            <CardIcon $variant="success"><Power size={20} /></CardIcon>
          </CardHeader>
          <CardValue>{activeBotCount}</CardValue>
        </MetricCard>

        <MetricCard style={{ gridColumn: 'span 2' }}>
           <CardHeader>
            <CardTitle>İşlem Başına Alım Tutarı ({currencyLabel})</CardTitle>
            <CardIcon $variant="warning"><TrendingUp size={20} /></CardIcon>
          </CardHeader>
          <BuyAmountContainer>
            <Input 
              type="number" 
              value={buyAmount || ''} 
              onChange={(e) => setBuyAmount(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <Button $variant="primary" onClick={() => updateBuyAmount(buyAmount)} disabled={settingsLoading}>
              {settingsLoading ? '...' : 'Güncelle'}
            </Button>
          </BuyAmountContainer>
        </MetricCard>
      </MetricsGrid>

      <BotGrid>
        {bots.map((bot: BotData) => (
          <BotCard 
            key={bot.id} 
            bot={bot} 
            onToggle={toggleBot}
            renderConfig={(b) => (
              <BotConfigForm 
                bot={b} 
                onUpdate={(config) => updateBotConfig(b.id, config)} 
                isLoading={updatingBot === b.id} 
              />
            )}
          />
        ))}
      </BotGrid>
    </PageContainer>
  );
};

export default BotsPage;
