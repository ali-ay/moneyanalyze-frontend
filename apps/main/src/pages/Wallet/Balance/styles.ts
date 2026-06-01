// components/Wallet/WalletBalance.styles.ts
import styled from 'styled-components';

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.colors.textMain};
  padding: 32px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(26, 115, 232, 0.2);
  margin-bottom: ${props => props.theme.spacing.xl};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: 12px;
  }
`;

export const BalanceInfo = styled.div`
  h3 { 
    margin: 0; 
    font-size: 0.875rem; 
    color: rgba(255, 255, 255, 0.8); 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    font-weight: 500;
  }
  div { 
    font-size: 2.5rem; 
    font-weight: 800; 
    color: #ffffff; 
    letter-spacing: -1px;
    margin-top: 4px;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 2rem;
    }
  }
  }
`;

export const AddButton = styled.button`
  background: #ffffff; 
  color: ${props => props.theme.colors.primary}; 
  border: none; 
  padding: 12px 24px;
  border-radius: 12px; 
  font-weight: 700; 
  cursor: pointer; 
  display: flex;
  align-items: center; 
  gap: 8px; 
  transition: all 0.3s ease;
  font-size: 0.9375rem;

  &:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); 
    background: #f8f9fa; 
  }
`;

export const HistorySection = styled.div<{ $marginBottom?: string }>`
  h3 {
    margin-bottom: 20px;
    color: ${props => props.theme.colors.textMain};
    font-size: 1.125rem;
  }
  margin-bottom: ${props => props.$marginBottom || '0'};
`;

export const LoadingContainer = styled.div`
  padding: 40px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const ErrorAlert = styled.div`
  background: #fce8e6;
  color: #d93025;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #f5c2c7;
  font-size: 0.875rem;
  font-weight: 500;
`;

export const LiveBadgeContainer = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  vertical-align: middle;
  margin-left: 15px;
`;

export const StatusIndicator = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: ${props => props.$isActive ? '#0f9d58' : '#db4437'};
`;

export const StatusDot = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.$isActive ? '#0f9d58' : '#db4437'};
`;

export const BalanceValue = styled.div<{ $isRealData: boolean }>`
  font-size: 2.5rem;
  font-weight: 800;
  color: ${props => props.$isRealData ? '#1a73e8' : '#9AA0A6'};
`;

export const BalanceUnit = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  margin-left: 8px;
  color: #5F6368;
`;

export const BalanceEquivalent = styled.div`
  margin-top: 8px;
  font-size: 1.1rem;
  color: #5F6368;
`;

export const EquivalentUnit = styled.span`
  font-weight: 600;
`;

export const ExchangeRate = styled.span`
  font-size: 0.9rem;
  margin-left: 12px;
  color: #9AA0A6;
`;

export const AssetsHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const TransactionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

export const SymbolCell = styled.td`
  font-weight: bold;
`;

export const PriceCell = styled.td`
  color: #1a73e8;
  font-weight: 600;
`;

export const ValueCell = styled.td`
  font-weight: bold;
`;

export const FreeCell = styled.td`
  color: #0f9d58;
`;

export const LockedCell = styled.td`
  color: #f4b400;
`;

export const AmountCell = styled.td`
  font-weight: bold;
`;

export const DescriptionCell = styled.td`
  color: #5F6368;
`;

export const EmptyCell = styled.td`
  text-align: center;
  padding: 40px;
  color: #9AA0A6;
`;