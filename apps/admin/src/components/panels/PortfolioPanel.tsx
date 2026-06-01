import React from 'react';
import styled from 'styled-components';
import { MetricCard } from '../metrics/MetricCard';
import { Grid } from '../primitives/Grid';
import { Briefcase, TrendingUp, TrendingDown } from 'lucide-react';

const PanelContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

export interface PortfolioPanelProps {
  stats: {
    totalValue: number;
    totalCost: number;
    profitLoss: number;
    profitPercent: number;
  } | null;
  currency?: '$' | '₺';
  loading?: boolean;
}

export const PortfolioPanel: React.FC<PortfolioPanelProps> = ({
  stats,
  currency = '$',
  loading,
}) => {
  if (loading || !stats) {
    return (
      <PanelContainer>
        <Grid $columns={3} $gap="lg">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                height: '140px',
                background: '#f0f0f0',
                borderRadius: '24px',
                animation: 'pulse 2s infinite',
              }}
            />
          ))}
        </Grid>
      </PanelContainer>
    );
  }

  const profitVariant = stats.profitLoss >= 0 ? 'success' : 'danger';
  const profitIcon = stats.profitLoss >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />;

  return (
    <PanelContainer>
      <Grid $columns={3} $gap="lg" className="portfolio-grid">
        <MetricCard
          title="Toplam Değer"
          value={stats.totalValue}
          currency={currency}
          variant="primary"
          icon={<Briefcase size={20} />}
        />
        <MetricCard
          title="Kâr/Zarar"
          value={Math.abs(stats.profitLoss)}
          currency={currency}
          variant={profitVariant}
          icon={profitIcon}
          subtext={`${stats.profitPercent > 0 ? '+' : ''}${stats.profitPercent.toFixed(2)}%`}
        />
        <MetricCard
          title="Yatırım Tutarı"
          value={stats.totalCost}
          currency={currency}
          variant="primary"
        />
      </Grid>

      <style>{`
        @media (max-width: 992px) {
          .portfolio-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 16px !important;
          }
        }
        @media (max-width: 600px) {
          .portfolio-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
        }
      `}</style>
    </PanelContainer>
  );
};
