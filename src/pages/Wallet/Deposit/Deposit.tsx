import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { depositMoney } from '../../../api/wallet';
import * as S from './Deposit.styles';
import Sidebar from '../../../components/Sidebar/Sidebar';

const Deposit = () => {
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return alert("Lütfen geçerli bir miktar girin.");

    setLoading(true);
    try {
      await depositMoney(amount);
      alert(`${amount} USDT başarıyla yüklendi!`);
      navigate('/wallet'); // Cüzdana geri gönder
    } catch (err) {
      alert("Yükleme sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Layout>
      <Sidebar />
      <S.MainContent>
        <S.Card>
          <h1>Bakiye Yükle</h1>
          <p>Yüklemek istediğiniz USDT miktarını giriniz.</p>
          
          <form onSubmit={handleDeposit}>
            <S.InputGroup>
              <label>Miktar (USDT)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Örn: 1000"
              />
            </S.InputGroup>
            
            <S.SubmitBtn type="submit" disabled={loading}>
              {loading ? "Yükleniyor..." : "Bakiyeyi Güncelle"}
            </S.SubmitBtn>
          </form>
        </S.Card>
      </S.MainContent>
    </S.Layout>
  );
};

export default Deposit;