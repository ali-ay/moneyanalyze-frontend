import styled from 'styled-components';

export const SuccessAlert = styled.div`
  color: #0f9d58;
  background: rgba(15, 157, 88, 0.05);
  padding: 16px;
  border-radius: 20px;
  margin-bottom: 24px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
`;

export const PasswordLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

export const ForgotPasswordLink = styled.a`
  font-size: 0.8125rem;
  color: #171717;
  text-decoration: underline;
  font-weight: 700;
  opacity: 0.6;
  
  &:hover {
    opacity: 1;
  }
`;

export const RegisterBox = styled.div`
  max-width: 700px;
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 1.25rem;
  background: #f7f7f7;
  border: 2px solid transparent;
  border-radius: 20px;
  color: #171717;
  font-size: 1rem;
  font-weight: 500;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;
  resize: vertical;

  &:focus {
    border-color: #171717;
    background: #ffffff;
    outline: none;
  }
`;
