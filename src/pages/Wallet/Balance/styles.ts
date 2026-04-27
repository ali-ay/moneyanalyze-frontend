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
    font-size: 14px; 
    color: rgba(255, 255, 255, 0.8); 
    text-transform: uppercase; 
    letter-spacing: 1px; 
    font-weight: 500;
  }
  div { 
    font-size: 40px; 
    font-weight: 800; 
    color: #ffffff; 
    letter-spacing: -1px;
    margin-top: 4px;

    @media (max-width: ${props => props.theme.breakpoints.mobile}) {
      font-size: 32px;
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
  font-size: 15px;

  &:hover { 
    transform: translateY(-2px); 
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); 
    background: #f8f9fa; 
  }
`;

export const HistorySection = styled.div`
  h3 { 
    margin-bottom: 20px; 
    color: ${props => props.theme.colors.textMain}; 
    font-size: 18px;
  }
`;