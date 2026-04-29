import { useProfileLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../../components/ui/Layout.styles';
import { User, Key, Save, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { useMarketMode } from '../../../context/MarketModeContext';
import styled from 'styled-components';

// ─── Styled Components ─────────────────────────────────

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme?.spacing?.lg || '24px'};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
`;

const SectionIcon = styled.div<{ $color?: string }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$color || 'rgba(26, 115, 232, 0.1)'};
  color: ${props => props.$color === 'rgba(244, 180, 0, 0.1)' ? '#F4B400' : (props.theme?.colors?.primary || '#1A73E8')};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin: 0;
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  background: transparent;
  transition: ${props => props.theme?.transitions?.fast || 'all 0.2s ease'};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    box-shadow: 0 0 0 3px rgba(26, 115, 232, 0.15);
  }

  &::placeholder {
    color: #9AA0A6;
  }

  &:disabled {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    cursor: not-allowed;
  }
`;

const InfoValue = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
`;

const RoleBadge = styled.span<{ $isAdmin?: boolean }>`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$isAdmin ? 'rgba(219, 68, 55, 0.1)' : 'rgba(26, 115, 232, 0.1)'};
  color: ${props => props.$isAdmin ? (props.theme?.colors?.danger || '#DB4437') : (props.theme?.colors?.primary || '#1A73E8')};
