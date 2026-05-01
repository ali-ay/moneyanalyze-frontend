import styled from 'styled-components';

export const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding-bottom: 8px;
`;

export const SectionContainer = styled.div``;

export const RecaptchaKeysGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  min-height: 80px;
  font-family: inherit;
  font-size: 0.875rem;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }
`;

export const Message = styled.div<{ $type: 'success' | 'error' }>`
  padding: 12px;
  border-radius: 8px;
  background-color: ${props =>
    props.$type === 'success' ? '#e6f4ea' : '#fce8e6'};
  color: ${props =>
    props.$type === 'success' ? '#0f9d58' : '#d93025'};
  font-weight: 600;
`;

export const FormContent = styled.div`
  padding: 32px;
`;

export const SubmitButtonStyled = styled.button`
  align-self: flex-start;
  padding: 12px 32px;
`;
