import styled from 'styled-components';

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme?.spacing?.lg || '24px'};
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const PageTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin: 0;
  letter-spacing: -0.5px;
`;

export const PageSubtitle = styled.p`
  font-size: 0.9375rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin: 0;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 0.9375rem;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}){
    padding-top: 0;
  }
`;

export const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  font-size: 1rem;
`;
