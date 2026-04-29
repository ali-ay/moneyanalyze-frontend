import styled, { keyframes } from 'styled-components';

export const PortfolioHeaderGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${props => props.theme.spacing.lg};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ChartContainer = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
`;

export const StatsColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

export const ProfitLossCard = styled.div<{ $isProfit: boolean }>`
  .profit-value {
    font-size: 2rem;
    font-weight: 800;
    color: ${props => props.$isProfit ? props.theme.colors.success : props.theme.colors.danger};
    margin-bottom: 8px;
  }

  .profit-percent {
    display: inline-block;
    font-size: 0.875rem;
    font-weight: 700;
    padding: 4px 12px;
    border-radius: 20px;
    background: ${props => props.$isProfit ? 'rgba(15, 157, 88, 0.15)' : 'rgba(219, 68, 55, 0.15)'};
    color: ${props => props.$isProfit ? props.theme.colors.success : props.theme.colors.danger};
  }
`;

export const PriceInfo = styled.div<{ $isProfit?: boolean }>`
  .profit { 
    display: block;
    font-weight: 700;
    color: ${props => props.$isProfit ? props.theme.colors.success : props.theme.colors.danger}; 
  }
`;

const priceFlash = keyframes`
  0% { background: rgba(26, 115, 232, 0.15); }
  100% { background: transparent; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

export const LivePrice = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  animation: ${priceFlash} 1s ease-out;
`;

export const LiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #0f9d58;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

export const SellButton = styled.button`
  background-color: ${props => props.theme.colors.danger};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
  font-weight: 600;
  &:hover { opacity: 0.8; }
`;

export const DesktopTableContainer = styled.div`
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

export const MobileListContainer = styled.div`
  display: none;
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const MobileAssetCard = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  border: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AssetName = styled.div`
  font-weight: 800;
  font-size: 1rem;
  color: ${props => props.theme.colors.textMain};
`;

export const AssetAmount = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
`;

export const CardLabel = styled.div`
  font-size: 0.75rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 2px;
`;

export const CardValue = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textMain};
`;

const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

export const NotificationToast = styled.div<{ $type: 'success' | 'error' }>`
  position: fixed;
  top: 80px;
  right: 24px;
  padding: 16px 24px;
  border-radius: 12px;
  background: ${props => props.$type === 'success' ? '#0f9d58' : '#db4437'};
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  z-index: 10001;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-left: 5px solid rgba(0,0,0,0.2);
`;