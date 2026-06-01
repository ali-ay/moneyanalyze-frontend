import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../../services/apiClient';
import { 
  AuthContainer, AuthBox, AuthTitle, AuthSubtitle, AuthForm, 
  InputGroup, SubmitButton, ErrorMessage 
} from '../../../components/ui/Auth.styles';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) return setError('Şifreler eşleşmiyor.');
    if (!token) return setError('Geçersiz sıfırlama anahtarı.');

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/reset-password', { token, password });
      alert('Şifreniz başarıyla güncellendi! Giriş yapabilirsiniz.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthBox>
        <AuthTitle>Yeni Şifre Belirle</AuthTitle>
        <AuthSubtitle>Lütfen yeni şifrenizi giriniz.</AuthSubtitle>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AuthForm onSubmit={handleSubmit}>
          <InputGroup>
            <label>Yeni Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </InputGroup>
          <InputGroup>
            <label>Şifre Tekrar</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </InputGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </SubmitButton>
        </AuthForm>
      </AuthBox>
    </AuthContainer>
  );
};

export default ResetPassword;
