import React, { useState } from 'react';
import api from '../../services/apiClient';
import { useAuth } from '../../core/providers/AuthContext';

interface SellModalProps {
  coin: {
    symbol: string;
    currentPrice: number; // Güncel piyasa fiyatı
    balance: number;      // Kullanıcının elindeki adet
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const SellModal: React.FC<SellModalProps> = ({ coin, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState<number | string>(coin.balance); // Varsayılan olarak hepsini seç
  const [totalGain, setTotalGain] = useState<number | string>((coin.balance * coin.currentPrice).toFixed(2));

  // Adet değiştiğinde tutarı hesapla
  const handleAmountChange = (val: string) => {
    const numVal = Number(val);
    
    // Elindeki bakiyeden fazlasını girmesini engelle
    if (numVal > coin.balance) {
      setAmount(coin.balance);
      setTotalGain((coin.balance * coin.currentPrice).toFixed(2));
      return;
    }

    setAmount(val);
    if (val && !isNaN(numVal)) {
      setTotalGain((numVal * coin.currentPrice).toFixed(2));
    } else {
      setTotalGain('');
    }
  };

  // Tutar değiştiğinde adeti hesapla
  const handlePriceChange = (val: string) => {
    const numVal = Number(val);
    const maxPossibleGain = coin.balance * coin.currentPrice;

    // Elindeki varlığın toplam değerinden fazlasını girmesini engelle
    if (numVal > maxPossibleGain) {
      setTotalGain(maxPossibleGain.toFixed(2));
      setAmount(coin.balance);
      return;
    }

    setTotalGain(val);
    if (val && !isNaN(numVal)) {
      setAmount((numVal / coin.currentPrice).toFixed(8));
    } else {
      setAmount('');
    }
  };

  const confirmSell = async () => {
    if (!amount || Number(amount) <= 0) return;

    try {
      const payload = {
        userId: user?.id || localStorage.getItem('id'),
        symbol: coin.symbol,
        sellAmount: Number(amount),
        sellPrice: coin.currentPrice,
        totalGain: Number(totalGain)
      };

      await api.post('/portfolio/sell', payload);
      
      alert('Satış işlemi başarıyla tamamlandı, bakiye hesabınıza aktarıldı.');
      onSuccess();
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Satış işlemi sırasında bir hata oluştu.');
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={{ marginTop: 0, color: '#f87171' }}>{coin.symbol} Satış Yap</h3>
        <p style={modalStyles.infoText}>
          Elinizdeki Miktar: <strong>{coin.balance} {coin.symbol.replace('USDT', '')}</strong>
        </p>
        <p>Güncel Satış Fiyatı: <strong>${coin.currentPrice.toLocaleString()}</strong></p>
        
        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Satılacak Miktar</label>
          <input 
            type="number" 
            style={modalStyles.input}
            value={amount} 
            onChange={(e) => handleAmountChange(e.target.value)} 
            placeholder="0.00"
            max={coin.balance}
          />
        </div>

        <div style={modalStyles.inputGroup}>
          <label style={modalStyles.label}>Alınacak Tutar (USDT)</label>
          <input 
            type="number" 
            style={modalStyles.input}
            value={totalGain} 
            onChange={(e) => handlePriceChange(e.target.value)} 
            placeholder="0.00"
          />
        </div>

        <div style={modalStyles.actions}>
          <button style={modalStyles.cancelBtn} onClick={onClose}>İptal</button>
          <button 
            style={{...modalStyles.sellBtn, opacity: !amount ? 0.5 : 1}} 
            onClick={confirmSell} 
            disabled={!amount}
          >
            Satış Yap
          </button>
        </div>
      </div>
    </div>
  );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
  },
  content: {
    backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', width: '350px', color: 'white', border: '1px solid #ef4444'
  },
  infoText: { fontSize: '14px', backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', color: '#94a3b8' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' },
  input: {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: 'white'
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' },
  cancelBtn: { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#475569', color: 'white' },
  sellBtn: { padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold' }
};