import styled from 'styled-components';

export const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const IconBox = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.theme?.colors?.primary || '#1A73E8'};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    svg { width: 18px; height: 18px; }
  }
`;

export const DisclaimerText = styled.span`
  display: block;
  color: ${props => props.theme?.colors?.danger || '#DB4437'};
  font-weight: 700;
  margin-top: 4px;
  font-size: 0.75rem;
`;

export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 64px;
`;

export const CurrentPriceValue = styled.span`
  color: ${props => props.theme?.colors?.primary || '#1A73E8'};
`;

export const ProfitValue = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#0F9D58' : '#DB4437'};
`;

export const LastScanDate = styled.span`
  font-size: 0.6875rem;
`;

export const DetailLink = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  font-size: 0.75rem;
  font-weight: 700;
`;

export const EmptyState = styled.div`
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  border-radius: 20px;
  padding: 48px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  border: 1px dashed ${props => props.theme?.colors?.border || '#DADCE0'};
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 16px;
  opacity: 0.5;
`;
