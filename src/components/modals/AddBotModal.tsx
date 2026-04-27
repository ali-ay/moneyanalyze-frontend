import React, { useState } from 'react';
import api from '../../services/apiClient';

interface AddBotModalProps {
  userId: string | undefined;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddBotModal: React.FC<AddBotModalProps> = ({ userId, onClose, onSuccess }) => {
  const [symbol, setSymbol] = useState('BTCUSDT');
  const [limit, setLimit] = useState<number>(100);
  const [strategy, setStrategy] = useState('RSI');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert("Kullanıcı oturumu bulunamadı.");
      return;
    }

    setLoading(true);
    try {
      // Backend'deki /api/bots/create rotasına istek atıyoruz
      await api.post('/bots/create', {
        userId,
        symbol,
        limit,
        strategy
      });
      
      onSuccess(); // Ana sayfadaki listeyi yenile
      onClose();   // Modalı kapat
    } catch (err: any) {
      console.error("Bot oluşturma hatası:", err);
      alert(err.response?.data?.message || "Bot oluşturulurken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <h3 style={{ marginTop: 0, color: '#10b981' }}>🤖 Yeni Bot Yapılandır</h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
          Bot, belirlediğiniz limit dahilinde otomatik al-sat yapacaktır.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>İşlem Yapılacak Varlık</label>
            <select 
              value={symbol} 
              onChange={(e) => setSymbol(e.target.value)} 
              style={modalStyles.input}
            >
              <option value="BTCUSDT">Bitcoin (BTC/USDT)</option>
              <option value="ETHUSDT">Ethereum (ETH/USDT)</option>
              <option value="SOLUSDT">Solana (SOL/USDT)</option>
              <option value="XRPUSDT">Ripple (XRP/USDT)</option>
              <option value="AVAXUSDT">Avalanche (AVAX/USDT)</option>
            </select>
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>İşlem Başına Limit (USDT)</label>
            <input 
              type="number" 
              value={limit} 
              onChange={(e) => setLimit(Number(e.target.value))} 
              style={modalStyles.input}
              min="10"
              required
            />
          </div>

          <div style={modalStyles.inputGroup}>
            <label style={modalStyles.label}>Strateji Seçimi</label>
            <select 
              value={strategy} 
              onChange={(e) => setStrategy(e.target.value)} 
              style={modalStyles.input}
            >
              <option value="RSI">RSI (Göreceli Güç Endeksi)</option>
              <option value="SCALPING">Hızlı Scalping</option>
              <option value="EMA_CROSS">EMA Kesişimi</option>
            </select>
          </div>

          <div style={modalStyles.actions}>
            <button 
              type="button" 
              onClick={onClose} 
              style={modalStyles.cancelBtn}
              disabled={loading}
            >
              İptal
            </button>
            <button 
              type="submit" 
              style={modalStyles.submitBtn}
              disabled={loading}
            >
              {loading ? 'Kaydediliyor...' : 'Botu Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const modalStyles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100
  },
  content: {
    backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', width: '350px',
    color: 'white', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
  },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', marginBottom: '6px', fontSize: '13px', color: '#94a3b8' },
  input: {
    width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #334155',
    backgroundColor: '#0f172a', color: 'white', outline: 'none'
  },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' },
  cancelBtn: {
    padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
    backgroundColor: '#475569', color: 'white'
  },
  submitBtn: {
    padding: '10px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
    backgroundColor: '#10b981', color: 'white', fontWeight: 'bold'
  }
};