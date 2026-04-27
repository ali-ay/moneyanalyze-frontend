import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Wallet } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

const ValueDisplay = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;

  .amount {
    font-size: 36px;
    font-weight: 800;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
    letter-spacing: -1px;
  }
`;

const AiSection = styled.div`
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
`;

const AiTitle = styled.div`
  font-size: 11px;
  font-weight: 800;
  color: #9AA0A6;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AiGrid = styled.div`
  display: flex;
  gap: 10px;
`;

const AiCard = styled.div`
  flex: 1;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  padding: 10px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AiLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: #5F6368;
`;

const AiValue = styled.span<{ $pos: boolean }>`
  font-size: 14px;
  font-weight: 800;
  color: ${props => props.$pos ? '#0F9D58' : '#DB4437'};
`;

export const PortfolioSummary: React.FC = () => {
  const [aiReturns, setAiReturns] = React.useState({ weekly: 0, monthly: 0, threeMonth: 0 });

  React.useEffect(() => {
    const fetchAiPerformance = async () => {
      try {
        const [w, m, t] = await Promise.all([
          axios.get('http://localhost:5001/api/stock/opportunities?period=weekly'),
          axios.get('http://localhost:5001/api/stock/opportunities?period=monthly'),
          axios.get('http://localhost:5001/api/stock/opportunities?period=3mo')
        ]);
        
        const calcAvg = (data: any[]) => data.length > 0 
          ? data.reduce((sum, item) => sum + (item.profitPercent || 0), 0) / data.length 
          : 0;

        setAiReturns({
          weekly: calcAvg(w.data),
          monthly: calcAvg(m.data),
          threeMonth: calcAvg(t.data)
        });
      } catch (e) {}
    };
    fetchAiPerformance();
  }, []);

  return (
    <Card $padding="24px">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: '#9AA0A6', letterSpacing: '0.5px' }}>
          TOPLAM PORTFÖY DEĞERİ
        </span>
        <Wallet size={20} color="#1A73E8" />
      </div>
      
      <ValueDisplay>
        <div className="amount">₺124,592.00</div>
      </ValueDisplay>

      <AiSection>
        <AiTitle>🤖 ALGORİTMİK LİSTE PERFORMANSLARI</AiTitle>
        <AiGrid>
          <AiCard>
            <AiLabel>Haftalık</AiLabel>
            <AiValue $pos={aiReturns.weekly >= 0}>{aiReturns.weekly >= 0 ? '+' : ''}{aiReturns.weekly.toFixed(1)}%</AiValue>
          </AiCard>
          <AiCard>
            <AiLabel>Aylık</AiLabel>
            <AiValue $pos={aiReturns.monthly >= 0}>{aiReturns.monthly >= 0 ? '+' : ''}{aiReturns.monthly.toFixed(1)}%</AiValue>
          </AiCard>
          <AiCard>
            <AiLabel>3 Aylık</AiLabel>
            <AiValue $pos={aiReturns.threeMonth >= 0}>{aiReturns.threeMonth >= 0 ? '+' : ''}{aiReturns.threeMonth.toFixed(1)}%</AiValue>
          </AiCard>
        </AiGrid>
      </AiSection>
    </Card>
  );
};
