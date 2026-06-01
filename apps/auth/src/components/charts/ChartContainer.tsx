import React from 'react';
import styled from 'styled-components';

const Container = styled.div<{ $minHeight?: string }>`
  background: ${props => props.theme.colors.white};
  border-radius: ${props => props.theme.radius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  padding: ${props => props.theme.spacing?.lg || '24px'};
  min-height: ${props => props.$minHeight || '320px'};
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing?.md || '16px'};
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;
`;

const Body = styled.div`
  flex: 1;
  position: relative;
  min-height: 0;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 200px;
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.875rem;
`;

export interface ChartContainerProps {
  title?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  isEmpty?: boolean;
  emptyMessage?: string;
  minHeight?: string;
  className?: string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  actions,
  children,
  isEmpty,
  emptyMessage = 'Veri bulunamadı.',
  minHeight,
  className,
}) => (
  <Container $minHeight={minHeight} className={className}>
    {(title || actions) && (
      <Header>
        {title && <Title>{title}</Title>}
        {actions && <div>{actions}</div>}
      </Header>
    )}
    <Body>
      {isEmpty ? <EmptyState>{emptyMessage}</EmptyState> : children}
    </Body>
  </Container>
);
