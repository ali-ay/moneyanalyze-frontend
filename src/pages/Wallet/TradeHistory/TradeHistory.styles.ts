import styled from 'styled-components';

export const PerformanceCard = styled.div`
  grid-column: span 2;
`;

export const PerformanceValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ProfitDisplay = styled.div<{ $isProfit: boolean }>`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.$isProfit ? '#0F9D58' : '#DB4437'};
  display: flex;
  align-items: baseline;
  gap: 10px;
`;

export const ProfitPercentage = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  opacity: 0.8;
`;

export const PerformanceNote = styled.div`
  color: #5F6368;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const SymbolCell = styled.td`
  font-weight: bold;
`;

export const OriginBadge = styled.span`
  font-size: 0.625rem;
`;

export const TotalCell = styled.td<{ $isBuy: boolean }>`
  color: ${props => props.$isBuy ? '#ef4444' : '#10b981'};
  font-weight: bold;
`;
