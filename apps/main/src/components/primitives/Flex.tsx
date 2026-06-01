import styled from 'styled-components';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  $direction?: 'row' | 'column';
  $gap?: string | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  $justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  $wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  $fullWidth?: boolean;
  $fullHeight?: boolean;
}

const getGapValue = (gap?: string, theme?: any) => {
  if (!gap) return '0';
  if (typeof gap === 'string' && gap.startsWith('#') === false) {
    return theme?.spacing?.[gap as keyof typeof theme.spacing] || gap;
  }
  return gap;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${props => props.$direction || 'row'};
  gap: ${props => getGapValue(props.$gap, props.theme)};
  align-items: ${props => props.$align || 'stretch'};
  justify-content: ${props => props.$justify || 'flex-start'};
  flex-wrap: ${props => props.$wrap || 'nowrap'};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  height: ${props => props.$fullHeight ? '100%' : 'auto'};
`;

export const VStack = styled(Flex).attrs(() => ({ $direction: 'column' }))``;

export const HStack = styled(Flex).attrs(() => ({ $direction: 'row' }))``;
