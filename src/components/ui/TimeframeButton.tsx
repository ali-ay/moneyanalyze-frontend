import React from 'react';
import styled from 'styled-components';

const TimeframeContainer = styled.div`
  display: inline-flex;
  gap: 4px;
  padding: 4px;
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.radius.md};
`;

const TimeframeBtn = styled.button<{ $active?: boolean }>`
  padding: 6px 14px;
  border: none;
  background: ${props => props.$active
    ? props.theme.colors.white
    : 'transparent'};
  color: ${props => props.$active
    ? props.theme.colors.primary
    : props.theme.colors.textSecondary};
  font-weight: ${props => props.$active ? 600 : 500};
  font-size: 0.8125rem;
  border-radius: ${props => props.theme.radius.sm};
  cursor: pointer;
  transition: ${props => props.theme.transitions?.default || 'all 0.2s ease'};
  box-shadow: ${props => props.$active
    ? '0 1px 3px rgba(0, 0, 0, 0.08)'
    : 'none'};

  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

export interface TimeframeOption {
  value: string;
  label: string;
}

export interface TimeframeButtonsProps {
  options: TimeframeOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const TimeframeButtons: React.FC<TimeframeButtonsProps> = ({
  options,
  value,
  onChange,
  className,
}) => (
  <TimeframeContainer className={className}>
    {options.map(option => (
      <TimeframeBtn
        key={option.value}
        $active={value === option.value}
        onClick={() => onChange(option.value)}
        type="button"
      >
        {option.label}
      </TimeframeBtn>
    ))}
  </TimeframeContainer>
);

export const DEFAULT_CRYPTO_TIMEFRAMES: TimeframeOption[] = [
  { value: '1m', label: '1D' },
  { value: '5m', label: '5D' },
  { value: '15m', label: '15D' },
  { value: '1h', label: '1S' },
  { value: '4h', label: '4S' },
  { value: '1d', label: '1G' },
  { value: '1w', label: '1H' },
];

export const DEFAULT_STOCK_TIMEFRAMES: TimeframeOption[] = [
  { value: '1d', label: '1G' },
  { value: '5d', label: '5G' },
  { value: '1mo', label: '1A' },
  { value: '3mo', label: '3A' },
  { value: '1y', label: '1Y' },
  { value: '5y', label: '5Y' },
  { value: 'all', label: 'Tümü' },
];
