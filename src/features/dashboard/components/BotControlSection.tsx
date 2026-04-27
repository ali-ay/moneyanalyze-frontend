import React from 'react';
import styled from 'styled-components';
import { Settings, Bot as BotIcon, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';

const BotRow = styled.div`
  padding: 16px;
  border-radius: ${props => props.theme?.radius?.lg || '16px'};
  border: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  transition: all 0.2s;
  &:hover { 
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'}; 
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'}; 
  }
`;

const BotHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const BotLabel = styled.div`
  display: flex;
  gap: 12px;
  .icon-box {
    width: 40px;
    height: 40px;
    border-radius: ${props => props.theme?.radius?.md || '12px'};
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    &.active { 
      background: rgba(26, 115, 232, 0.1); 
      color: ${props => props.theme?.colors?.primary || '#1A73E8'}; 
    }
  }
  .info {
    .name { font-size: 14px; font-weight: 700; color: ${props => props.theme?.colors?.textMain || '#202124'}; }
    .type { font-size: 10px; font-weight: 600; color: ${props => props.theme?.colors?.textSecondary || '#5F6368'}; text-transform: uppercase; }
  }
`;

const BotFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  .profit {
    display: flex;
    flex-direction: column;
    .label { font-size: 9px; font-weight: 700; color: ${props => props.theme?.colors?.textSecondary || '#5F6368'}; text-transform: uppercase; }
    .val { font-size: 12px; font-weight: 700; color: ${props => props.theme?.colors?.success || '#0F9D58'}; }
  }
`;

const CreateBotCard = styled.button`
  margin-top: 24px;
  width: 100%;
  padding: 24px;
  border: 2px dashed ${props => props.theme?.colors?.border || '#DADCE0'};
  border-radius: ${props => props.theme?.radius?.lg || '16px'};
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { border-color: ${props => props.theme?.colors?.primary || '#1A73E8'}; color: ${props => props.theme?.colors?.primary || '#1A73E8'}; background: rgba(26, 115, 232, 0.02); }
`;

export const BotControlSection: React.FC = () => {
  return (
    <Card $padding="24px">
      <Card.Header style={{ padding: 0, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Bot Kontrol</h3>
        <Settings size={18} style={{ color: '#9AA0A6', cursor: 'pointer' }} />
      </Card.Header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BotRow>
          <BotHeader>
            <BotLabel>
              <div className="icon-box active"><BotIcon size={20} /></div>
              <div className="info"><div className="name">Grid Scalper Pro</div><div className="type">BTC/USDT STRATEGY</div></div>
            </BotLabel>
            <Badge $variant="success">AKTİF</Badge>
          </BotHeader>
          <BotFooter>
            <div className="profit"><div className="label">KAR/ZARAR:</div><div className="val">+$1,240.21</div></div>
            <Button $variant="danger" $size="sm" style={{ border: 'none', background: 'transparent', padding: 0 }}>DURDUR</Button>
          </BotFooter>
        </BotRow>

        <BotRow>
          <BotHeader>
            <BotLabel>
              <div className="icon-box"><BotIcon size={20} /></div>
              <div className="info"><div className="name">Trend Arbitrage</div><div className="type">MULTI-ASSET POOL</div></div>
            </BotLabel>
            <Badge $variant="neutral">DURAKLATILDI</Badge>
          </BotHeader>
          <BotFooter>
            <div className="profit"><div className="label">KAR/ZARAR:</div><div className="val" style={{ color: '#9AA0A6' }}>$0.00</div></div>
            <Button $variant="primary" $size="sm" style={{ border: 'none', background: 'transparent', padding: 0 }}>BAŞLAT</Button>
          </BotFooter>
        </BotRow>
      </div>

      <CreateBotCard>
        <div style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #DADCE0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Plus size={20} />
        </div>
        Yeni Bot Oluştur
      </CreateBotCard>
    </Card>
  );
};
