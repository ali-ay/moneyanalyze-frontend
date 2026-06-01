import styled, { keyframes } from 'styled-components';

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
