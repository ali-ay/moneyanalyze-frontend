import { useState } from 'react';
import * as S from './BuyModal.styles';

interface BuyModalProps {
  coin: {
    symbol: string;
    price: number;
  };
  onClose: () => void;
  onConfirm: (amount: number) => void;
}

const BuyModal = ({ coin, onClose, onConfirm }: BuyModalProps) => {
  // 'amount' (adet) veya 'total' (USDT tutarı) modları
  const [mode, setMode] = useState<'amount' | 'total'>('amount');
  const [inputValue, setInputValue] = useState<string>('');
  
  const coinPrice = Number(coin.price) || 0;

  // Hesaplama Mantığı
  const currentVal = parseFloat(inputValue) || 0;
  
  // Eğer kullanıcı miktar giriyorsa direkt odur, dolar giriyorsa fiyata böleriz
  const calculatedAmount = mode === 'amount' 
    ? currentVal 
    : currentVal / coinPrice;

  // Eğer kullanıcı dolar giriyorsa direkt odur, miktar giriyorsa fiyatla çarparız
  const calculatedTotal = mode === 'total' 
    ? currentVal 
    : currentVal * coinPrice;

  const handleConfirm = () => {
    if (calculatedAmount > 0) {
      onConfirm(calculatedAmount);
    }
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <h3>{coin.symbol} Satın Al</h3>
        
        <p>Anlık Fiyat: <strong>${coinPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</strong></p>
        
        {/* Mod Seçici Butonlar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <button 
            style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: mode === 'amount' ? '#10b981' : '#333', color: 'white', border: 'none', borderRadius: '4px' }}
            onClick={() => { setMode('amount'); setInputValue(''); }}
          >
            Miktar (Adet)
          </button>
          <button 
            style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: mode === 'total' ? '#10b981' : '#333', color: 'white', border: 'none', borderRadius: '4px' }}
            onClick={() => { setMode('total'); setInputValue(''); }}
          >
            Toplam (USDT)
          </button>
        </div>

        <label>{mode === 'amount' ? 'Alınacak Adet:' : 'Harcanacak Tutar (USDT):'}</label>
        <input 
          type="number" 
          placeholder="0.00"
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          autoFocus
          style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
        />
        
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f91a', borderRadius: '8px' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            {mode === 'amount' ? 'Hesaplanan Tutar:' : 'Hesaplanan Miktar:'}
          </p>
          <strong style={{ fontSize: '20px', color: '#10b981' }}>
            {mode === 'amount' 
              ? `$${calculatedTotal.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` 
              : `${calculatedAmount.toFixed(6)} ${coin.symbol.replace('USDT', '')}`
            }
          </strong>
        </div>
        
        <div className="actions" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="button" onClick={onClose} style={{ flex: 1 }}>İptal</button>
          <button 
            className="buy-btn" 
            disabled={calculatedAmount <= 0} 
            onClick={handleConfirm}
            style={{ flex: 1, backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: calculatedAmount <= 0 ? 'not-allowed' : 'pointer' }}
          >
            Satın Almayı Onayla
          </button>
        </div>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default BuyModal;