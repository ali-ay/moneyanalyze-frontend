import React from 'react';
import styled from 'styled-components';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const SwitchContainer = styled.button<{ $checked: boolean; $disabled: boolean }>`
  width: 50px;
  height: 26px;
  border-radius: 13px;
  border: none;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  background: ${props => props.$checked ? props.theme.colors.success : '#DADCE0'};
  position: relative;
  transition: all 0.3s ease;
  opacity: ${props => props.$disabled ? 0.6 : 1};
  padding: 0;
  display: flex;
  align-items: center;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.$checked ? '27px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  &:hover:not(:disabled) {
    filter: brightness(1.05);
  }
`;

export const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled, isLoading }) => {
  return (
    <SwitchContainer 
      $checked={checked} 
      $disabled={!!(disabled || isLoading)} 
      onClick={() => !disabled && !isLoading && onChange(!checked)}
      type="button"
    />
  );
};
