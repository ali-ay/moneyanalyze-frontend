import styled, { css } from 'styled-components';

interface BadgeProps {
  $variant?: 'success' | 'danger' | 'warning' | 'info' | 'neutral';
  $size?: 'sm' | 'md';
}

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  ${props => props.$variant === 'success' && css`
    background: rgba(15, 157, 88, 0.1);
    color: ${props.theme.colors.success};
  `}

  ${props => props.$variant === 'danger' && css`
    background: rgba(219, 68, 55, 0.1);
    color: ${props.theme.colors.danger};
  `}

  ${props => (props.$variant === 'neutral' || !props.$variant) && css`
    background: ${props.theme.colors.surfaceHover};
    color: ${props.theme.colors.textSecondary};
  `}
`;
