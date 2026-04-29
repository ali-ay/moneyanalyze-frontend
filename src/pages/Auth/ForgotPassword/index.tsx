import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/apiClient';
import { 
  AuthContainer, AuthBox, AuthTitle, AuthSubtitle, AuthForm, 
  InputGroup, SubmitButton, ErrorMessage, FooterText 
} from '../../../components/ui/Auth.styles';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setMessage('Şifre sıfırlama bağlantısı e-posta adresinize gönderildi (Geliştirme aşamasında konsola bakınız).');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <AuthTitle>Şifremi Unuttum</AuthTitle>
        <AuthSubtitle>E-posta adresinizi girerek şifrenizi sıfırlayabilirsiniz.</AuthSubtitle>

        {message && <div style={{ color: '#0f9d58', background: '#e6f4ea', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>{message}</div>}
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AuthForm onSubmit={handleSubmit}>
          <InputGroup>
            <label>E-Posta Adresi</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </InputGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
          </SubmitButton>
        </AuthForm>

        <FooterText>
          Hatırladın mı? <Link to="/login">Giriş Yap</Link>
        </FooterText>
      </AuthBox>
    </AuthContainer>
  );
};

export default ForgotPassword;
