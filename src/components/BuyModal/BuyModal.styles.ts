import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);

  h3 {
    margin-top: 0;
    color: #f8fafc;
    font-size: 20px;
    border-bottom: 1px solid #334155;
    padding-bottom: 12px;
  }

  p {
    color: #94a3b8;
    margin: 16px 0;
    font-size: 14px;
    
    strong {
      color: #38bdf8;
      font-size: 18px;
    }
  }

  label {
    display: block;
    color: #f1f5f9;
    margin-bottom: 8px;
    font-size: 14px;
  }

  input {
    width: 100%;
    padding: 12px;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    color: #fff;
    font-size: 16px;
    margin-bottom: 20px;
    outline: none;

    &:focus {
      border-color: #38bdf8;
    }
  }

  .actions {
    display: flex;
    gap: 12px;
    margin-top: 10px;

    button {
      flex: 1;
      padding: 12px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
      border: none;
    }

    button:first-child {
      background: #334155;
      color: #f1f5f9;
      &:hover { background: #475569; }
    }

    .buy-btn {
      background: #10b981;
      color: white;
      &:hover { background: #059669; }
      &:disabled { background: #064e3b; cursor: not-allowed; }
    }
  }
`;