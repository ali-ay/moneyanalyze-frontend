import { Link } from 'react-router-dom';
import { useLoginLogic } from './logic';
import { 
  AuthContainer, AuthBox, AuthTitle, AuthSubtitle, AuthForm, 
  InputGroup, SubmitButton, ErrorMessage, FooterText 
} from '../../../components/ui/Auth.styles';

const Login = () => {
  const {
    email, setEmail,
    password, setPassword,
    error, isLoading,
    handleLogin
  } = useLoginLogic();

  return (
    <AuthContainer>
      <AuthBox>
        <AuthTitle>Giriş Yap</AuthTitle>
        <AuthSubtitle>MoneyAnalyze hesabına eriş</AuthSubtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}

        <AuthForm onSubmit={handleLogin}>
          <InputGroup>
            <label>E-Posta Adresi</label>
            <input 
              type="email" 
              placeholder="E-posta adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required 
            />
          </InputGroup>

          <InputGroup>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Şifre</label>
              <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}>Şifremi Unuttum</Link>
            </div>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required 
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </SubmitButton>
        </AuthForm>

        <FooterText>
          Hesabın yok mu? <Link to="/register">Kayıt Ol</Link>
        </FooterText>
      </AuthBox>
    </AuthContainer>
  );
};

export default Login;