import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top left, #1e293b, #0f172a);
`;

export const RegisterBox = styled.div`
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
  color: #10b981; /* Kayıt için daha taze bir yeşil tonu */
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
    
    &:focus {
      border-color: #10b981;
    }
  }
`;

export const RegisterButton = styled.button`
  background: #10b981;
  color: #0f172a;
  padding: 12px;
  font-weight: 700;
  font-size: 16px;
  margin-top: 10px;

  &:hover {
    background: #34d399;
    transform: translateY(-2px);
  }
`;

export const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
`;

export const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 13px;
`;

export const FooterText = styled.p`
  margin-top: 25px;
  font-size: 14px;
  color: #94a3b8;

  a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    &:hover { text-decoration: underline; }
  }
`;