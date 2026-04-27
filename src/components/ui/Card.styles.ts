import styled from 'styled-components';

export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${props => props.theme?.spacing?.lg || '24px'};
  margin-bottom: ${props => props.theme?.spacing?.md || '16px'};

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    grid-template-columns: 1fr;
    gap: ${props => props.theme?.spacing?.sm || '8px'};
  }
`;

export const MetricCard = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  transition: ${props => props.theme?.transitions?.default || 'all 0.2s ease'};

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    padding: 16px;
    flex-direction: column;
    gap: 8px;
    grid-column: span 1 !important;
  }

  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`;

export const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const CardTitle = styled.h3`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin: 0;
`;

export const CardIcon = styled.div<{ $variant?: 'primary' | 'success' | 'danger' | 'warning' }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$variant) {
      case 'success': return 'rgba(15, 157, 88, 0.1)';
      case 'danger': return 'rgba(219, 68, 55, 0.1)';
      case 'warning': return 'rgba(244, 180, 0, 0.1)';
      default: return 'rgba(26, 115, 232, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$variant) {
      case 'success': return props.theme?.colors?.success || '#0F9D58';
      case 'danger': return props.theme?.colors?.danger || '#DB4437';
      case 'warning': return props.theme?.colors?.warning || '#F4B400';
      default: return props.theme?.colors?.primary || '#1A73E8';
    }
  }};
`;

export const CardValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  letter-spacing: -1px;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    font-size: 24px;
    margin-top: 4px;
  }
`;
