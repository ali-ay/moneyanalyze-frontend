import React from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { HStack } from '../primitives/Flex';

const MetricValue = styled.div<{ $variant?: 'primary' | 'success' | 'danger' }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => {
    switch (props.$variant) {
      case 'success':
        return props.theme.colors.success;
      case 'danger':
        return props.theme.colors.danger;
      default:
        return props.theme.colors.textMain;
    }
  }};
  margin: 12px 0;
`;

const MetricSubtext = styled.div`
  font-size: 0.8125rem;
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 8px;
`;

const MetricIcon = styled.div<{ $variant?: 'primary' | 'success' | 'danger' }>`
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => {
    const colors = props.theme.colors;
    switch (props.$variant) {
      case 'success':
        return `${colors.success}15`;
      case 'danger':
        return `${colors.danger}15`;
      default:
        return `${colors.primary}15`;
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'success':
        return props.theme.colors.success;
      case 'danger':
        return props.theme.colors.danger;
      default:
        return props.theme.colors.primary;
    }
  }};
  flex-shrink: 0;
`;

export interface MetricCardProps {
  title: string;
  value: string | number;
  currency?: '$' | '₺';
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'danger';
  subtext?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  currency = '$',
  icon,
  variant = 'primary',
  subtext,
  className,
}) => (
  <Card className={className}>
    <Card.Header>
      <HStack $justify="space-between" $fullWidth>
        <div>
          <div style={{ fontSize: '0.8125rem', color: '#9AA0A6', marginBottom: '4px' }}>
            {title}
          </div>
        </div>
        {icon && <MetricIcon $variant={variant}>{icon}</MetricIcon>}
      </HStack>
    </Card.Header>
    <Card.Body $noPadding>
      <div style={{ padding: '0 24px 24px 24px' }}>
        <MetricValue $variant={variant}>
          {currency}
          {typeof value === 'number' ? value.toLocaleString() : value}
        </MetricValue>
        {subtext && <MetricSubtext>{subtext}</MetricSubtext>}
      </div>
    </Card.Body>
  </Card>
);
