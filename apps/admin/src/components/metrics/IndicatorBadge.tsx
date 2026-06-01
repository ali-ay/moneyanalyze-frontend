import React from 'react';
import styled from 'styled-components';

export type IndicatorStatus = 'strong-buy' | 'buy' | 'neutral' | 'sell' | 'strong-sell' | 'overbought' | 'oversold';

const BadgeContainer = styled.div<{ $status?: IndicatorStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  background-color: ${props => {
    switch (props.$status) {
      case 'strong-buy':
        return `${props.theme.colors.success}20`;
      case 'buy':
        return `${props.theme.colors.success}15`;
      case 'sell':
        return `${props.theme.colors.danger}15`;
      case 'strong-sell':
        return `${props.theme.colors.danger}20`;
      case 'overbought':
        return `${props.theme.colors.warning}15`;
      case 'oversold':
        return `${props.theme.colors.success}15`;
      default:
        return `${props.theme.colors.textSecondary}10`;
    }
  }};

  color: ${props => {
    switch (props.$status) {
      case 'strong-buy':
        return props.theme.colors.success;
      case 'buy':
        return props.theme.colors.success;
      case 'sell':
        return props.theme.colors.danger;
      case 'strong-sell':
        return props.theme.colors.danger;
      case 'overbought':
        return props.theme.colors.warning;
      case 'oversold':
        return props.theme.colors.success;
      default:
        return props.theme.colors.textSecondary;
    }
  }};

  border: 1px solid currentColor;
  border-radius: 4px;
`;

const StatusDot = styled.span<{ $status?: IndicatorStatus }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: currentColor;
  animation: ${props =>
    props.$status?.includes('strong') ? 'pulse 2s infinite' : 'none'
  };

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
`;

export interface IndicatorBadgeProps {
  label: string;
  status?: IndicatorStatus;
  value?: string | number;
  showDot?: boolean;
  className?: string;
}

const getStatusLabel = (status?: IndicatorStatus) => {
  switch (status) {
    case 'strong-buy':
      return 'GÜÇLÜ AL';
    case 'buy':
      return 'AL';
    case 'sell':
      return 'SAT';
    case 'strong-sell':
      return 'GÜÇLÜ SAT';
    case 'overbought':
      return 'AŞIRI ALIM';
    case 'oversold':
      return 'AŞIRI SATIM';
    default:
      return 'NÖTR';
  }
};

export const IndicatorBadge: React.FC<IndicatorBadgeProps> = ({
  label,
  status,
  value,
  showDot = true,
  className,
}) => (
  <div className={className}>
    <div style={{ fontSize: '0.75rem', color: '#9AA0A6', marginBottom: '6px' }}>
      {label}
    </div>
    <BadgeContainer $status={status}>
      {showDot && <StatusDot $status={status} />}
      {getStatusLabel(status)}
      {value && <span style={{ marginLeft: '4px' }}>({value})</span>}
    </BadgeContainer>
  </div>
);
