import styled from 'styled-components';

export const RightAlignTh = styled.th`
  text-align: right;
`;

export const RightAlignTd = styled.td`
  text-align: right;
`;

export const SymbolCell = styled.td`
  font-weight: 700;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  .symbol {
    font-size: 0.9375rem;
    color: ${props => props.theme.colors.textMain};
    display: block;
    margin-bottom: 2px;
  }
`;

export const SymbolName = styled.span`
  font-size: 0.65rem;
  font-weight: 400;
  color: ${props => props.theme.colors.textSecondary}80; /* %50 şeffaflık ile çok belirsiz */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;
  display: block;
`;

export const PeriodBadge = styled.span`
  font-size: 0.6875rem;
  font-weight: 700;
  background: #F1F3F4;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
`;

export const ChangeValueWithSize = styled.span<{ $isPositive: boolean }>`
  color: ${props => props.$isPositive ? '#0F9D58' : '#DB4437'};
  font-weight: 600;
  font-size: 0.875rem;
`;

export const ProfitChangeValue = styled.span<{ $isPositive: boolean }>`
  color: ${props => props.$isPositive ? '#0F9D58' : '#DB4437'};
  font-weight: 600;
`;
