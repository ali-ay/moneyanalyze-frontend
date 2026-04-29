import React from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { Bot, Activity } from 'lucide-react';

const PanelContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;
`;

const ActiveCount = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BotRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing?.md || '16px'};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const BotInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BotIcon = styled.div<{ $active?: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$active
    ? `${props.theme.colors.success}15`
    : `${props.theme.colors.textSecondary}15`};
  color: ${props => props.$active
    ? props.theme.colors.success
    : props.theme.colors.textSecondary};
`;

const BotName = styled.div`
  font-weight: 600;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
`;

const BotStrategy = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
`;

const EmptyState = styled.div`
  padding: ${props => props.theme.spacing?.xl || '40px'};
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export interface BotData {
  id: string;
  name: string;
  strategy: string;
  isActive: boolean;
  description?: string | null;
}

export interface BotStatusPanelProps {
  bots: BotData[];
  loading?: boolean;
  updatingBotId?: string | null;
  onToggle?: (botId: string) => void;
}

export const BotStatusPanel: React.FC<BotStatusPanelProps> = ({
  bots,
  loading,
  updatingBotId,
  onToggle,
}) => {
  const activeCount = bots.filter(b => b.isActive).length;

  return (
    <PanelContainer>
      <Card>
        <Card.Body $noPadding>
          <div style={{ padding: '20px 24px' }}>
            <PanelHeader>
              <PanelTitle>Bot Yönetimi</PanelTitle>
              <ActiveCount>
                <Activity size={14} />
                {activeCount} / {bots.length} aktif
              </ActiveCount>
            </PanelHeader>

            {loading ? (
              <EmptyState>Botlar yükleniyor...</EmptyState>
            ) : bots.length === 0 ? (
              <EmptyState>Henüz bot eklenmemiş.</EmptyState>
            ) : (
              <div>
                {bots.map(bot => (
                  <BotRow key={bot.id}>
                    <BotInfo>
                      <BotIcon $active={bot.isActive}>
                        <Bot size={18} />
                      </BotIcon>
                      <div>
                        <BotName>{bot.name || bot.strategy}</BotName>
                        <BotStrategy>{bot.strategy}</BotStrategy>
                      </div>
                    </BotInfo>
                    <Switch
                      checked={bot.isActive}
                      onChange={() => onToggle?.(bot.id)}
                      disabled={updatingBotId === bot.id}
                    />
                  </BotRow>
                ))}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </PanelContainer>
  );
};
