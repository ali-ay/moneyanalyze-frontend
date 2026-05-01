import styled from 'styled-components';

export const TableWrapper = styled.div`
  padding: 0 4px;
`;

export const DateColumn = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  color: #202124;
  font-weight: 600;
`;

export const TimeText = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin-left: 20px;
`;

export const SymbolText = styled.span`
  font-weight: 900;
  color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  font-size: 1.05rem;
`;

export const PeriodBadge = styled.div`
  font-size: 0.65rem;
  background: #F8F9FA;
  padding: 2px 6px;
  border-radius: 4px;
  display: inline-block;
  width: fit-content;
  border: 1px solid #E8EAED;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const PriceWithColor = styled.div<{ $entryPrice?: boolean }>`
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  color: ${props => props.$entryPrice ? (props.theme?.colors?.primary || '#1A73E8') : (props.theme?.colors?.textMain || '#202124')};
`;

export const ProfitBadgeWithSize = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#0F9D58' : '#DB4437'};
  background: ${props => props.$positive ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 1rem;
`;

export const CalculatingText = styled.span`
  color: #9AA0A6;
  font-size: 0.8125rem;
`;

export const NotesContainer = styled.div`
  max-width: 280px;
`;

export const NotesIcon = styled.div`
  margin-top: 2px;
  flex-shrink: 0;
`;

export const NotesText = styled.span`
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.8125rem;
  line-height: 1.4;
`;
