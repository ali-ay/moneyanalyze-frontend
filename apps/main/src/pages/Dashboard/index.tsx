import React from 'react';
import * as S from './Dashboard.styles';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';

// Feature Components
import { PortfolioSummary } from '../../features/dashboard/components/PortfolioSummary';
import { MarketTrendSection } from '../../features/dashboard/components/MarketTrendSection';
import { AssetsTableSection } from '../../features/dashboard/components/AssetsTableSection';
import { OpportunitiesSection } from '../../features/dashboard/components/OpportunitiesSection';
import { DashboardFooter } from '../../features/dashboard/components/DashboardFooter';

const DashboardPage: React.FC = () => {
  const { marketData, lastUpdated, loading, error } = useDashboardData();

  return (
    <S.DashboardGrid>
      <S.SectionRow>
        <PortfolioSummary />
        <MarketTrendSection />
      </S.SectionRow>

      <AssetsTableSection data={marketData} loading={loading} error={error} />

      <S.OpportunitiesWrapper>
        <OpportunitiesSection />
      </S.OpportunitiesWrapper>

      <DashboardFooter lastUpdated={lastUpdated} />
    </S.DashboardGrid>
  );
};

export default DashboardPage;