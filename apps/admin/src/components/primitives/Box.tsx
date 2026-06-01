import styled from 'styled-components';

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  $display?: 'block' | 'flex' | 'grid' | 'inline-block' | 'inline' | 'none';
  $padding?: string;
  $margin?: string;
  $backgroundColor?: string;
  $borderRadius?: string;
  $border?: string;
  $boxShadow?: string;
  $width?: string;
  $height?: string;
  $minHeight?: string;
  $minWidth?: string;
  $maxHeight?: string;
  $maxWidth?: string;
  $overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  $position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
}

export const Box = styled.div<BoxProps>`
  display: ${props => props.$display || 'block'};
  padding: ${props => props.$padding};
  margin: ${props => props.$margin};
  background-color: ${props => props.$backgroundColor};
  border-radius: ${props => props.$borderRadius};
  border: ${props => props.$border};
  box-shadow: ${props => props.$boxShadow};
  width: ${props => props.$width};
  height: ${props => props.$height};
  min-height: ${props => props.$minHeight};
  min-width: ${props => props.$minWidth};
  max-height: ${props => props.$maxHeight};
  max-width: ${props => props.$maxWidth};
  overflow: ${props => props.$overflow};
  position: ${props => props.$position};
`;
