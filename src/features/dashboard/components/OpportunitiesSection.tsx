import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Zap, TrendingUp, BarChart2, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';

const OpportunitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const OpportunityCard = styled.div`
  background: ${props => props.theme?.colors?.surface || '#ffffff'};
  border: 1px solid ${props => props.theme?.colors?.surfaceHover || '#f1f3f4'};
  border-radius: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    border-color: #1A73E8;
  }
`;

const Badge = styled.div<{ $score: number }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 12px;
  background: ${props => props.$score > 80 ? '#0F9D58' : props.$score > 60 ? '#F4B400' : '#1A73E8'};
  color: white;
  font-size: 10px;
  font-weight: 800;
  border-bottom-left-radius: 12px;
`;

const SymbolName = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin-bottom: 4px;
`;

const SignalType = styled.div`
  font-size: 11px;
  color: #1A73E8;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 12px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

const MetricValue = styled.span`
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const OpportunitiesSection: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/stock/opportunities');
        setOpportunities(response.data);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  if (loading) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <Card.Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="#F4B400" fill="#F4B400" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Algoritmik Fırsatlar (AI Tarama)</h3>
          </div>
        </Card.Header>
        <Card.Body style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 className="animate-spin" size={32} color="#1A73E8" />
        </Card.Body>
      </Card>
    );
  }

  if (opportunities.length === 0) return null;

  return (
    <Card style={{ marginBottom: 24 }}>
      <Card.Header>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={20} color="#F4B400" fill="#F4B400" />
          <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Algoritmik Fırsatlar (Haftalık Takip)</h3>
        </div>
        <div style={{ fontSize: 12, color: '#5F6368' }}>Teknik analiz modellerine göre yükseliş potansiyeli olanlar</div>
      </Card.Header>
      <Card.Body $noPadding style={{ padding: '0 24px 24px' }}>
        <OpportunitiesGrid>
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} onClick={() => navigate(`/dashboard/stock/${opp.symbol}`)}>
              <Badge $score={opp.strengthScore}>SKOR: {opp.strengthScore}</Badge>
              <SymbolName>{opp.symbol.replace('.IS', '')}</SymbolName>
              <SignalType>
                {opp.signalType.split(',').map((s: string) => (
                  <span key={s}>#{s}</span>
                ))}
              </SignalType>
              
              <MetricRow>
                <span>Giriş:</span>
                <MetricValue>₺{opp.entryPrice || '0.00'}</MetricValue>
              </MetricRow>
              <MetricRow>
                <span>Güncel:</span>
                <MetricValue>₺{opp.data?.price || '0.00'}</MetricValue>
              </MetricRow>
              <MetricRow>
                <span>Getiri:</span>
                <MetricValue style={{ color: opp.profitPercent >= 0 ? '#0F9D58' : '#DB4437' }}>
                  {opp.profitPercent >= 0 ? '+' : ''}{opp.profitPercent}%
                </MetricValue>
              </MetricRow>
              <MetricRow>
                <span>Tarih:</span>
                <MetricValue style={{ fontSize: '10px' }}>
                  {new Date(opp.createdAt).toLocaleDateString('tr-TR')} {new Date(opp.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </MetricValue>
              </MetricRow>

              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', color: '#1A73E8', fontSize: 11, fontWeight: 700 }}>
                DETAYLAR <ChevronRight size={14} />
              </div>
            </OpportunityCard>
          ))}
        </OpportunitiesGrid>
      </Card.Body>
    </Card>
  );
};
