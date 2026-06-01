import styled from 'styled-components';

export const NoConfigText = styled.p`
  font-size: 0.75rem;
  color: #9AA0A6;
`;

export const ConfigSection = styled.div`
  margin-top: 16px;
  border-top: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding-top: 16px;
`;

export const ConfigHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #9AA0A6;
  margin-bottom: 12px;
`;

export const SaveButtonIcon = styled.div`
  margin-right: 6px;
`;

export const PageHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const FullWidthMetricCard = styled.div`
  grid-column: span 2;
`;

export const InputFlex = styled.div`
  flex: 1;
`;
