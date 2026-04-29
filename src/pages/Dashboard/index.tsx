import React from 'react';
import styled from 'styled-components';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';

// Feature Components
import { PortfolioSummary } from '../../features/dashboard/components/PortfolioSummary';
import { MarketTrendSection } from '../../features/dashboard/components/MarketTrendSection';
import { AssetsTableSection } from '../../features/dashboard/components/AssetsTableSection';
import { OpportunitiesSection } from '../../features/dashboard/components/OpportunitiesSection';
import { DashboardFooter } from '../../features/dashboard/components/DashboardFooter';

const DashboardGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SectionRow = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$reverse ? '1fr 380px' : '380px 1fr'};
  gap: 18px;
  margin-bottom: 24px;
  
  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardPage: React.FC = () => {
  const { marketData, lastUpdated, loading, error } = useDashboardData();

  return (
    <DashboardGrid>
      <SectionRow>
        <PortfolioSummary />
        <MarketTrendSection />
      </SectionRow>

      <AssetsTableSection data={marketData} loading={loading} error={error} />

      <div style={{ marginTop: '32px' }}>
        <OpportunitiesSection />
      </div>

      <DashboardFooter lastUpdated={lastUpdated} />
    </DashboardGrid>
  );
};

export default DashboardPage;