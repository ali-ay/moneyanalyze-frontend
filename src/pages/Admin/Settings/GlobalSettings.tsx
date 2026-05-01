import { useEffect, useState } from 'react';
import * as S from './GlobalSettings.styles';
import api from '../../../services/apiClient';
import {
  PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState
} from '../../../components/ui/Layout.styles';
import { MetricCard } from '../../../components/ui/Card.styles';
import { SubmitButton, InputGroup } from '../../../components/ui/Auth.styles';

const GlobalSettings = () => {
  const [formData, setFormData] = useState({
    siteTitle: '',
    siteDescription: '',
    gtmId: '',
    recaptchaSiteKey: '',
    recaptchaSecretKey: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      if (res.data.status === 'success') {
        setFormData(res.data.data || {});
      }
    } catch (err) {
      console.error("Settings fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/admin/settings', formData);
      setMessage({ type: 'success', text: 'Ayarlar başarıyla güncellendi.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Ayarlar güncellenirken bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState>Yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Genel Site Ayarları</PageTitle>
        <PageSubtitle>SEO, GTM ve Güvenlik anahtarlarını buradan yönetin.</PageSubtitle>
      </PageHeader>

      <MetricCard as={S.FormContent}>
        <S.SettingsForm onSubmit={handleSubmit}>
          
          <S.SectionContainer>
            <S.SectionTitle>SEO & Meta Bilgileri</S.SectionTitle>
            <InputGroup>
              <label>Site Başlığı (Title)</label>
              <input
                name="siteTitle"
                value={formData.siteTitle || ''}
                onChange={handleChange}
                placeholder="Örn: MoneyAnalyze | Profesyonel Kripto Botu"
              />
            </InputGroup>
            <InputGroup style={{ marginTop: '16px' }}>
              <label>Site Açıklaması (Description)</label>
              <S.TextArea
                name="siteDescription"
                value={formData.siteDescription || ''}
                onChange={handleChange as any}
                placeholder="Site hakkında kısa açıklama..."
              />
            </InputGroup>
          </S.SectionContainer>

          <S.SectionContainer>
            <S.SectionTitle>Google Entegrasyonları</S.SectionTitle>
            <InputGroup>
              <label>Google Tag Manager (GTM) ID</label>
              <input
                name="gtmId"
                value={formData.gtmId || ''}
                onChange={handleChange}
                placeholder="GTM-XXXXXXX"
              />
            </InputGroup>
          </S.SectionContainer>

          <S.SectionContainer>
            <S.SectionTitle>Google reCAPTCHA v3 Keys</S.SectionTitle>
            <S.RecaptchaKeysGrid>
              <InputGroup>
                <label>Site Key (Public)</label>
                <input
                  name="recaptchaSiteKey"
                  value={formData.recaptchaSiteKey || ''}
                  onChange={handleChange}
                  placeholder="6L..."
                />
              </InputGroup>
              <InputGroup>
                <label>Secret Key (Private)</label>
                <input
                  type="password"
                  name="recaptchaSecretKey"
                  value={formData.recaptchaSecretKey || ''}
                  onChange={handleChange}
                  placeholder="Gizli Anahtar"
                />
              </InputGroup>
            </S.RecaptchaKeysGrid>
          </S.SectionContainer>

          {message.text && (
            <S.Message $type={message.type as 'success' | 'error'}>
              {message.text}
            </S.Message>
          )}

          <SubmitButton type="submit" disabled={saving} as="button">
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </SubmitButton>

        </S.SettingsForm>
      </MetricCard>
    </PageContainer>
  );
};

export default GlobalSettings;
