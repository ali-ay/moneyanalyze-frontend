import React from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { Badge } from '../ui/Badge';
import { Bot, TrendingUp, BarChart3, Waves, Activity, Zap, Layers, Power, Mountain } from 'lucide-react';

const STRATEGY_ICONS: Record<string, React.ReactNode> = {
  RSI: <TrendingUp size={20} />,
  MACD: <BarChart3 size={20} />,
  BB: <Waves size={20} />,
  EMA_CROSS: <Activity size={20} />,
  STOCH: <Zap size={20} />,
  VWAP: <Layers size={20} />,
  ADX: <Power size={20} />,
  ICHIMOKU: <Mountain size={20} />,
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

const BotIconWrap = styled.div<{ $isActive: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isActive ? 'rgba(26, 115, 232, 0.1)' : props.theme.colors.background};
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.textSecondary};
`;

const BotName = styled.h4`
  margin: 0;
  font-size: 15px;
  color: ${props => props.theme.colors.textMain};
`;

const BotDescription = styled.p`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  margin: 12px 0;
  line-height: 1.5;
`;

interface BotCardProps {
  bot: any;
  onToggle: (id: string) => void;
  renderConfig?: (bot: any) => React.ReactNode;
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onToggle, renderConfig }) => {
  return (
    <Card style={{ border: bot.isActive ? '2px solid #0f9d58' : undefined }}>
      <Card.Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BotIconWrap $isActive={bot.isActive}>
            {STRATEGY_ICONS[bot.strategy] || <Bot size={20} />}
          </BotIconWrap>
          <div>
            <BotName>{bot.name}</BotName>
            <Badge $variant="neutral" $size="sm">{bot.strategy}</Badge>
          </div>
        </div>
        <Switch 
          checked={bot.isActive} 
          onChange={() => onToggle(bot.id)} 
        />
      </Card.Header>
      <Card.Body>
        <BotDescription>
          {STRATEGY_DESCRIPTIONS[bot.strategy] || bot.description}
        </BotDescription>
        {renderConfig && renderConfig(bot)}
      </Card.Body>
    </Card>
  );
};
