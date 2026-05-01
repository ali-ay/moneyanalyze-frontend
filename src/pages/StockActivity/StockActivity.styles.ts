import styled from 'styled-components';

export const TableWrapper = styled.div`
  padding: 0 4px;
  overflow-x: auto;
  margin: 0 -16px;
  padding: 0 16px;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #E8EAED;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    margin: 0 -12px;
    padding: 0px;
  }
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

  .short-text { display: none; }

  @media (max-width: 768px) {
    .full-text { display: none; }
    .short-text { display: inline; }
  }
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
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(26, 115, 232, 0.2) !important;
    transform: scale(1.1);
  }
`;

export const NotesText = styled.span`
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.8125rem;
  line-height: 1.4;

  .short-text { display: none; }

  @media (max-width: 768px) {
    .full-text { display: none; }
    .short-text { display: inline; }
  }
`;

export const LoadMoreContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 0;
`;

export const LoadMoreButton = styled.button`
  background: white;
  border: 1px solid #E8EAED;
  color: #1A73E8;
  padding: 12px 32px;
  border-radius: 24px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(60,64,67,0.1);

  &:hover {
    background: #F8F9FA;
    border-color: #1A73E8;
    box-shadow: 0 2px 6px rgba(26,115,232,0.15);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CleanupButton = styled.button`
  background: transparent;
  border: 1px solid #DADCE0;
  color: #5F6368;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  white-space: nowrap;

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }

  &:hover {
    background: #FEECEB;
    color: #D93025;
    border-color: #D93025;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SearchContainer = styled.div`
  position: relative;
  width: 280px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input`
  width: 100%;
  background: #F1F3F4;
  border: 1px solid transparent;
  padding: 10px 16px 10px 40px;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #202124;
  transition: all 0.2s;

  &:focus {
    background: white;
    border-color: #1A73E8;
    box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
    outline: none;
  }

  &::placeholder {
    color: #5F6368;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #5F6368;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

export const StatsBadge = styled.div`
  background: #E8F0FE;
  color: #1967D2;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
`;
