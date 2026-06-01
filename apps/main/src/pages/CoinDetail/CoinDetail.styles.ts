import styled from 'styled-components';

export const BackButtonContainer = styled.div`
  margin-bottom: 16px;
  align-self: flex-start;
`;

export const PriceDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.primary || '#1A73E8'};
`;
