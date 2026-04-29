import styled from 'styled-components';
import { Flex, FlexProps } from './Flex';

export const VStack = styled(Flex).attrs(() => ({ $direction: 'column' }))<FlexProps>``;

export const HStack = styled(Flex).attrs(() => ({ $direction: 'row' }))<FlexProps>``;

export interface StackProps extends FlexProps {
  $spacing?: string;
}

export const SimpleVStack = styled.div<StackProps>`
  display: flex;
  flex-direction: column;
  gap: ${props =>
    props.$spacing || (props.theme?.spacing?.md || '16px')
  };
`;

export const SimpleHStack = styled.div<StackProps>`
  display: flex;
  flex-direction: row;
  gap: ${props =>
    props.$spacing || (props.theme?.spacing?.md || '16px')
  };
`;
