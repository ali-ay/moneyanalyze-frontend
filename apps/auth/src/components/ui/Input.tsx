import styled from 'styled-components';

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.1);
  }

  &::placeholder {
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    opacity: 0.7;
  }

  &:disabled {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin-bottom: 8px;
`;

export const InputGroup = styled.div`
  margin-bottom: 16px;
`;
