import { useProfileLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState } from '../../../components/ui/Layout.styles';
import { User, Key, Save, CheckCircle, AlertCircle, TrendingUp, Zap } from 'lucide-react';
import { useMarketMode } from '../../../context/MarketModeContext';
import styled from 'styled-components';
import * as S from './Profile.styles';

// ─── Styled Components ─────────────────────────────────

import { useAuth } from '../../../app/providers/AuthContext';

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme?.spacing?.lg || '24px'};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Section = styled.div`
  background: ${props => props.theme?.colors?.surface || '#FFFFFF'};
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 12px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  @media (max-width: 768px) {
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
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

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    svg { width: 16px; height: 16px; }
  }
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 16px;
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

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
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

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.8125rem;
  }
`;

const InfoValue = styled.div`
  padding: 12px 16px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 0.8125rem;
  }
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

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
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
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const {
    profile, loading, saving, error, success,
    firstName, setFirstName,
    lastName, setLastName,
    binanceApiKey, setBinanceApiKey,
    binanceSecretKey, setBinanceSecretKey,
    tradingMode, setTradingMode,
    updateProfile, resetAccount,
    runAIScan, runFullHistorySync, runTailscaleSync,
    progress, historyProgress, tailscaleSyncProgress,
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

            <S.Divider />

            <S.SectionHeaderBorderless>
              <SectionIcon $color="rgba(15, 157, 88, 0.1)">
                <TrendingUp size={20} color="#0F9D58" />
              </SectionIcon>
              <SectionTitle>Pazar Tercihi</SectionTitle>
            </S.SectionHeaderBorderless>

            <InputGroup>
              <Label>Varsayılan Pazar</Label>
              <S.MarketModeContainer>
                <S.MarketModeButton
                  type="button"
                  onClick={() => setMode('stock')}
                  $active={mode === 'stock'}
                >
                  <TrendingUp size={16} /> Borsa (BIST)
                </S.MarketModeButton>
                <S.MarketModeButton
                  type="button"
                  onClick={() => setMode('crypto')}
                  $active={mode === 'crypto'}
                  $color="#F4B400"
                >
                  <Zap size={16} /> Kripto Para
                </S.MarketModeButton>
              </S.MarketModeContainer>
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
              <S.TradingModeContainer>
                <S.TradingModeButton
                  type="button"
                  onClick={() => setTradingMode('SIMULATION')}
                  $isSimulation={tradingMode === 'SIMULATION'}
                  $isLive={false}
                >
                  Simülasyon Modu
                </S.TradingModeButton>
                <S.TradingModeButton
                  type="button"
                  onClick={() => setTradingMode('LIVE')}
                  $isSimulation={false}
                  $isLive={tradingMode === 'LIVE'}
                >
                  Live Mode (Gerçek)
                </S.TradingModeButton>
              </S.TradingModeContainer>
              <S.TradingModeHint $isLive={tradingMode === 'LIVE'}>
                {tradingMode === 'LIVE'
                  ? '⚠️ DİKKAT: Live modda işlemler gerçek Binance bakiyeniz ile yapılır!'
                  : 'ℹ️ Simülasyon modunda sanal bakiyeniz (10.000 USDT) kullanılır.'}
              </S.TradingModeHint>
            </InputGroup>

            <S.Divider />

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

            <S.APIWarningHint>
              ⚠️ API Key'leriniz güvenli bir şekilde şifrelenerek saklanır. Sadece yeni bir key girdiğinizde güncellenir.
            </S.APIWarningHint>
          </Section>

          {/* AI Otomasyon Kontrolü - Sadece Admin */}
          {isAdmin && (
            <Section>
              <SectionHeader>
                <SectionIcon $color="rgba(167, 107, 245, 0.1)">
                  <Zap size={20} color="#A76BF5" fill="#A76BF5" />
                </SectionIcon>
                <SectionTitle>Yapay Zeka Otomasyon Kontrolü</SectionTitle>
              </SectionHeader>

              <S.AIAutomationContainer>
                <div>
                  <S.SectionDescription>
                    Manuel Piyasa Taraması
                  </S.SectionDescription>
                  <S.SectionNote>
                    Tüm BIST hisselerini anlık fiyatlarla tarar. 100+ skor alan hisseleri otomatik olarak İzleme Listenize ekler.
                  </S.SectionNote>
                </div>

                <S.AutomationButton
                  type="button"
                  onClick={runAIScan}
                  disabled={saving || (progress?.isRunning ?? false)}
                  $color="#A76BF5"
                  $disabled={saving || (progress?.isRunning ?? false)}
                >
                  <Zap size={16} fill="white" />
                  {progress?.isRunning ? 'Tarama Sürüyor...' : 'Şimdi Taramayı Başlat'}
                </S.AutomationButton>

                {progress?.isRunning && (
                  <S.ProgressSection>
                    <S.ProgressHeader>
                      <span>{progress.message}</span>
                      <span>%{Math.round((progress.current / (progress.total || 1)) * 100)}</span>
                    </S.ProgressHeader>
                    <S.ProgressBarContainer>
                      <S.GradientProgressBar
                        $percent={(progress.current / (progress.total || 1)) * 100}
                        $color="#A76BF5"
                      />
                    </S.ProgressBarContainer>
                  </S.ProgressSection>
                )}
              </S.AIAutomationContainer>
            </Section>
          )}

          {/* Genel Veri Yönetimi - Sadece Admin */}
          {isAdmin && (
            <Section>
              <SectionHeader>
                <SectionIcon $color="rgba(15, 157, 88, 0.1)">
                  <TrendingUp size={20} color="#0F9D58" />
                </SectionIcon>
                <SectionTitle>Genel Veri Yönetimi</SectionTitle>
              </SectionHeader>

              <S.AIAutomationContainer>
                <div>
                  <S.SectionDescription>
                    Manuel Fiyat Senkronizasyonu (Air {'>'} DB)
                  </S.SectionDescription>
                  <S.SectionNote>
                    MacBook Air'den tüm BIST fiyatlarını anlık olarak çeker ve veritabanına kaydeder.
                  </S.SectionNote>
                </div>

                <S.AutomationButton
                  type="button"
                  onClick={runTailscaleSync}
                  disabled={saving || (tailscaleSyncProgress?.isSyncing ?? false)}
                  $color="#1A73E8"
                  $disabled={saving || (tailscaleSyncProgress?.isSyncing ?? false)}
                >
                  <Zap size={16} fill="white" />
                  {tailscaleSyncProgress?.isSyncing ? 'Güncelleniyor...' : 'Fiyatları Şimdi Güncelle'}
                </S.AutomationButton>

                {tailscaleSyncProgress?.isSyncing && (
                  <S.ProgressSection>
                    <S.ProgressHeader>
                      <span>{tailscaleSyncProgress.message} ({tailscaleSyncProgress.current}/{tailscaleSyncProgress.total})</span>
                      <span>%{Math.round((tailscaleSyncProgress.current / (tailscaleSyncProgress.total || 1)) * 100)}</span>
                    </S.ProgressHeader>
                    <S.ProgressBarContainer>
                      <S.GradientProgressBar
                        $percent={(tailscaleSyncProgress.current / (tailscaleSyncProgress.total || 1)) * 100}
                        $color="#1A73E8"
                      />
                    </S.ProgressBarContainer>
                  </S.ProgressSection>
                )}
              </S.AIAutomationContainer>

              <S.Divider />

              <S.AIAutomationContainer>
                <div>
                  <S.SectionDescription>
                    Tüm Geçmiş Verileri Eşitle (1900+)
                  </S.SectionDescription>
                  <S.SectionNote>
                    Tüm BIST hisselerinin tarihsel verilerini 1900 yılından itibaren tarar ve eksikleri veritabanına kaydeder. Bu işlem uzun sürebilir.
                  </S.SectionNote>
                </div>

                <S.AutomationButton
                  type="button"
                  onClick={runFullHistorySync}
                  disabled={saving || (historyProgress?.isSyncing ?? false)}
                  $color="#0F9D58"
                  $disabled={saving || (historyProgress?.isSyncing ?? false)}
                >
                  <TrendingUp size={16} />
                  {historyProgress?.isSyncing ? 'Eşitleniyor...' : 'Tüm Geçmişi Eşitle'}
                </S.AutomationButton>

                {historyProgress?.isSyncing && (
                  <S.ProgressSection>
                    <S.ProgressHeader>
                      <span>Eşitleniyor: <strong>{historyProgress.currentSymbol}</strong> ({historyProgress.current}/{historyProgress.total})</span>
                      <span>%{historyProgress.percent}</span>
                    </S.ProgressHeader>
                    <S.ProgressBarContainer>
                      <S.GradientProgressBar
                        $percent={historyProgress.percent}
                        $color="#0F9D58"
                      />
                    </S.ProgressBarContainer>
                  </S.ProgressSection>
                )}
              </S.AIAutomationContainer>
            </Section>
          )}
        </ProfileGrid>

        <S.ButtonGroup>
          <SaveButton type="submit" disabled={saving || (progress?.isRunning ?? false)}>
            <Save size={18} />
            {saving && !progress?.isRunning ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </SaveButton>

          <S.ResetButton
            type="button"
            onClick={resetAccount}
            disabled={saving || (progress?.isRunning ?? false)}
          >
            <AlertCircle size={16} /> Hesabı Sıfırla
          </S.ResetButton>
        </S.ButtonGroup>
      </form>
    </PageContainer>
  );
};

export default ProfilePage;