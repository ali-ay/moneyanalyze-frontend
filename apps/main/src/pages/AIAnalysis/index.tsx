import React, { useState } from 'react';
import styled from 'styled-components';
import { useAIAnalysisLogic } from './logic';
import { useNavigate } from 'react-router-dom';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors?: any;
  }
}
import {
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  AlertCircle,
  Star
} from 'lucide-react';
import { PageContainer, PageHeader, PageTitle, PageSubtitle } from '../../components/ui/Layout.styles';
import * as S from './AIAnalysis.styles';

const TabsContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin: 0 -16px 24px -16px;
  padding: 0 16px 8px 16px;

  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #E8F0FE;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 6px;
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

  @media (max-width: 768px) {
    padding: 8px 14px;
    font-size: 0.8125rem;
    border-radius: 10px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
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

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 16px;
    
    &:hover {
      transform: none;
    }
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

  @media (max-width: 768px) {
    padding: 4px 12px;
    font-size: 0.6875rem;
    border-bottom-left-radius: 12px;
  }
`;

const Symbol = styled.div`
  font-size: 1.25rem;
  font-weight: 800;
  color: #202124;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

const SignalTags = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    gap: 4px;
  }
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
    margin-bottom: 6px;
  }
`;

const DetailLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #1A73E8;
  margin-top: 16px;
  text-decoration: none;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #F1F3F4;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
  display: flex;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  background-color: #0F9D58;
  width: ${props => props.$percent}%;
  transition: width 0.3s ease;
`;

const ProgressTextRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.6875rem;
  font-weight: 700;
  color: #5F6368;
