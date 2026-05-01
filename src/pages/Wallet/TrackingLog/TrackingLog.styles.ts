import styled from 'styled-components';

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const SortableHeader = styled.th`
  cursor: pointer;
`;

export const ClickableRow = styled.tr`
  cursor: pointer;
`;

export const DateCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const AISignalBadge = styled.span`
  background: #e8f0fe;
  color: #1a73e8;
  border: 1px solid #1a73e8;
`;

export const SymbolCell = styled.td`
  font-weight: bold;
  color: #1a73e8;
`;

export const LoadingText = styled.span`
  color: #9aa0a6;
`;

export const ChangeContainer = styled.div<{ $isPositive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.$isPositive ? '#0F9D58' : '#DB4437'};
  font-weight: bold;
`;
