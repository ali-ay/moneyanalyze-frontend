import styled from 'styled-components';

export const DashboardGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const SectionRow = styled.div<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: ${props => props.$reverse ? '1fr 380px' : '380px 1fr'};
  gap: 18px;
  margin-bottom: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`;

export const OpportunitiesWrapper = styled.div`
  margin-top: 32px;
`;
