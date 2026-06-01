import styled, { css } from 'styled-components';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  $size?: 'sm' | 'md' | 'lg';
  $fullWidth?: boolean;
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme?.spacing?.sm || '8px'};
  border-radius: ${props => props.theme.radius.md};
  font-weight: 600;
  transition: ${props => props.theme?.transitions?.default || 'all 0.2s ease'};
  cursor: pointer;
  border: 1px solid transparent;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  /* Sizing */
  ${props => {
    const spacing = props.theme?.spacing;
    switch (props.$size) {
      case 'sm':
        return css`
          padding: ${spacing?.xs || '4px'} ${spacing?.sm || '8px'};
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: ${spacing?.md || '16px'} ${spacing?.lg || '24px'};
          font-size: 1.125rem;
        `;
      default: // md
        return css`
          padding: ${spacing?.sm || '8px'} ${spacing?.md || '16px'};
          font-size: 1rem;
        `;
    }
  }}

  /* Variants */
  ${props => {
    const colors = props.theme?.colors;
    const shadows = props.theme?.shadows;
    
    switch (props.$variant) {
      case 'secondary':
        return css`
          background: ${colors?.surfaceHover || '#1C1C1C'};
          color: ${colors?.textMain || '#FFFFFF'};
          border-color: ${colors?.border || '#2D2D2D'};
          &:hover:not(:disabled) {
            background: ${colors?.border || '#2D2D2D'};
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return css`
          background: ${colors?.danger || '#FF4D4D'};
          color: white;
          &:hover:not(:disabled) {
            background: #c53929;
            box-shadow: ${shadows?.md || '0 4px 12px rgba(0,0,0,0.2)'};
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return css`
          background: ${colors?.success || '#00C853'};
          color: white;
          &:hover:not(:disabled) {
            background: #0b8043;
            box-shadow: ${shadows?.md || '0 4px 12px rgba(0,0,0,0.2)'};
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return css`
          background: transparent;
          color: ${colors?.primary || '#3D6BFF'};
          border-color: ${colors?.border || '#2D2D2D'};
          &:hover:not(:disabled) {
            background: ${colors?.surfaceHover || '#1C1C1C'};
            border-color: ${colors?.primary || '#3D6BFF'};
            transform: translateY(-1px);
          }
        `;
      default: // primary
        return css`
          background: ${colors?.primary || '#3D6BFF'};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors?.primaryHover || '#5C85FF'};
            box-shadow: ${shadows?.md || '0 4px 12px rgba(0,0,0,0.2)'};
            transform: translateY(-1px);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  &:active:not(:disabled) {
    transform: translateY(1px);
  }
`;
