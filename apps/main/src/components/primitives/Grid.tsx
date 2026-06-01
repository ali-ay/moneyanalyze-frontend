import styled from 'styled-components';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  $columns?: string | number;
  $rows?: string;
  $gap?: string | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  $columnGap?: string;
  $rowGap?: string;
  $autoFlow?: 'row' | 'column' | 'dense' | 'row dense' | 'column dense';
  $autoRows?: string;
  $autoColumns?: string;
  $justifyContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  $alignContent?: 'start' | 'end' | 'center' | 'stretch' | 'space-between' | 'space-around' | 'space-evenly';
  $justifyItems?: 'start' | 'end' | 'center' | 'stretch';
  $alignItems?: 'start' | 'end' | 'center' | 'stretch';
}

const getGapValue = (gap?: string, theme?: any) => {
  if (!gap) return '0';
  if (typeof gap === 'string' && !gap.includes('px') && !gap.includes('rem')) {
    return theme?.spacing?.[gap as keyof typeof theme.spacing] || gap;
  }
  return gap;
};

export const Grid = styled.div<GridProps>`
  display: grid;
  grid-template-columns: ${props =>
    typeof props.$columns === 'number'
      ? `repeat(${props.$columns}, 1fr)`
      : props.$columns || 'auto'
  };
  grid-template-rows: ${props => props.$rows || 'auto'};
  gap: ${props => getGapValue(props.$gap, props.theme)};
  column-gap: ${props => getGapValue(props.$columnGap, props.theme)};
  row-gap: ${props => getGapValue(props.$rowGap, props.theme)};
  grid-auto-flow: ${props => props.$autoFlow || 'row'};
  grid-auto-rows: ${props => props.$autoRows};
  grid-auto-columns: ${props => props.$autoColumns};
  justify-content: ${props => props.$justifyContent};
  align-content: ${props => props.$alignContent};
  justify-items: ${props => props.$justifyItems};
  align-items: ${props => props.$alignItems};
`;
