import React, { useState } from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { useAuth } from '../../app/providers/AuthContext';
import { useNotification } from '../../app/providers/NotificationContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface SellModalProps {
  coin: {
    symbol: string;
    currentPrice: number;
    balance: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const InfoBox = styled.div`
  margin-bottom: ${props => props.theme.spacing?.md || '16px'};
  padding: ${props => props.theme.spacing?.md || '16px'};
  background: ${props => props.theme.colors.surfaceHover};
  border-radius: ${props => props.theme.radius.md};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textSecondary};

  strong {
    color: ${props => props.theme.colors.textMain};
  }

  & + & {
    margin-top: 0;
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
    border-color: ${props => props.theme.colors.danger};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.danger}20;
  }
`;

export const SellModal: React.FC<SellModalProps> = ({ coin, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [amount, setAmount] = useState<number | string>(coin.balance);
  const [totalGain, setTotalGain] = useState<number | string>(
    (coin.balance * coin.currentPrice).toFixed(2)
  );
  const [loading, setLoading] = useState(false);

  const handleAmountChange = (val: string) => {
    const numVal = Number(val);
    if (numVal > coin.balance) {
      setAmount(coin.balance);
      setTotalGain((coin.balance * coin.currentPrice).toFixed(2));
      return;
    }
    setAmount(val);
    setTotalGain(val && !isNaN(numVal) ? (numVal * coin.currentPrice).toFixed(2) : '');
  };

  const handlePriceChange = (val: string) => {
    const numVal = Number(val);
    const maxPossibleGain = coin.balance * coin.currentPrice;
    if (numVal > maxPossibleGain) {
      setTotalGain(maxPossibleGain.toFixed(2));
      setAmount(coin.balance);
      return;
    }
    setTotalGain(val);
    setAmount(val && !isNaN(numVal) ? (numVal / coin.currentPrice).toFixed(8) : '');
  };

  const confirmSell = async () => {
    if (!amount || Number(amount) <= 0) return;

    try {
      setLoading(true);
      await api.post('/portfolio/sell', {
        userId: user?.id || localStorage.getItem('id'),
        symbol: coin.symbol,
        sellAmount: Number(amount),
        sellPrice: coin.currentPrice,
        totalGain: Number(totalGain),
      });

      showNotification('Satış işlemi başarıyla tamamlandı.', 'success');
      onSuccess();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || 'Satış işlemi sırasında bir hata oluştu.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={`${coin.symbol} Satış Yap`}
      onClose={onClose}
      size="sm"
      footer={
        <>
          <Button $variant="secondary" onClick={onClose} disabled={loading}>
            İptal
          </Button>
          <Button
            $variant="danger"
            onClick={confirmSell}
            disabled={!amount || loading}
          >
            {loading ? 'İşleniyor...' : 'Satış Yap'}
          </Button>
        </>
      }
    >
      <InfoBox>
        Elinizdeki Miktar:{' '}
        <strong>
          {coin.balance} {coin.symbol.replace('USDT', '')}
        </strong>
      </InfoBox>

      <InfoBox>
        Güncel Satış Fiyatı: <strong>${coin.currentPrice.toLocaleString()}</strong>
      </InfoBox>

      <InputGroup>
        <Label>Satılacak Miktar</Label>
        <Input
          type="number"
          value={amount}
          onChange={e => handleAmountChange(e.target.value)}
          placeholder="0.00"
          max={coin.balance}
          disabled={loading}
        />
      </InputGroup>

      <InputGroup>
        <Label>Alınacak Tutar (USDT)</Label>
        <Input
          type="number"
          value={totalGain}
          onChange={e => handlePriceChange(e.target.value)}
          placeholder="0.00"
          disabled={loading}
        />
      </InputGroup>
    </Modal>
  );
};
