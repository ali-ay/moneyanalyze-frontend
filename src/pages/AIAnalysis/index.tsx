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
import * as S from './AIAnalysis.styles';

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
        <S.HeaderContainer>
          <S.IconBox>
            <Zap size={24} fill="white" />
          </S.IconBox>
          <div>
            <PageTitle>Yapay Zeka Teknik Analiz</PageTitle>
            <PageSubtitle>
              Algoritmik modeller ve indikatörler ışığında hazırlanan teknik görünüm özetleri.
              <S.DisclaimerText>
                * Yatırım tavsiyesi değildir.
              </S.DisclaimerText>
            </PageSubtitle>
          </div>
        </S.HeaderContainer>
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
        <S.LoadingContainer>
          <Loader2 className="animate-spin" size={48} color="#1A73E8" />
        </S.LoadingContainer>
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
                      <S.CurrentPriceValue className="value">
                        ₺{currentPrice > 0 ? currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '---'}
                      </S.CurrentPriceValue>
                    </Metric>
                    <Metric>
                      <span className="label">Potansiyel Getiri:</span>
                      <S.ProfitValue className="value" $positive={isPositive}>
                        {isPositive ? '+' : ''}{profit}%
                      </S.ProfitValue>
                    </Metric>
                    <Metric>
                      <span className="label">Son Tarama:</span>
                      <S.LastScanDate className="value">
                        {new Date(opp.updatedAt).toLocaleDateString('tr-TR')}
                      </S.LastScanDate>
                    </Metric>

                    <S.DetailLink>
                      DETAYLI ANALİZ <ChevronRight size={14} />
                    </S.DetailLink>
                  </OpportunityCard>
                );
              })}
            </Grid>
          ) : (
            <S.EmptyState>
              <S.EmptyStateIcon as="div">
                <AlertCircle size={48} />
              </S.EmptyStateIcon>
              <p>Bu periyot için henüz güçlü bir sinyal oluşmamış.</p>
            </S.EmptyState>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default AIAnalysis;
