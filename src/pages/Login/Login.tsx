import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
// Tüm stilleri S objesi olarak içeri alıyoruz
import * as S from './Login.styles'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş başarısız.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <S.Container>
      <S.LoginBox>
        <S.Title>MoneyAnalyze</S.Title>
        <S.Subtitle>Finansal Dashboard'a Giriş Yap</S.Subtitle>
        
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}

        <S.Form onSubmit={handleLogin}>
          <S.InputGroup>
            <label>E-posta</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </S.InputGroup>

          <S.InputGroup>
            <label>Şifre</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </S.InputGroup>

          <S.LoginButton type="submit" disabled={loading}>
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </S.LoginButton>
        </S.Form>

        <S.FooterText>
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </S.FooterText>
      </S.LoginBox>
    </S.Container>
  );
};

export default Login;