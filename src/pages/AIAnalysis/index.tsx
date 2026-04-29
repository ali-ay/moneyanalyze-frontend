import React from 'react';
import styled from 'styled-components';
import { useAIAnalysisLogic } from './logic';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ChevronRight, 
  Loader2, 
  TrendingUp, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PageContainer, PageHeader, PageTitle, PageSubtitle } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #E8F0FE;
    border-radius: 10px;
  }
`;

const TabItem = styled.button<{ $active: boolean }>`
  padding: 10px 20px;
  border-radius: 12px;
  border: 1px solid ${props => props.$active ? props.theme?.colors?.primary || '#1A73E8' : props.theme?.colors?.border || '#DADCE0'};
  background: ${props => props.$active ? props.theme?.colors?.secondary || '#E8F0FE' : '#FFFFFF'};
  color: ${props => props.$active ? props.theme?.colors?.primary || '#1A73E8' : props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 700;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    background: ${props => props.$active ? props.theme?.colors?.secondary || '#E8F0FE' : props.theme?.colors?.surfaceHover || '#F8F9FA'};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const OpportunityCard = styled.div`
  background: white;
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  border-radius: 20px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.1);
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }
`;

const ScoreBadge = styled.div<{ $score: number }>`
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 16px;
  background: ${props => props.$score > 80 ? '#0F9D58' : props.$score > 60 ? '#F4B400' : '#1A73E8'};
  color: white;
  font-size: 0.75rem;
  font-weight: 800;
  border-bottom-left-radius: 16px;
`;

const Symbol = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #202124;
  margin-bottom: 4px;
`;

const SignalTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;
`;

const Tag = styled.span`
  font-size: 0.625rem;
  font-weight: 700;
  color: #1A73E8;
  background: #E8F0FE;
  padding: 2px 8px;
  border-radius: 6px;
  text-transform: uppercase;
`;

const Metric = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.8125rem;
  
  .label {
    color: #5F6368;
  }
  .value {
    font-weight: 700;
    color: #202124;
  }
`;

const periods = [
  { id: 'weekly', label: 'Haftalık' },
  { id: 'monthly', label: 'Aylık' },
  { id: '3mo', label: '3 Aylık' },
  { id: '6mo', label: '6 Aylık' },
  { id: '1y', label: 'Yıllık' },
];

const AIAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { 
    opportunities, 
    livePrices, 
    loading, 
    activePeriod, 
    setActivePeriod 
  } = useAIAnalysisLogic();

  return (
    <PageContainer>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            background: '#1A73E8', 
            borderRadius: 12, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white'
          }}>
            <Zap size={24} fill="white" />
          </div>
          <div>
            <PageTitle>Yapay Zeka Teknik Analiz</PageTitle>
            <PageSubtitle>
              Algoritmik modeller ve indikatörler ışığında hazırlanan teknik görünüm özetleri.
              <span style={{ display: 'block', color: '#DB4437', fontWeight: 700, marginTop: 4, fontSize: '0.75rem' }}>
                * Yatırım tavsiyesi değildir.
              </span>
            </PageSubtitle>
          </div>
        </div>
      </PageHeader>

      <TabsContainer>
        {periods.map(p => (
          <TabItem 
            key={p.id} 
            $active={activePeriod === p.id}
            onClick={() => setActivePeriod(p.id)}
          >
            {p.label}
          </TabItem>
        ))}
      </TabsContainer>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader2 className="animate-spin" size={48} color="#1A73E8" />
        </div>
      ) : (
        <>
          {opportunities.length > 0 ? (
            <Grid>
              {opportunities.map(opp => {
                const cleanSym = opp.symbol.replace('.IS', '').toUpperCase();
                const currentPrice = livePrices[cleanSym] || (opp.data as any)?.price || 0;
                const entryPrice = opp.entryPrice || 0;
                const profit = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2) : '0.00';
                const isPositive = parseFloat(profit) >= 0;

                return (
                  <OpportunityCard key={opp.id} onClick={() => navigate(`/dashboard/stock/${opp.symbol}`)}>
                    <ScoreBadge $score={opp.strengthScore}>SKOR: {opp.strengthScore}</ScoreBadge>
                    <Symbol>{cleanSym}</Symbol>
                    <SignalTags>
                      {opp.signalType.split(',').map((s: string) => (
                        <Tag key={s}>#{s}</Tag>
                      ))}
                    </SignalTags>

                    <Metric>
                      <span className="label">Analiz Fiyatı:</span>
                      <span className="value">₺{entryPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</span>
                    </Metric>
                    <Metric>
                      <span className="label">Güncel Fiyat:</span>
                      <span className="value" style={{ color: '#1A73E8' }}>
                        ₺{currentPrice > 0 ? currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '---'}
                      </span>
                    </Metric>
                    <Metric>
                      <span className="label">Potansiyel Getiri:</span>
                      <span className="value" style={{ color: isPositive ? '#0F9D58' : '#DB4437' }}>
                        {isPositive ? '+' : ''}{profit}%
                      </span>
                    </Metric>
                    <Metric>
                      <span className="label">Son Tarama:</span>
                      <span className="value" style={{ fontSize: '0.6875rem' }}>
                        {new Date(opp.updatedAt).toLocaleDateString('tr-TR')}
                      </span>
                    </Metric>

                    <div style={{ 
                      marginTop: 16, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end', 
                      color: '#1A73E8', 
                      fontSize: '0.75rem', 
                      fontWeight: 700 
                    }}>
                      DETAYLI ANALİZ <ChevronRight size={14} />
                    </div>
                  </OpportunityCard>
                );
              })}
            </Grid>
          ) : (
            <div style={{ 
              background: '#F8F9FA', 
              borderRadius: 20, 
              padding: 48, 
              textAlign: 'center',
              color: '#5F6368',
              border: '1px dashed #DADCE0'
            }}>
              <AlertCircle size={48} style={{ marginBottom: 16, opacity: 0.5 }} />
              <p>Bu periyot için henüz güçlü bir sinyal oluşmamış.</p>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default AIAnalysis;
