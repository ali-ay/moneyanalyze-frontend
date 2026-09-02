import styled, { keyframes, css } from 'styled-components';

const pulse = (color: string) => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${color}40;
  }
  70% {
    box-shadow: 0 0 0 10px ${color}00;
  }
  100% {
    box-shadow: 0 0 0 0 ${color}00;
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RefreshButton = styled.button<{ $isRefreshing?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }

  svg {
    transition: transform 0.2s ease;
    ${props => props.$isRefreshing && css`
      animation: ${rotate} 1s linear infinite;
    `}
  }
`;

export const AutoRefreshIndicator = styled.span`
  font-size: 0.75rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 8px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const ServiceCard = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border-radius: 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

export const ServiceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding-bottom: 16px;
`;

export const ServiceInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ServiceIconWrapper = styled.div<{ $isOnline: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isOnline ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
  color: ${props => props.$isOnline ? (props.theme?.colors?.success || '#0F9D58') : (props.theme?.colors?.danger || '#DB4437')};
`;

export const ServiceName = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  h4 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }

  span {
    font-size: 0.8125rem;
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  }
`;

export const StatusBadge = styled.div<{ $isOnline: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  background: ${props => props.$isOnline ? 'rgba(15, 157, 88, 0.08)' : 'rgba(219, 68, 55, 0.08)'};
  color: ${props => props.$isOnline ? (props.theme?.colors?.success || '#0F9D58') : (props.theme?.colors?.danger || '#DB4437')};
  border: 1px solid ${props => props.$isOnline ? 'rgba(15, 157, 88, 0.2)' : 'rgba(219, 68, 55, 0.2)'};
`;

export const StatusDot = styled.div<{ $isOnline: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$isOnline ? (props.theme?.colors?.success || '#0F9D58') : (props.theme?.colors?.danger || '#DB4437')};
  animation: ${props => props.$isOnline ? pulse(props.theme?.colors?.success || '#0F9D58') : 'none'} 2s infinite;
`;

export const ServiceDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
  padding: 4px 0;

  .label {
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .value {
    color: ${props => props.theme?.colors?.textMain || '#202124'};
    font-weight: 600;
    text-align: right;
  }
`;

export const LatencyText = styled.span<{ $latency: number }>`
  color: ${props => {
    if (props.$latency < 50) return props.theme?.colors?.success || '#0F9D58';
    if (props.$latency < 150) return props.theme?.colors?.warning || '#F4B400';
    return props.theme?.colors?.danger || '#DB4437';
  }} !important;
`;

export const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: ${props => props.theme?.colors?.border || '#DADCE0'}40;
  border-radius: 99px;
  overflow: hidden;
`;

export const ProgressFill = styled.div<{ $percent: number; $variant?: 'primary' | 'success' | 'warning' | 'danger' }>`
  width: ${props => props.$percent}%;
  height: 100%;
  border-radius: 99px;
  background: ${props => {
    if (props.$variant) {
      if (props.$variant === 'success') return props.theme?.colors?.success || '#0F9D58';
      if (props.$variant === 'warning') return props.theme?.colors?.warning || '#F4B400';
      if (props.$variant === 'danger') return props.theme?.colors?.danger || '#DB4437';
    }
    // Default dynamic colors
    if (props.$percent < 60) return props.theme?.colors?.primary || '#1A73E8';
    if (props.$percent < 85) return props.theme?.colors?.warning || '#F4B400';
    return props.theme?.colors?.danger || '#DB4437';
  }};
  transition: width 0.5s ease-out;
`;

export const ServerMetricsCard = styled(ServiceCard)`
  grid-column: span 2;

  @media (max-width: 992px) {
    grid-column: span 1;
  }
`;

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const MetricItem = styled.div`
  background: ${props => props.theme?.colors?.background || '#F8F9FA'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'}80;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const UrlEditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
`;

export const UrlInput = styled.input`
  font-family: monospace;
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1.5px solid ${props => props.theme?.colors?.primary || '#1A73E8'};
  background: ${props => props.theme?.colors?.background || '#F8F9FA'};
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  width: 220px;
  outline: none;
  transition: box-shadow 0.2s ease;

  &:focus {
    box-shadow: 0 0 0 3px ${props => props.theme?.colors?.primary || '#1A73E8'}25;
  }
`;

export const UrlEditActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SaveUrlButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${props => props.theme?.colors?.primary || '#1A73E8'};
  color: #fff;
  border: none;
  padding: 5px 12px;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease, opacity 0.2s ease;

  &:hover { opacity: 0.88; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const CancelUrlButton = styled.button`
  display: flex;
  align-items: center;
  background: transparent;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    background: ${props => props.theme?.colors?.background || '#F8F9FA'};
  }
`;

export const EditUrlTrigger = styled.button`
  background: none;
  border: none;
  padding: 2px 4px;
  border-radius: 4px;
  cursor: pointer;
  color: ${props => props.theme?.colors?.textSecondary || '#9AA0A6'};
  display: flex;
  align-items: center;
  transition: color 0.2s ease, background 0.2s ease;
  margin-left: 6px;

  &:hover {
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    background: ${props => props.theme?.colors?.primary || '#1A73E8'}10;
  }
`;
