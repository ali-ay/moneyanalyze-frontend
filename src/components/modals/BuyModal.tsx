import React, { useState } from 'react';
import api from '../../services/apiClient';
import { useNotification } from '../../core/providers/NotificationContext';

interface BuyModalProps {
  coin: {
    symbol: string;
    price: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const BuyModal: React.FC<BuyModalProps> = ({ coin, onClose, onSuccess }) => {
  const { showNotification } = useNotification();
  const [amount, setAmount] = useState<number | string>(''); // Adet
  const [totalPrice, setTotalPrice] = useState<number | string>(''); // Toplam Dolar Tutarı
  const [loading, setLoading] = useState(false);

  // Adet değiştiğinde tutarı hesapla
  const handleAmountChange = (val: string) => {
    setAmount(val);
    if (val && !isNaN(Number(val))) {
      setTotalPrice((Number(val) * coin.price).toFixed(2));
    } else {
      setTotalPrice('');
    }
  };

  // Tutar değiştiğinde adeti hesapla
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
      
      const payload = {
        symbol: coin.symbol,
        type: 'BUY',
        amount: Number(amount),
        price: Number(coin.price),
        total: calculatedTotal,
        origin: 'MANUAL' 
      };

      await api.post('/transactions/execute', payload);
      
      showNotification(`${coin.symbol} alımı başarıyla gerçekleşti!`, 'success');
      onSuccess(); // Modalı kapat ve verileri yenile
    } catch (err: any) {
      console.error("İşlem Hatası:", err.response?.data);
      showNotification(err.response?.data?.message || 'Bakiye yetersiz veya bir ağ hatası oluştu.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={{ marginTop: 0 }}>{coin.symbol} Satın Al</h3>
        <p>Güncel Fiyat: <strong>${coin.price.toLocaleString()}</strong></p>
        
        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Miktar ({coin.symbol.replace('USDT', '')})</label>
          <input 
            type="number" 
            style={modalStyles.input}
            value={amount} 
            onChange={(e) => handleAmountChange(e.target.value)} 
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Toplam Tutar (USDT)</label>
          <input 
            type="number" 
            style={modalStyles.input}
            value={totalPrice} 
            onChange={(e) => handlePriceChange(e.target.value)} 
            placeholder="0.00"
            disabled={loading}
          />
        </div>

        <div style={modalStyles.actions}>
          <button 
            style={modalStyles.cancelBtn} 
            onClick={onClose}
            disabled={loading}
          >
            İptal
          </button>
          <button 
            style={{
              ...modalStyles.buyBtn, 
              opacity: (!amount || loading) ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }} 
            onClick={confirmBuy} 
            disabled={!amount || loading}
          >
            {loading ? 'İşleniyor...' : 'Satın Al'}
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  content: {
    backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', width: '350px', color: 'white',
    boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
  },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' },
  input: {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white',
    boxSizing: 'border-box'
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  cancelBtn: { padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#475569', color: 'white' },
  buyBtn: { padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#f3ba2f', color: 'black', fontWeight: 'bold' }
};