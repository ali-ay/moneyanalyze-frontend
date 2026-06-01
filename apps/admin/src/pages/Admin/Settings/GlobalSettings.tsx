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
    recaptchaSecretKey: '',
    lastStockSync: ''
  });
  const [emailTemplates, setEmailTemplates] = useState<any[]>([]);
  const [emailSaving, setEmailSaving] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [users, setUsers] = useState<any[]>([]);
  const [manualMail, setManualMail] = useState({
    toType: 'user', // 'user' or 'manual'
    selectedUser: '',
    manualEmail: '',
    subject: '',
    content: ''
  });
  const [mailSending, setMailSending] = useState(false);

  useEffect(() => {
    fetchSettings();
    fetchEmailTemplates();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Users fetch error:", err);
    }
  };

  const handleSendManualMail = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipient = manualMail.toType === 'user' ? manualMail.selectedUser : manualMail.manualEmail;
    
    if (!recipient || !manualMail.subject || !manualMail.content) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setMailSending(true);
    try {
      await api.post('/admin/send-email', {
        to: recipient,
        subject: manualMail.subject,
        content: manualMail.content
      });
      alert('E-posta başarıyla gönderildi.');
      setManualMail(prev => ({ ...prev, manualEmail: '', subject: '', content: '' }));
    } catch (err: any) {
      alert('Gönderim hatası: ' + (err.response?.data?.message || err.message));
    } finally {
      setMailSending(false);
    }
  };

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
        <PageTitle>Hızlı E-posta Gönder</PageTitle>
        <PageSubtitle>Kayıtlı kullanıcılara veya harici adreslere anlık mail gönderin.</PageSubtitle>
      </PageHeader>

      <MetricCard style={{ padding: '24px', marginBottom: '40px' }}>
        <form onSubmit={handleSendManualMail}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '20px' }}>
            <InputGroup>
              <label>Alıcı Tipi</label>
              <select 
                value={manualMail.toType} 
                onChange={(e) => setManualMail(prev => ({ ...prev, toType: e.target.value }))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="user">Sistem Kullanıcısı</option>
                <option value="manual">Manuel E-posta</option>
              </select>
            </InputGroup>

            {manualMail.toType === 'user' ? (
              <InputGroup>
                <label>Kullanıcı Seçin</label>
                <select 
                  value={manualMail.selectedUser} 
                  onChange={(e) => setManualMail(prev => ({ ...prev, selectedUser: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="">Seçiniz...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.email}>{u.username} ({u.email})</option>
                  ))}
                </select>
              </InputGroup>
            ) : (
              <InputGroup>
                <label>E-posta Adresi</label>
                <input 
                  type="email" 
                  value={manualMail.manualEmail}
                  onChange={(e) => setManualMail(prev => ({ ...prev, manualEmail: e.target.value }))}
                  placeholder="ornek@mail.com"
                />
              </InputGroup>
            )}
          </div>

          <InputGroup style={{ marginBottom: '16px' }}>
            <label>E-posta Konusu</label>
            <input 
              value={manualMail.subject}
              onChange={(e) => setManualMail(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Mail başlığı..."
            />
          </InputGroup>

          <InputGroup>
            <label>İçerik (HTML destekli)</label>
            <S.TextArea 
              style={{ height: '200px' }}
              value={manualMail.content}
              onChange={(e) => setManualMail(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Merhaba, mesajınız buraya..."
            />
          </InputGroup>

          <SubmitButton 
            type="submit" 
            disabled={mailSending}
            style={{ marginTop: '20px', width: 'auto', padding: '10px 40px' }}
            as="button"
          >
            {mailSending ? 'Gönderiliyor...' : 'E-postayı Gönder'}
          </SubmitButton>
        </form>
      </MetricCard>

      <PageHeader style={{ marginTop: '40px' }}>
        <PageTitle>Email Şablonları</PageTitle>
        <PageSubtitle>Sistem tarafından gönderilen maillerin içeriğini buradan düzenleyin.</PageSubtitle>
      </PageHeader>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
        {['WELCOME', 'PASSWORD_RESET'].map(type => {
          const template = emailTemplates.find(t => t.id === type);
          const isWelcome = type === 'WELCOME';
          
          return (
            <MetricCard key={type} style={{ padding: '24px' }}>
              <S.SectionTitle style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{isWelcome ? 'Hoş Geldiniz Maili' : 'Şifre Sıfırlama Maili'}</span>
                {!template && <span style={{ fontSize: '10px', background: '#ff9800', color: 'white', padding: '2px 8px', borderRadius: '4px' }}>Henüz Oluşturulmadı</span>}
              </S.SectionTitle>
              
              <div style={{ marginBottom: '12px', fontSize: '13px', color: '#666', background: '#fdf3e8', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ffcc80' }}>
                <strong>Kullanılabilir Değişkenler:</strong> {isWelcome ? '{{username}}' : '{{username}}, {{resetUrl}}'}
              </div>

              <InputGroup style={{ marginBottom: '16px' }}>
                <label>Konu (Subject)</label>
                <input
                  value={template?.subject || (isWelcome ? 'Hoş Geldiniz' : 'Şifre Sıfırlama')}
                  onChange={(e) => {
                    if (!template) return;
                    handleTemplateChange(type, 'subject', e.target.value);
                  }}
                  disabled={!template}
                />
              </InputGroup>

              <InputGroup>
                <label>İçerik (HTML)</label>
                <S.TextArea
                  style={{ height: '300px', fontFamily: 'monospace' }}
                  value={template?.content || (isWelcome ? '<h1>Merhaba {{username}}</h1>' : '<h1>Şifre Sıfırla: {{resetUrl}}</h1>')}
                  onChange={(e) => {
                    if (!template) return;
                    handleTemplateChange(type, 'content', e.target.value);
                  }}
                  disabled={!template}
                />
              </InputGroup>

              <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
                {template ? (
                  <SubmitButton 
                    onClick={() => handleEmailTemplateSave(template.id, template.subject, template.content)}
                    disabled={emailSaving === template.id}
                    style={{ width: 'auto', padding: '10px 30px' }}
                    as="button"
                  >
                    {emailSaving === template.id ? 'Kaydediliyor...' : 'Şablonu Güncelle'}
                  </SubmitButton>
                ) : (
                  <SubmitButton 
                    onClick={() => handleEmailTemplateSave(type, isWelcome ? 'Hoş Geldiniz' : 'Şifre Sıfırlama', isWelcome ? '<h1>Merhaba {{username}}</h1>' : '<h1>Şifre Sıfırla: {{resetUrl}}</h1>')}
                    disabled={emailSaving === type}
                    style={{ width: 'auto', padding: '10px 30px', background: '#4caf50' }}
                    as="button"
                  >
                    {emailSaving === type ? 'Oluşturuluyor...' : 'Şablonu Şimdi Oluştur'}
                  </SubmitButton>
                )}
              </div>
            </MetricCard>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default GlobalSettings;
