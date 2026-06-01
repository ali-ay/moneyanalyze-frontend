import React, { useState, useEffect } from 'react';
import * as S from './StrategyManagementPanel.styles';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Settings, Play, Save, RotateCcw } from 'lucide-react';
import { useNotification } from '../../app/providers/NotificationContext';

interface StrategyManagementPanelProps {
  symbol: string;
  period: string;
  setPeriod: (p: string) => void;
  specificSettings: any;
  loading: boolean;
  onSave: (settings: any) => Promise<void>;
  onAnalyze: () => Promise<void>;
  isAnalyzing: boolean;
}

export const StrategyManagementPanel: React.FC<StrategyManagementPanelProps> = ({
  symbol,
  period,
  setPeriod,
  specificSettings,
  loading,
  onSave,
  onAnalyze,
  isAnalyzing
}) => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    rsiThreshold: 30,
    smaShort: 20,
    smaLong: 50,
    strategyId: 'TREND_FOLLOWING',
    useTrendFilter: true
  });

  useEffect(() => {
    if (specificSettings) {
      setFormData({
        rsiThreshold: specificSettings.rsiThreshold || 30,
        smaShort: specificSettings.smaShort || 20,
        smaLong: specificSettings.smaLong || 50,
        strategyId: specificSettings.strategyId || 'TREND_FOLLOWING',
        useTrendFilter: specificSettings.useTrendFilter ?? true,
        stopLossMultiplier: specificSettings.stopLossMultiplier || 2.0
      });
    } else {
      // Default reset
      setFormData({
        rsiThreshold: 30,
        smaShort: 20,
        smaLong: 50,
        strategyId: 'TREND_FOLLOWING',
        useTrendFilter: true,
        stopLossMultiplier: 2.0
      });
    }
  }, [specificSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
      showNotification('Analiz parametreleri başarıyla güncellendi.', 'success');
    } catch (err) {
      showNotification('Ayarlar kaydedilirken bir hata oluştu.', 'error');
    }
  };

  const handleRunAnalysis = async () => {
    try {
      await onAnalyze();
      showNotification('Özel analiz başlatıldı ve sonuçlar güncellendi.', 'success');
    } catch (err) {
      showNotification('Analiz sırasında bir hata oluştu.', 'error');
    }
  };

  const periods = [
    { id: 'weekly', label: 'Haftalık' },
    { id: 'monthly', label: 'Aylık' },
    { id: '1y', label: 'Yıllık' }
  ];

  return (
    <S.PanelContainer>
      <Card>
        <Card.Body>
          <S.StrategyHeader>
            <S.Title>
              <Settings size={20} /> Strateji ve Analiz Senaryosu
              {specificSettings && <S.Badge>Manuel Müdahale Aktif</S.Badge>}
            </S.Title>
            <S.PeriodSelector>
              {periods.map(p => (
                <S.PeriodBtn 
                   key={p.id} 
                  $active={period === p.id}
                  onClick={() => setPeriod(p.id)}
                >
                  {p.label}
                </S.PeriodBtn>
              ))}
            </S.PeriodSelector>
          </S.StrategyHeader>

          <S.ParamsGrid>
            <S.ParamCard>
              <S.Label>Analiz Stratejisi</S.Label>
              <S.Select 
                name="strategyId" 
                value={formData.strategyId} 
                onChange={handleChange}
              >
                <option value="TREND_FOLLOWING">Trend Takibi (SMA/MACD)</option>
                <option value="MEAN_REVERSION">Aşırı Satım Dönüşü (RSI)</option>
                <option value="MOMENTUM">Momentum Patlaması</option>
                <option value="VOLATILITY_BREAKOUT">Volatilite Patlaması (Bollinger)</option>
                <option value="SUPERTREND_FOLLOW">SuperTrend Takibi</option>
              </S.Select>
            </S.ParamCard>

            <S.ParamCard>
              <S.Label>Stop-Loss Çarpanı (ATR)</S.Label>
              <S.Input 
                type="number" 
                name="stopLossMultiplier" 
                value={formData.stopLossMultiplier} 
                onChange={handleChange}
                step={0.1}
                min={0.5} max={10}
              />
            </S.ParamCard>

            <S.ParamCard>
              <S.Label>RSI Alım Eşiği (Oversold)</S.Label>
              <S.Input 
                type="number" 
                name="rsiThreshold" 
                value={formData.rsiThreshold} 
                onChange={handleChange}
                min={1} max={100}
              />
            </S.ParamCard>

            <S.ParamCard>
              <S.Label>SMA Kısa Periyot</S.Label>
              <S.Input 
                type="number" 
                name="smaShort" 
                value={formData.smaShort} 
                onChange={handleChange}
                min={5} max={100}
              />
            </S.ParamCard>

            <S.ParamCard>
              <S.Label>SMA Uzun Periyot</S.Label>
              <S.Input 
                type="number" 
                name="smaLong" 
                value={formData.smaLong} 
                onChange={handleChange}
                min={20} max={200}
              />
            </S.ParamCard>
          </S.ParamsGrid>

          <S.ActionButtons>
            <Button 
              $variant="secondary" 
              onClick={() => setFormData({ rsiThreshold: 30, smaShort: 20, smaLong: 50, strategyId: 'TREND_FOLLOWING', useTrendFilter: true })}
            >
              <RotateCcw size={16} /> Sıfırla
            </Button>
            <Button 
              $variant="primary" 
              onClick={handleSave}
              disabled={loading}
            >
              <Save size={16} /> {loading ? 'Kaydediliyor...' : 'Senaryoyu Kaydet'}
            </Button>
            <Button 
              $variant="primary" 
              style={{ background: '#171717' }} 
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
            >
              <Play size={16} /> {isAnalyzing ? 'Analiz Ediliyor...' : 'Analizi Çalıştır'}
            </Button>
          </S.ActionButtons>
        </Card.Body>
      </Card>
    </S.PanelContainer>
  );
};