`;

const SaveButton = styled.button`
  background: ${props => props.theme?.colors?.primary || '#1A73E8'};
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: ${props => props.theme?.transitions?.fast || 'all 0.2s ease'};
  margin-top: ${props => props.theme?.spacing?.lg || '24px'};

  &:hover {
    background: ${props => props.theme?.colors?.primaryHover || '#174EA6'};
    transform: translateY(-1px);
    box-shadow: ${props => props.theme?.shadows?.sm || '0 1px 3px rgba(0,0,0,0.1)'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Alert = styled.div<{ $type: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: ${props => props.theme?.spacing?.lg || '24px'};
  background: ${props => props.$type === 'success' ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
  color: ${props => props.$type === 'success' ? (props.theme?.colors?.success || '#0F9D58') : (props.theme?.colors?.danger || '#DB4437')};
  border: 1px solid ${props => props.$type === 'success' ? 'rgba(15, 157, 88, 0.2)' : 'rgba(219, 68, 55, 0.2)'};
`;

const KeyHint = styled.p`
  font-size: 0.75rem;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  margin: 8px 0 0;
  line-height: 1.4;
`;

// ─── Component ──────────────────────────────────────────

const ProfilePage = () => {
  const {
    profile, loading, saving, error, success,
    firstName, setFirstName,
    lastName, setLastName,
    binanceApiKey, setBinanceApiKey,
    binanceSecretKey, setBinanceSecretKey,
    tradingMode, setTradingMode,
    updateProfile, resetAccount,
    runAIScan,
    progress,
  } = useProfileLogic();
  const { mode, setMode } = useMarketMode();

  if (loading) return <LoadingState>Profil yükleniyor...</LoadingState>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile();
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Profil Bilgileri</PageTitle>
        <PageSubtitle>Kişisel bilgilerinizi ve Binance API bağlantınızı yönetin.</PageSubtitle>
      </PageHeader>

      {success && (
        <Alert $type="success">
          <CheckCircle size={18} /> {success}
        </Alert>
      )}
      {error && (
        <Alert $type="error">
          <AlertCircle size={18} /> {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <ProfileGrid>
          {/* Sol: Kişisel Bilgiler */}
          <Section>
            <SectionHeader>
              <SectionIcon>
                <User size={20} />
              </SectionIcon>
              <SectionTitle>Kişisel Bilgiler</SectionTitle>
            </SectionHeader>

            <InputGroup>
              <Label>Kullanıcı Adı</Label>
              <InfoValue>{profile?.username || '--'}</InfoValue>
            </InputGroup>

            <InputGroup>
              <Label>Ad</Label>
              <Input
                type="text"
                placeholder="Adınızı girin"
                value={firstName || ''}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label>Soyad</Label>
              <Input
                type="text"
                placeholder="Soyadınızı girin"
                value={lastName || ''}
                onChange={(e) => setLastName(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label>Hesap Tipi</Label>
              <div>
                <RoleBadge $isAdmin={profile?.role === 'ADMIN'}>
                  {profile?.role === 'ADMIN' ? 'Yönetici' : 'Standart Kullanıcı'}
                </RoleBadge>
              </div>
            </InputGroup>

            <InputGroup>
              <Label>Kayıt Tarihi</Label>
              <InfoValue>
                {profile?.createdAt 
                  ? new Date(profile.createdAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' })
                  : '--'}
              </InfoValue>
            </InputGroup>

            <div style={{ margin: '24px 0', borderTop: '1px dashed #DADCE0' }} />

            <SectionHeader style={{ border: 'none', marginBottom: 12 }}>
              <SectionIcon $color="rgba(15, 157, 88, 0.1)">
                <TrendingUp size={20} color="#0F9D58" />
              </SectionIcon>
              <SectionTitle>Pazar Tercihi</SectionTitle>
            </SectionHeader>

            <InputGroup>
              <Label>Varsayılan Pazar</Label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setMode('stock')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: mode === 'stock' ? '#1A73E8' : '#DADCE0',
                    background: mode === 'stock' ? 'rgba(26, 115, 232, 0.05)' : 'transparent',
                    color: mode === 'stock' ? '#1A73E8' : '#5F6368',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <TrendingUp size={16} /> Borsa (BIST)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('crypto')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: mode === 'crypto' ? '#F4B400' : '#DADCE0',
                    background: mode === 'crypto' ? 'rgba(244, 180, 0, 0.05)' : 'transparent',
                    color: mode === 'crypto' ? '#F4B400' : '#5F6368',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                >
                  <Zap size={16} /> Kripto Para
                </button>
              </div>
              <KeyHint>Uygulama açıldığında hangi pazarın verilerini görmek istediğinizi seçin.</KeyHint>
            </InputGroup>
          </Section>

          {/* Sağ: Binance API Bağlantısı */}
          <Section>
            <SectionHeader>
              <SectionIcon $color="rgba(244, 180, 0, 0.1)">
                <Key size={20} />
              </SectionIcon>
              <SectionTitle>Binance API & İşlem Modu</SectionTitle>
            </SectionHeader>

            <InputGroup>
              <Label>İşlem Modu</Label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button
                  type="button"
                  onClick={() => setTradingMode('SIMULATION')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: tradingMode === 'SIMULATION' ? '#1A73E8' : '#DADCE0',
                    background: tradingMode === 'SIMULATION' ? 'rgba(26, 115, 232, 0.05)' : 'transparent',
                    color: tradingMode === 'SIMULATION' ? '#1A73E8' : '#5F6368',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Simülasyon Modu
                </button>
                <button
                  type="button"
                  onClick={() => setTradingMode('LIVE')}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '10px',
                    border: '2px solid',
                    borderColor: tradingMode === 'LIVE' ? '#159D58' : '#DADCE0',
                    background: tradingMode === 'LIVE' ? 'rgba(15, 157, 88, 0.05)' : 'transparent',
                    color: tradingMode === 'LIVE' ? '#159D58' : '#5F6368',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Live Mode (Gerçek)
                </button>
              </div>
              <KeyHint style={{ color: tradingMode === 'LIVE' ? '#DB4437' : '#5F6368', fontWeight: tradingMode === 'LIVE' ? '600' : '400' }}>
                {tradingMode === 'LIVE' 
                  ? '⚠️ DİKKAT: Live modda işlemler gerçek Binance bakiyeniz ile yapılır!' 
                  : 'ℹ️ Simülasyon modunda sanal bakiyeniz (10.000 USDT) kullanılır.'}
              </KeyHint>
            </InputGroup>

            <div style={{ margin: '24px 0', borderTop: '1px dashed #DADCE0' }} />

            <InputGroup>
              <Label>API Key</Label>
              <Input
                type="text"
                placeholder={profile?.binanceApiKey || 'Henüz tanımlanmadı'}
                value={binanceApiKey || ''}
                onChange={(e) => setBinanceApiKey(e.target.value)}
              />
              <KeyHint>Mevcut: {profile?.binanceApiKey || 'Tanımsız'}</KeyHint>
            </InputGroup>

            <InputGroup>
              <Label>Secret Key</Label>
              <Input
                type="password"
                placeholder={profile?.binanceSecretKey || 'Henüz tanımlanmadı'}
                value={binanceSecretKey || ''}
                onChange={(e) => setBinanceSecretKey(e.target.value)}
              />
              <KeyHint>Mevcut: {profile?.binanceSecretKey || 'Tanımsız'}</KeyHint>
            </InputGroup>

            <KeyHint style={{ marginTop: 20, fontSize: '0.8125rem', color: '#F4B400' }}>
              ⚠️ API Key'leriniz güvenli bir şekilde şifrelenerek saklanır. Sadece yeni bir key girdiğinizde güncellenir.
            </KeyHint>
          </Section>

          {/* Yeni: AI Otomasyon Kontrolü */}
          <Section style={{ gridColumn: '1 / -1' }}>
            <SectionHeader>
              <SectionIcon $color="rgba(167, 107, 245, 0.1)">
                <Zap size={20} color="#A76BF5" fill="#A76BF5" />
              </SectionIcon>
              <SectionTitle>Yapay Zeka Otomasyon Kontrolü</SectionTitle>
            </SectionHeader>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#202124', marginBottom: '4px' }}>
                  Manuel Piyasa Taraması
                </p>
                <p style={{ fontSize: '0.8125rem', color: '#5F6368', lineHeight: '1.4' }}>
                  Tüm BIST hisselerini anlık fiyatlarla tarar. 100+ skor alan hisseleri otomatik olarak İzleme Listenize ekler ve sinyal takibini başlatır.
                </p>
              </div>
              
              <button
                type="button"
                onClick={runAIScan}
                disabled={saving || (progress?.isRunning ?? false)}
                style={{
                  background: (saving || progress?.isRunning) ? '#DADCE0' : '#A76BF5',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  fontSize: '0.875rem',
                  fontWeight: '700',
                  cursor: (saving || progress?.isRunning) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                  boxShadow: (saving || progress?.isRunning) ? 'none' : '0 4px 10px rgba(167, 107, 245, 0.3)'
                }}
              >
                <Zap size={16} fill="white" />
                {progress?.isRunning ? 'Tarama Sürüyor...' : 'Şimdi Taramayı Başlat'}
              </button>
            </div>

            {progress?.isRunning && (
              <div style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#5F6368', marginBottom: '6px' }}>
                  <span>{progress.message}</span>
                  <span>%{Math.round((progress.current / (progress.total || 1)) * 100)}</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#F1F3F4', borderRadius: '4px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${(progress.current / (progress.total || 1)) * 100}%`, 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #A76BF5, #1A73E8)',
                      transition: 'width 0.4s ease'
                    }} 
                  />
                </div>
              </div>
            )}
            
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: 'rgba(26, 115, 232, 0.05)', 
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#1A73E8',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={14} />
              Sistem her saat başı otomatik tarama yapacak şekilde yapılandırıldı.
            </div>
          </Section>
        </ProfileGrid>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
          <SaveButton type="submit" disabled={saving || (progress?.isRunning ?? false)}>
            <Save size={18} />
            {saving && !progress?.isRunning ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </SaveButton>

          <button
            type="button"
            onClick={resetAccount}
            disabled={saving || (progress?.isRunning ?? false)}
            style={{
              background: 'transparent',
              color: '#DB4437',
              border: '1px solid #DB4437',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '18px'
            }}
          >
            <AlertCircle size={16} /> Hesabı Sıfırla
          </button>
        </div>
      </form>
    </PageContainer>
  );
};

export default ProfilePage;