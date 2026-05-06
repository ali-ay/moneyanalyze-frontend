import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Zap, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import api from '../../../services/apiClient';

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
  font-size: 0.625rem;
  font-weight: 800;
  border-bottom-left-radius: 12px;
`;

const SymbolName = styled.div`
  font-size: 1.125rem;
  font-weight: 800;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin-bottom: 4px;
`;

const SignalType = styled.div`
  font-size: 0.6875rem;
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
  font-size: 0.75rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

const MetricValue = styled.span`
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const OpportunitiesSection: React.FC = () => {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [livePrices, setLivePrices] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLivePrices = async (symbols: string[]) => {
    if (symbols.length === 0) return;
    try {
      const cleanSymbols = symbols.map(s => s.replace('.IS', '').toUpperCase());
      const res = await api.get(`/stock/bulk-info?symbols=${cleanSymbols.join(',')}`);
      if (res.data.quotes) {
        const prices: { [key: string]: number } = {};
        res.data.quotes.forEach((q: any) => {
          prices[q.symbol] = q.price;
        });
        setLivePrices(prev => ({ ...prev, ...prices }));
      }
    } catch (err) {
      console.error("Fırsat fiyatları çekilemedi:", err);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    
    const fetchOpportunities = async () => {
      try {
        const response = await api.get('/stock/opportunities', { signal: controller.signal });
        if (!cancelled) {
          setOpportunities(response.data);
          const symbols = response.data.map((o: any) => o.symbol);
          fetchLivePrices(symbols);
        }
      } catch (error: any) {
        if (error?.name === 'CanceledError' || error?.code === 'ERR_CANCELED') return;
        console.error('Error fetching opportunities:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOpportunities();

    const interval = setInterval(() => {
      if (opportunities.length > 0) {
        const symbols = opportunities.map((o: any) => o.symbol);
        fetchLivePrices(symbols);
      }
    }, 30000); // 30 saniyede bir güncelle

    return () => {
      cancelled = true;
      controller.abort();
      clearInterval(interval);
    };
  }, [opportunities.length]);

  if (loading) {
    return (
      <Card style={{ marginBottom: 24 }}>
        <Card.Header>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="#F4B400" fill="#F4B400" />
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Algoritmik Fırsatlar (AI Tarama)</h3>
          </div>
        </Card.Header>
        <Card.Body style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 className="animate-spin" size={32} color="#1A73E8" />
        </Card.Body>
      </Card>
    );
  }

  if (opportunities.length === 0) return null;

  // Sadece en yüksek skorlu 5 hisseyi alalım
  const top5 = opportunities.slice(0, 5);

  return (
    <Card style={{ marginBottom: 24, border: '1px solid #1A73E8', boxShadow: '0 4px 20px rgba(26, 115, 232, 0.1)' }}>
      <Card.Header style={{ background: 'linear-gradient(90deg, rgba(26, 115, 232, 0.1) 0%, transparent 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Zap size={22} color="#1A73E8" fill="#1A73E8" />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#1A73E8', letterSpacing: '0.5px' }}>
            ALGORİTMİK LİSTE PERFORMANSLARI 🚀
          </h3>
        </div>
        <div style={{ fontSize: '0.8rem', color: '#5F6368', fontWeight: 600 }}>Yapay Zeka Tarafından En Çok Güvenilen (Top 5) Hisseler</div>
      </Card.Header>
      <Card.Body $noPadding style={{ padding: '0 24px 24px' }}>
        <OpportunitiesGrid>
          {top5.map((opp) => {
            const cleanSym = opp.symbol.replace('.IS', '').toUpperCase();
            const currentPrice = livePrices[cleanSym] || (opp.data as any)?.price || 0;
            const entryPrice = opp.entryPrice || 0;
            const aiData = (opp.data as any)?.aiPredictions || {};
            const targetPrice = aiData.targetPrice || 0;
            const potentialProfit = aiData.potentialProfit || 0;

            return (
              <OpportunityCard key={opp.id} onClick={() => navigate(`/dashboard/stock/${opp.symbol}`)}>
                <Badge $score={opp.strengthScore}>
                  GÜVEN: %{opp.strengthScore}
                </Badge>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <SymbolName style={{ margin: 0 }}>{cleanSym}</SymbolName>
                  {opp.strengthScore >= 85 && <Zap size={14} color="#F4B400" fill="#F4B400" />}
                </div>

                <SignalType>
                  {opp.signalType.split(':').slice(0, 1).map((s: string) => (
                    <span key={s} style={{ background: '#1A73E815', padding: '2px 6px', borderRadius: 4 }}>
                      {s.replace('_', ' ')}
                    </span>
                  ))}
                </SignalType>

                <div style={{ background: 'rgba(15, 157, 88, 0.05)', padding: '10px', borderRadius: '12px', marginBottom: 12, border: '1px solid rgba(15, 157, 88, 0.1)' }}>
                  <div style={{ fontSize: '0.65rem', color: '#5F6368', marginBottom: 2 }}>POTANSİYEL GETİRİ</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0F9D58' }}>
                    %{potentialProfit.toFixed(2)} 🚀
                  </div>
                </div>

                <MetricRow>
                  <span>Mevcut Fiyat:</span>
                  <MetricValue>₺{currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</MetricValue>
                </MetricRow>
                
                <MetricRow>
                  <span>AI Hedefi:</span>
                  <MetricValue style={{ color: '#1A73E8' }}>
                    ₺{targetPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                  </MetricValue>
                </MetricRow>

                <MetricRow>
                  <span>Geçmiş Win Rate:</span>
                  <MetricValue style={{ color: (opp.winRate || 0) > 70 ? '#0F9D58' : '#1A73E8' }}>
                    %{opp.winRate || '0'}
                  </MetricValue>
                </MetricRow>

                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.6rem', color: '#9AA0A6' }}>{opp.period === 'weekly' ? 'HAFTALIK' : 'AYLIK'} ANALİZ</span>
                  <div style={{ color: '#1A73E8', fontSize: '0.6875rem', fontWeight: 800 }}>
                    ANALİZİ GÖR <ChevronRight size={14} />
                  </div>
                </div>
              </OpportunityCard>
            );
          })}
        </OpportunitiesGrid>
      </Card.Body>
    </Card>
  );
};
