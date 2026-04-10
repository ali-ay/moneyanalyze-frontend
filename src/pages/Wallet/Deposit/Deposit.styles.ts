import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a;
`;

export const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
`;

export const Card = styled.div`
  background: #1e293b;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);

  h1 { font-size: 24px; margin-bottom: 8px; color: #fff; }
  p { color: #94a3b8; margin-bottom: 24px; }
`;

export const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  label { color: #cbd5e1; font-size: 14px; }

  input {
    background: #0f172a;
    border: 1px solid #334155;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    font-size: 18px;
    &:focus { border-color: #10b981; outline: none; }
  }
`;

export const SubmitBtn = styled.button`
  width: 100%;
  padding: 14px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled { opacity: 0.5; cursor: not-allowed; }
  &:hover { background: #059669; }
`;