import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { useNotification } from '../../app/providers/NotificationContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface BuyModalProps {
  coin: {
    symbol: string;
    price: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const PriceInfo = styled.div`
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
  padding: ${props => props.theme.spacing?.md || '16px'};
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  strong {
    color: ${props => props.theme.colors.textMain};
    font-size: 1.125rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: ${props => props.theme.spacing?.md || '16px'};
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: ${props => props.theme.colors.textSecondary};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border-radius: ${props => props.theme.radius.md};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.white};
  color: ${props => props.theme.colors.textMain};
  font-size: 0.875rem;
  box-sizing: border-box;
  transition: ${props => props.theme.transitions?.default || 'all 0.2s ease'};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const BuyModal: React.FC<BuyModalProps> = ({ coin, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const [amount, setAmount] = useState<number | string>('');
  const [totalPrice, setTotalPrice] = useState<number | string>('');
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (val && !isNaN(Number(val))) {
      setTotalPrice((Number(val) * coin.price).toFixed(2));
    } else {
      setTotalPrice('');
    }
  };

  const handlePriceChange = (val: string) => {
    setTotalPrice(val);
    if (val && !isNaN(Number(val))) {
      setAmount((Number(val) / coin.price).toFixed(8));
    } else {
      setAmount('');
    }
  };

  const confirmBuy = async () => {
    if (!amount || Number(amount) <= 0) return;

    try {
      setLoading(true);
      const calculatedTotal = Number(amount) * Number(coin.price);

      await api.post('/transactions/execute', {
        symbol: coin.symbol,
        type: 'BUY',
        amount: Number(amount),
        price: Number(coin.price),
        total: calculatedTotal,
        origin: 'MANUAL',
      });

      showNotification(`${coin.symbol} alımı başarıyla gerçekleşti!`, 'success');
      onSuccess();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || 'Bakiye yetersiz veya bir ağ hatası oluştu.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${coin.symbol} Satın Al`}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button $variant="secondary" onClick={onClose} disabled={loading}>
            İptal
          </Button>
          <Button
            $variant="success"
            onClick={confirmBuy}
            disabled={!amount || loading}
          >
            {loading ? 'İşleniyor...' : 'Satın Al'}
          </Button>
        </>
      }
    >
      <PriceInfo>
        Güncel Fiyat: <strong>${coin.price.toLocaleString()}</strong>
      </PriceInfo>

      <InputGroup>
        <Label>Miktar ({coin.symbol.replace('USDT', '')})</Label>
        <Input
          type="number"
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
          placeholder="0.00"
          disabled={loading}
        />
      </InputGroup>

      <InputGroup>
        <Label>Toplam Tutar (USDT)</Label>
        <Input
          type="number"
          value={totalPrice}
          onChange={e => handlePriceChange(e.target.value)}
          placeholder="0.00"
          disabled={loading}
        />
      </InputGroup>
    </Modal>
  );
};
