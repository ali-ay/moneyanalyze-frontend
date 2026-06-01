import styled from 'styled-components';

// --- MODAL ANA KATMAN (ARKA PLAN BLUR) ---
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px); // Blur miktarını biraz artırdım, daha premium durur
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

// --- MODAL KUTUSU ---
export const ModalContent = styled.div`
  background: #1e293b;
  padding: 40px;
  border-radius: 24px;
  width: 90%;
  max-width: 420px;
  border: 1px solid #334155;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  
  h2 {
    margin-bottom: 24px;
    color: #fff;
    font-size: 1.5rem;
    font-weight: 700;
    text-align: center;
  }
`;

// --- KAPATMA BUTONU (SAĞ ÜST) ---
export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #0f172a;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #ef4444;
    color: #fff;
    border-color: #ef4444;
    transform: rotate(90deg);
  }
`;

// --- GİRİŞ ALANI (USDT INPUT) ---
export const Input = styled.input`
  width: 100%;
  background: #0f172a;
  border: 2px solid #334155;
  padding: 16px;
  border-radius: 12px;
  color: #fff;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 24px;
  outline: none;
  transition: all 0.2s ease;
  text-align: center;

  &::placeholder {
    color: #475569;
    font-size: 1rem;
    font-weight: 400;
  }

  &:focus {
    border-color: #00f2ea;
    box-shadow: 0 0 0 4px rgba(0, 242, 234, 0.1);
    background: #1e293b;
  }

  /* Ok işaretlerini kaldırmak için (Spinners) */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

// --- ONAY BUTONU ---
export const AddButton = styled.button`
  background: #00f2ea;
  color: #0f172a;
  border: none;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 242, 234, 0.3);
    filter: brightness(1.1);
  }

  &:active {
    transform: translateY(0);
  }
`;