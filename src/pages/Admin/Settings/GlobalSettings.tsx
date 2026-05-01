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
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [emailSaving, setEmailSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
    fetchEmailTemplates();
  }, []);

  const fetchEmailTemplates = async () => {
    try {
      const res = await api.get('/admin/email-templates');
      if (res.data.success) {
        setEmailTemplates(res.data.data);
      }
    } catch (err) {
      console.error("Email templates fetch error:", err);
    }
  };

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

  const handleEmailTemplateSave = async (id: string, subject: string, content: string) => {
    setEmailSaving(id);
    try {
      await api.put(`/admin/email-templates/${id}`, { subject, content });
      await fetchEmailTemplates(); // Listeyi güncelle
      alert('Email şablonu güncellendi.');
    } catch (err) {
      alert('Hata oluştu.');
    } finally {
      setEmailSaving(null);
    }
  };

  const handleTemplateChange = (id: string, field: 'subject' | 'content', value: string) => {
    setEmailTemplates(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
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
            <S.SectionTitle>Sistem Durumu</S.SectionTitle>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '16px', 
              background: 'rgba(26, 115, 232, 0.05)', 
              borderRadius: '12px', 
              border: '1px solid rgba(26, 115, 232, 0.1)',
              marginBottom: '24px'
            }}>
               <div style={{ 
                 width: '10px', 
                 height: '10px', 
                 borderRadius: '50%', 
                 background: formData.lastStockSync ? '#28a745' : '#ffc107',
                 boxShadow: formData.lastStockSync ? '0 0 8px #28a745' : 'none'
               }}></div>
               <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1a73e8' }}>Otomatik Tarama Botu:</span>
               <span style={{ fontSize: '0.875rem', color: '#5f6368' }}>
                 {formData.lastStockSync 
                   ? `Son başarılı çalışma: ${new Date(formData.lastStockSync).toLocaleString('tr-TR', {
                       day: '2-digit',
                       month: 'long',
                       year: 'numeric',
                       hour: '2-digit',
                       minute: '2-digit'
                     })}`
                   : 'Bot henüz çalıştırılmadı.'}
               </span>
            </div>
          </S.SectionContainer>

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

      <PageHeader style={{ marginTop: '40px' }}>
        <PageTitle>Email Şablonları</PageTitle>
        <PageSubtitle>Sistem tarafından gönderilen maillerin içeriğini buradan düzenleyin.</PageSubtitle>
      </PageHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        {emailTemplates.length === 0 ? (
          <div style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
            Şablonlar yükleniyor veya henüz oluşturulmamış...
            <button 
              onClick={() => handleEmailTemplateSave('WELCOME', 'Hoş Geldiniz', '<h1>Merhaba {{username}}</h1>')}
              style={{ display: 'block', margin: '10px auto', padding: '8px 16px', background: '#1A73E8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Hoş Geldiniz Şablonu Oluştur
            </button>
            <button 
              onClick={() => handleEmailTemplateSave('PASSWORD_RESET', 'Şifre Sıfırlama', '<h1>Şifre Sıfırla: {{resetUrl}}</h1>')}
              style={{ display: 'block', margin: '10px auto', padding: '8px 16px', background: '#1A73E8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Şifre Sıfırlama Şablonu Oluştur
            </button>
          </div>
        ) : (
          emailTemplates.map(template => (
            <MetricCard key={template.id} style={{ padding: '24px' }}>
              <S.SectionTitle style={{ marginBottom: '16px' }}>
                {template.id === 'WELCOME' ? 'Hoş Geldiniz Maili' : 'Şifre Sıfırlama Maili'}
              </S.SectionTitle>
              
              <div style={{ marginBottom: '12px', fontSize: '13px', color: '#666', background: '#fdf3e8', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ffcc80' }}>
                <strong>Kullanılabilir Değişkenler:</strong> {template.id === 'WELCOME' ? '{{username}}' : '{{resetUrl}}'}
                <br />
                <span style={{ fontSize: '11px' }}>* Bu değişkenleri şablon içinde istediğiniz yere ekleyebilirsiniz.</span>
              </div>

              <InputGroup style={{ marginBottom: '16px' }}>
                <label>Konu (Subject)</label>
                <input
                  value={template.subject}
                  onChange={(e) => handleTemplateChange(template.id, 'subject', e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <label>İçerik (HTML)</label>
                <S.TextArea
                  style={{ height: '300px', fontFamily: 'monospace' }}
                  value={template.content}
                  onChange={(e) => handleTemplateChange(template.id, 'content', e.target.value)}
                />
              </InputGroup>

              <SubmitButton 
                onClick={() => handleEmailTemplateSave(template.id, template.subject, template.content)}
                disabled={emailSaving === template.id}
                style={{ marginTop: '16px', width: 'auto', padding: '10px 30px' }}
                as="button"
              >
                {emailSaving === template.id ? 'Kaydediliyor...' : 'Şablonu Güncelle'}
              </SubmitButton>
            </MetricCard>
          ))
        )}
      </div>
    </PageContainer>
  );
};

export default GlobalSettings;
