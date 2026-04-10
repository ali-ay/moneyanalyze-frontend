import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import * as S from './Register.styles';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await api.post('/auth/register', { email, password });
      setSuccess(true);
      // 2 saniye sonra login sayfasına yönlendir
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <S.Container>
      <S.RegisterBox>
        <S.Title>Hesap Oluştur</S.Title>
        <S.Subtitle>MoneyAnalyze dünyasına katıl</S.Subtitle>
        
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        {success && <S.SuccessMessage>Kayıt başarılı! Yönlendiriliyorsunuz...</S.SuccessMessage>}

        <S.Form onSubmit={handleRegister}>
          <S.InputGroup>
            <label>E-posta</label>
            <input 
              type="email" 
              placeholder="örnek@test.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Şifre</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </S.InputGroup>

          <S.RegisterButton type="submit">Kayıt Ol</S.RegisterButton>
        </S.Form>

        <S.FooterText>
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </S.FooterText>
      </S.RegisterBox>
    </S.Container>
  );
};

export default Register;