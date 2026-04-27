import React, { useState, useEffect } from 'react';
import * as S from './styles';

const Settings: React.FC = () => {
  const [orderAmount, setOrderAmount] = useState<number>(10);
  const [loading, setLoading] = useState(false);

  // Sayfa açıldığında mevcut ayarı backend'den çekebilirsin
  useEffect(() => {
    fetch('http://localhost:5001/api/user/1') // Kullanıcı bilgilerini getiren endpoint
      .then(res => res.json())
      .then(data => {
        if (data.defaultOrderAmount) {
          setOrderAmount(data.defaultOrderAmount);
        }
      })
      .catch(err => console.error("Ayar çekme hatası:", err));
  }, []);

  // 1. Veritabanını Sıfırlama
  const handleResetDatabase = async () => {
    if (window.confirm("DİKKAT! Tüm işlem geçmişi, portföy ve cüzdan hareketleri silinecek. Emin misiniz?")) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5001/api/settings/reset', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 1 }) 
        });
        
        if (response.ok) {
          alert("Veriler başarıyla sıfırlandı. Cüzdan bakiyesi 10.000$ olarak güncellendi.");
          window.location.reload();
        }
      } catch (err) {
        alert("Sıfırlama sırasında hata oluştu.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 2. Alım Tutarını Kaydetme
  const handleSaveAmount = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/settings/update-amount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, amount: orderAmount })
      });

      if (response.ok) {
        alert(`Alım tutarı ${orderAmount}$ olarak güncellendi!`);
      }
    } catch (err) {
      alert("Güncelleme başarısız.");
    }
  };

  return (
    <S.SettingsContainer>
      <S.Title>Sistem Ayarları</S.Title>

      {/* Bot Ayarları Bölümü */}
      <S.SettingsSection>
        <S.SectionTitle>Bot İşlem Ayarları</S.SectionTitle>
        <S.Description>
          Botun bir "AL" sinyali aldığında her işlem için harcayacağı sabit tutarı belirleyin.
        </S.Description>
        
        <S.InputGroup>
          <label>İşlem Başına Tutar (USD)</label>
          <input 
            type="number" 
            value={orderAmount} 
            onChange={(e) => setOrderAmount(Number(e.target.value))}
            min="1"
          />
          <S.SaveButton onClick={handleSaveAmount}>
            Miktarı Kaydet
          </S.SaveButton>
        </S.InputGroup>
      </S.SettingsSection>

      {/* Tehlikeli Bölge */}
      <S.DangerZone>
        <S.SectionTitle style={{ color: '#ef4444' }}>Tehlikeli Bölge</S.SectionTitle>
        <S.Description>
          Aşağıdaki işlem tüm portföyünüzü, işlem geçmişinizi ve cüzdan hareketlerinizi kalıcı olarak siler. 
          Kullanıcı hesabınız silinmez ancak bakiyeniz başlangıç değerine döner.
        </S.Description>
        
        <S.ResetButton onClick={handleResetDatabase} disabled={loading}>
          {loading ? "Sıfırlanıyor..." : "Veritabanını Sıfırla"}
        </S.ResetButton>
      </S.DangerZone>
    </S.SettingsContainer>
  );
};

export default Settings;