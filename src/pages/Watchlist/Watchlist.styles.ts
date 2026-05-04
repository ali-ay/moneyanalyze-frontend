import styled from 'styled-components';

export const RightAlignTh = styled.th`
  text-align: right;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 8px 12px;
  }
`;

export const RightAlignTd = styled.td`
  text-align: right;
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 10px 12px;
  }
`;

export const SymbolCell = styled.td`
  font-weight: 700;
  padding: 12px 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 8px 12px;
  }

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

export const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 0 4px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 8px;
  }
`;

export const FilterLabel = styled.span`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textMain};
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  min-width: 140px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }
`;

export const SummaryWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const SummaryCard = styled.div`
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SummaryLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

interface SummaryValueProps {
  color?: 'green' | 'red' | 'gray';
}

export const SummaryValue = styled.span<SummaryValueProps>`
  font-size: 24px;
  font-weight: 600;
  color: ${props => {
    switch (props.color) {
      case 'green':
        return props.theme.colors.success;
      case 'red':
        return props.theme.colors.danger;
      default:
        return props.theme.colors.text;
    }
  }};
`;

export const SearchInput = styled.input`
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.textMain};
  font-size: 0.8125rem;
  outline: none;
  min-width: 160px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;
