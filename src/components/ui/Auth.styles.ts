import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: ${props => props.theme?.colors?.background || '#080c14'};
`;

export const AuthBox = styled.div`
  background: ${props => props.theme?.colors?.surface || '#0f172a'};
  padding: 2.5rem;
  border-radius: ${props => props.theme?.radius?.lg || '16px'};
  width: 100%;
  max-width: 400px;
  box-shadow: ${props => props.theme?.shadows?.lg || '0 10px 25px rgba(0,0,0,0.3)'};
  border: 1px solid ${props => props.theme?.colors?.border || '#2D2D2D'};
`;

export const AuthTitle = styled.h2`
  color: ${props => props.theme?.colors?.textMain || '#FFFFFF'};
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
`;

export const AuthSubtitle = styled.p`
  color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
  font-size: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
    font-size: 0.85rem;
    font-weight: 500;
  }

  input {
    padding: 0.85rem;
    background: transparent;
    border: 1px solid ${props => props.theme?.colors?.border || '#2D2D2D'};
    border-radius: ${props => props.theme?.radius?.md || '12px'};
    color: ${props => props.theme?.colors?.textMain || '#FFFFFF'};
    font-size: 1rem;
    transition: ${props => props.theme?.transitions?.fast || '0.2s'};

    &:focus {
      border-color: ${props => props.theme?.colors?.primary || '#3D6BFF'};
      outline: none;
      background: ${props => props.theme?.colors?.surfaceHover || '#1C1C1C'};
      box-shadow: 0 0 0 2px rgba(61, 107, 255, 0.2);
    }

    &::placeholder {
      color: #999;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

export const SubmitButton = styled.button`
  background: ${props => props.theme?.colors?.primary || '#3D6BFF'};
  color: #fff;
  padding: 0.9rem;
  border: none;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${props => props.theme?.transitions?.fast || '0.2s'};

  &:hover {
    background: ${props => props.theme?.colors?.primaryHover || '#5C85FF'};
    box-shadow: ${props => props.theme?.shadows?.sm || '0 2px 8px rgba(0,0,0,0.2)'};
    transform: translateY(-1px);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: ${props => props.theme?.colors?.border || '#2D2D2D'};
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: ${props => props.theme?.colors?.danger || '#FF4D4D'};
  background: rgba(255, 77, 77, 0.1);
  padding: 0.8rem;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(255, 77, 77, 0.2);
  margin-bottom: 1.5rem;
`;

export const SuccessMessage = styled.div`
  color: ${props => props.theme?.colors?.success || '#00C853'};
  background: rgba(0, 200, 83, 0.1);
  padding: 0.8rem;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(0, 200, 83, 0.2);
  margin-bottom: 1.5rem;
`;

export const FooterText = styled.p`
  color: ${props => props.theme?.colors?.textSecondary || '#94a3b8'};
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;

  a {
    color: ${props => props.theme?.colors?.primary || '#3D6BFF'};
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.4rem;
    transition: ${props => props.theme?.transitions?.fast || '0.2s'};

    &:hover {
      text-decoration: underline;
      color: ${props => props.theme?.colors?.primaryHover || '#5C85FF'};
    }
  }
`;
