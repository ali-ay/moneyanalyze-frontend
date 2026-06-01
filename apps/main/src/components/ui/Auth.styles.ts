import styled from 'styled-components';

export const AuthContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #ffb3c7;
  padding: 20px;
`;

export const AuthBox = styled.div`
  background: #ffffff;
  padding: 3.5rem;
  border-radius: 48px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    padding: 2rem;
    border-radius: 32px;
  }
`;

export const AuthTitle = styled.h2`
  color: #171717;
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -2px;
  line-height: 1;
`;

export const AuthSubtitle = styled.p`
  color: #171717;
  font-size: 1.125rem;
  font-weight: 500;
  margin-bottom: 3rem;
  text-align: center;
  opacity: 0.7;
`;

export const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    color: #171717;
    font-size: 0.875rem;
    font-weight: 800;
    margin-left: 4px;
  }

  input {
    padding: 1.25rem;
    background: #f7f7f7;
    border: 2px solid transparent;
    border-radius: 20px;
    color: #171717;
    font-size: 1rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:focus {
      border-color: #171717;
      background: #ffffff;
      outline: none;
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
  background: #171717;
  color: #fff;
  padding: 1.25rem;
  border: none;
  border-radius: 99px;
  font-size: 1.125rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s;
  margin-top: 1rem;

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #DB4437;
  background: rgba(219, 68, 55, 0.05);
  padding: 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
`;

export const SuccessMessage = styled.div`
  color: #0F9D58;
  background: rgba(15, 157, 88, 0.05);
  padding: 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
`;

export const FooterText = styled.p`
  color: #171717;
  margin-top: 2.5rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 500;

  a {
    color: #171717;
    text-decoration: underline;
    font-weight: 800;
    margin-left: 0.4rem;
    
    &:hover {
      opacity: 0.7;
    }
  }
`;
