import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, #1e293b, #0f172a);
`;

export const LoginBox = styled.div`
  background: #1e293b;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 400px;
  text-align: center;
  border: 1px solid #334155;
`;

export const Title = styled.h1`
  margin: 0;
  color: #38bdf8;
  font-size: 28px;
  font-weight: 800;
`;

export const Subtitle = styled.p`
  color: #94a3b8;
  margin-bottom: 30px;
  font-size: 14px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const InputGroup = styled.div`
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 13px;
    color: #cbd5e1;
  }

  input {
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #334155;
    background: #0f172a;
    color: white;
    font-size: 15px;
    transition: 0.3s;
    
    &:focus {
      border-color: #38bdf8;
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
    }
  }
`;

export const LoginButton = styled.button`
  background: #38bdf8;
  color: #0f172a;
  padding: 12px;
  font-weight: 700;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background: #7dd3fc;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #64748b;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
  border: 1px solid rgba(239, 68, 68, 0.2);
`;

export const FooterText = styled.p`
  margin-top: 25px;
  font-size: 14px;
  color: #94a3b8;

  a {
    color: #38bdf8;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;