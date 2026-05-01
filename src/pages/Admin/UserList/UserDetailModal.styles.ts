import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

export const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 40px;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.md};
`;

export const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.colors.danger};
    border-color: ${props => props.theme.colors.danger};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

export const CardTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
`;

export const Badge = styled.span<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${props => props.$active ? 'rgba(15, 157, 88, 0.1)' : 'rgba(95, 99, 104, 0.1)'};
  color: ${props => props.$active ? '#0F9D58' : '#5F6368'};
`;

export const LoadingContainer = styled.div`
  padding: 80px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 600;
`;

export const HeaderSection = styled.div`
  border-bottom: 1px solid #DADCE0;
  padding-bottom: 24px;
`;

export const HeaderTitle = styled.h2`
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0;
`;

export const HeaderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.875rem;
`;

export const AddressInfo = styled.div`
  margin-top: 12px;
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const BalanceDisplay = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const BalanceUnit = styled.small`
  font-size: 1rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-weight: 600;
`;

export const SymbolCell = styled.span`
  font-weight: 600;
`;

export const AmountCell = styled.span`
  font-weight: 700;
  color: ${props => props.theme?.colors?.primary || '#1a73e8'};
`;

export const EmptyMessage = styled.div`
  color: #9AA0A6;
  font-size: 0.8125rem;
  text-align: center;
  padding: 10px;
`;

export const StrategyCell = styled.span`
  font-weight: 600;
`;

export const TransactionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TransactionType = styled.span<{ $isBuy: boolean }>`
  color: ${props => props.$isBuy ? '#0F9D58' : '#DB4437'};
  font-weight: 700;
`;

export const TransactionDate = styled.small`
  color: #9AA0A6;
  font-size: 0.6875rem;
  margin-top: 2px;
`;

export const TransactionAmount = styled.span`
  font-weight: 700;
`;
