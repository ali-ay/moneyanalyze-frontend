import styled from 'styled-components';

export const BackButton = styled.div`
  margin-bottom: 16px;
  align-self: flex-start;
`;

export const PriceDisplayWrapper = styled.div`
  margin-top: 12px;
`;

export const CardWithMargin = styled.div`
  margin-bottom: 24px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
`;

export const TooltipStyle = styled.div`
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-size: 0.75rem;
`;
