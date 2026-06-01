// components/Wallet/DepositModal.tsx
import React, { useState } from 'react';
import * as S from './DepositModal.styles';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSuccess: (amount: string) => Promise<void>;
}

const DepositModal = ({ onClose, onSuccess }: Props) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSuccess(amount);
      onClose();
      alert("Bakiye başarıyla yüklendi!");
    } catch (err: any) {
      alert(err.response?.data?.message || err.message || "Bakiye yüklenemedi.");
    }
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e: any) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose}>
          <X size={24} />
        </S.CloseButton>
        <h2>Bakiye Yükle</h2>
        <form onSubmit={handleSubmit}>
          <S.Input 
            type="number" 
            placeholder="Miktar giriniz (USDT)" 
            autoFocus
            value={amount}
            onChange={(e: any) => setAmount(e.target.value)}
          />
          <S.AddButton style={{ width: '100%', justifyContent: 'center' }} type="submit">
            Yüklemeyi Tamamla
          </S.AddButton>
        </form>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default DepositModal;