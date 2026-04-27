import { useEffect, useState } from 'react';
import api from '../../../services/apiClient';
import { 
  PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState 
} from '../../../components/ui/Layout.styles';
import { MetricCard } from '../../../components/ui/Card.styles';
import { SubmitButton, InputGroup } from '../../../components/ui/Auth.styles';
import styled from 'styled-components';

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 800px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${props => props.theme?.colors?.textMain || '#202124'};
  border-bottom: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding-bottom: 8px;
`;

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

      <MetricCard style={{ padding: '32px' }}>
        <SettingsForm onSubmit={handleSubmit}>
          
          <div>
            <SectionTitle>SEO & Meta Bilgileri</SectionTitle>
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
              <textarea 
                name="siteDescription" 
                value={formData.siteDescription || ''} 
                onChange={handleChange as any}
                placeholder="Site hakkında kısa açıklama..."
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
              />
            </InputGroup>
          </div>

          <div>
            <SectionTitle>Google Entegrasyonları</SectionTitle>
            <InputGroup>
              <label>Google Tag Manager (GTM) ID</label>
              <input 
                name="gtmId" 
                value={formData.gtmId || ''} 
                onChange={handleChange} 
                placeholder="GTM-XXXXXXX"
              />
            </InputGroup>
          </div>

          <div>
            <SectionTitle>Google reCAPTCHA v3 Keys</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
            </div>
          </div>

          {message.text && (
            <div style={{ 
              padding: '12px', 
              borderRadius: '8px', 
              backgroundColor: message.type === 'success' ? '#e6f4ea' : '#fce8e6',
              color: message.type === 'success' ? '#0f9d58' : '#d93025',
              fontWeight: 600
            }}>
              {message.text}
            </div>
          )}

          <SubmitButton type="submit" disabled={saving} style={{ alignSelf: 'flex-start', padding: '12px 32px' }}>
            {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
          </SubmitButton>

        </SettingsForm>
      </MetricCard>
    </PageContainer>
  );
};

export default GlobalSettings;
