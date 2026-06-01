import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  $padding?: string;
}

const CardContainer = styled.div<{$padding?: string}>`
  background: ${props => props.theme.colors.white};
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: ${props => props.$padding || '0'};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;
`;

const CardBody = styled.div<{ $noPadding?: boolean }>`
  padding: ${props => props.$noPadding ? '0' : '24px'};
  flex: 1;

  @media (max-width: 768px) {
    padding: ${props => props.$noPadding ? '0' : '12px'};
  }
`;

const CardFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surfaceHover};
`;

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Title: React.FC<CardProps>;
  Body: React.FC<CardProps & { $noPadding?: boolean }>;
  Footer: React.FC<CardProps>;
} = ({ children, ...props }) => <CardContainer {...props}>{children}</CardContainer>;

Card.Header = ({ children, ...props }) => <CardHeader {...props}>{children}</CardHeader>;
Card.Title = ({ children, ...props }) => <CardTitle {...props}>{children}</CardTitle>;
Card.Body = ({ children, $noPadding, ...props }) => <CardBody $noPadding={$noPadding} {...props}>{children}</CardBody>;
Card.Footer = ({ children, ...props }) => <CardFooter {...props}>{children}</CardFooter>;