`;

const periods = [
  { id: 'weekly', label: 'Haftalık' },
  { id: 'monthly', label: 'Aylık' },
  { id: '3mo', label: '3 Aylık' },
  { id: '6mo', label: '6 Aylık' },
  { id: '1y', label: 'Yıllık' },
];

const CollapsibleGroup = ({ groupKey, data, activePeriod, defaultOpen }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: '32px' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: isOpen ? '12px' : '0',
          cursor: 'pointer',
          padding: '12px 16px',
          background: '#F8F9FA',
          borderRadius: '12px',
          border: '1px solid #DADCE0',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isOpen ? <ChevronUp size={20} color="#5F6368" /> : <ChevronDown size={20} color="#5F6368" />}
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#202124', margin: 0 }}>{groupKey}</h3>
        </div>
        <div style={{ 
          padding: '6px 12px', 
          borderRadius: '8px', 
          background: data.totalProfit > 0 ? '#E6F4EA' : data.totalProfit < 0 ? '#FCE8E6' : '#fff',
          color: data.totalProfit > 0 ? '#137333' : data.totalProfit < 0 ? '#C5221F' : '#5F6368',
          fontWeight: 700,
          fontSize: '0.875rem',
          border: data.totalProfit === 0 ? '1px solid #DADCE0' : 'none'
        }}>
          {activePeriod === 'weekly' ? 'Haftalık' : 'Dönemsel'} Toplam Kar/Zarar: {data.totalProfit > 0 ? '+' : ''}{data.totalProfit.toFixed(2)}%
        </div>
      </div>
      
      {isOpen && (
        <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '16px', border: '1px solid #DADCE0' }}>
          <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #DADCE0', background: '#F8F9FA', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>Tarih</th>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>Sembol</th>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>İşlem</th>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>Fiyat</th>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>Durum/Kar</th>
                <th style={{ padding: '12px 16px', color: '#5F6368' }}>Açıklama</th>
              </tr>
            </thead>
            <tbody>
              {data.logs.map((log: any) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #F1F3F4' }}>
                  <td style={{ padding: '12px 16px' }}>{new Date(log.createdAt).toLocaleString('tr-TR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{log.symbol.replace('.IS', '')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ 
                      padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700,
                      background: log.action === 'ADD' ? '#E6F4EA' : '#FCE8E6',
                      color: log.action === 'ADD' ? '#137333' : '#C5221F'
                    }}>
                      {log.action === 'ADD' ? 'LİSTEYE ALINDI' : 'LİSTEDEN ÇIKARILDI'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>₺{log.price?.toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: (log.profit || log.liveProfit) > 0 ? '#137333' : (log.profit || log.liveProfit) < 0 ? '#C5221F' : '#5F6368' }}>
                    {(log.profit || log.liveProfit) ? `${(log.profit || log.liveProfit) > 0 ? '+' : ''}${(log.profit || log.liveProfit).toFixed(2)}%` : '---'}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#5F6368', fontSize: '0.8125rem' }}>{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const AIAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { 
    opportunities,
    historyLogs,
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
              {[...opportunities].sort((a, b) => {
                const getIndexWeight = (indices: string | null) => {
                  if (!indices) return 0;
                  if (indices.includes('BIST30')) return 4;
                  if (indices.includes('BIST50')) return 3;
                  if (indices.includes('BIST100')) return 2;
                  return 1;
                };
                const weightA = getIndexWeight(a.indices);
                const weightB = getIndexWeight(b.indices);
                if (weightA !== weightB) return weightB - weightA;
                return b.strengthScore - a.strengthScore;
              }).map(opp => {
                const cleanSym = opp.symbol.replace('.IS', '').toUpperCase();
                const currentPrice = livePrices[cleanSym] || (opp.data as any)?.price || 0;
                const entryPrice = opp.entryPrice || 0;
                const profit = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2) : '0.00';
                const isPositive = parseFloat(profit) >= 0;
                
                const targetPrice = opp.data?.aiPredictions?.targetPrice || 0;
                let progressPercent = 0;
                
                if (entryPrice > 0 && targetPrice > entryPrice) {
                  const totalExpectedProfit = targetPrice - entryPrice;
                  const currentProfit = currentPrice - entryPrice;
                  progressPercent = Math.max(0, Math.min(100, (currentProfit / totalExpectedProfit) * 100));
                }
                const remainingPercent = 100 - progressPercent;

                let starColor = null;
                if (opp.indices?.includes('BIST30')) starColor = '#FFD700'; // Gold
                else if (opp.indices?.includes('BIST50')) starColor = '#C0C0C0'; // Silver
                else if (opp.indices?.includes('BIST100')) starColor = '#CD7F32'; // Bronze

                return (
                  <OpportunityCard key={opp.id} onClick={() => navigate(`/dashboard/stock/${opp.symbol}`)}>
                    <ScoreBadge $score={opp.strengthScore}>SKOR: {opp.strengthScore}</ScoreBadge>
                    <Symbol>
                      {cleanSym}
                      {starColor && <Star size={18} fill={starColor} color={starColor} />}
                    </Symbol>
                    <SignalTags>
                      {opp.signalType.split(',').map((s: string) => (
                        <Tag key={s}>#{s}</Tag>
                      ))}
                    </SignalTags>

                    <Metric>
                      <span className="label">Eklendiği Tarih:</span>
                      <span className="value">{new Date(opp.createdAt).toLocaleDateString('tr-TR')}</span>
                    </Metric>
                    <Metric>
                      <span className="label">Son Tarama:</span>
                      <S.LastScanDate className="value">
                        {new Date(opp.updatedAt).toLocaleDateString('tr-TR')}
                      </S.LastScanDate>
                    </Metric>
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
                      <span className="label">AI Hedef (Tahmin):</span>
                      <span className="value" style={{ color: '#0F9D58', fontWeight: 800 }}>
                        ₺{targetPrice > 0 ? targetPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) : '---'}
                      </span>
                    </Metric>
                    <Metric>
                      <span className="label">Potansiyel Getiri:</span>
                      <S.ProfitValue className="value" $positive={isPositive}>
                        {isPositive ? '+' : ''}{profit}%
                      </S.ProfitValue>
                    </Metric>

                    {targetPrice > 0 && (
                      <div style={{ marginTop: '16px', padding: '12px', background: '#F8F9FA', borderRadius: '12px' }}>
                        <ProgressTextRow>
                          <span style={{ color: '#0F9D58' }}>İlerleme: %{progressPercent.toFixed(0)}</span>
                          <span>Hedefe Kalan: %{remainingPercent.toFixed(0)}</span>
                        </ProgressTextRow>
                        <ProgressBarContainer>
                          <ProgressFill $percent={progressPercent} />
                        </ProgressBarContainer>
                      </div>
                    )}

                    <DetailLink>
                      DETAYLI ANALİZ <ChevronRight size={14} />
                    </DetailLink>
                  </OpportunityCard>
                );
              })}
            </Grid>
          ) : (
            <S.EmptyState>
              <S.EmptyStateIcon as="div">
                <AlertCircle size={48} />
              </S.EmptyStateIcon>
              <p>Bu periyot için henüz aktif güçlü bir sinyal oluşmamış.</p>
            </S.EmptyState>
          )}

          {historyLogs.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <PageSubtitle style={{ marginBottom: '16px', color: '#202124', fontWeight: 700, fontSize: '1.1rem' }}>
                Geçmiş AI Kararları ({activePeriod.toUpperCase()})
              </PageSubtitle>
              {(() => {
                const getGroupKey = (d: Date, period: string) => {
                  if (period !== 'weekly' && period !== '1d' && period !== '5d') {
                    return `${d.getFullYear()} - ${d.toLocaleString('tr-TR', { month: 'long' })}`;
                  } else {
                    let copyD = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
                    copyD.setUTCDate(copyD.getUTCDate() + 4 - (copyD.getUTCDay()||7));
                    const yearStart = new Date(Date.UTC(copyD.getUTCFullYear(),0,1));
                    const weekNo = Math.ceil(( ( (copyD.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
                    return `${copyD.getUTCFullYear()} - ${weekNo}. Hafta`;
                  }
                };
                
                const grouped = historyLogs.reduce((acc: any, log: any) => {
                  const d = new Date(log.createdAt);
                  const key = getGroupKey(d, activePeriod);
                  if (!acc[key]) acc[key] = { logs: [], totalProfit: 0 };
                  acc[key].logs.push(log);
                  const p = log.profit || log.liveProfit;
                  if (p) acc[key].totalProfit += p;
                  return acc;
                }, {});

                return Object.entries(grouped).sort((a: any, b: any) => {
                  // Custom sort to handle year - week logic properly instead of simple string compare
                  return b[0].localeCompare(a[0], undefined, { numeric: true, sensitivity: 'base' });
                }).map(([groupKey, data]: any, index: number) => (
                  <CollapsibleGroup 
                    key={groupKey} 
                    groupKey={groupKey} 
                    data={data} 
                    activePeriod={activePeriod} 
                    defaultOpen={index === 0} 
                  />
                ));
              })()}
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default AIAnalysis;
