import styled from 'styled-components';

export const MainGrid = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

export const TopRow = styled.div`
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px;
  margin-bottom: 24px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;

export const BottomRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  @media (max-width: 1100px) { grid-template-columns: 1fr; }
`;