import { Link } from 'react-router-dom';
import { useRegisterLogic } from './logic';
import { 
  AuthContainer, AuthBox, AuthTitle, AuthSubtitle, AuthForm, 
  InputGroup, SubmitButton, ErrorMessage, FooterText 
} from '../../../components/ui/Auth.styles';
import styled from 'styled-components';

const SuccessMessage = styled.div`
  background: rgba(15, 157, 88, 0.1);
  color: #0F9D58;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 600;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Register = () => {
  const {
    formData,
    handleChange,
    error,
    success,
    isLoading,
    handleRegister
  } = useRegisterLogic();

  return (
    <AuthContainer>
      <AuthBox style={{ maxWidth: '600px' }}>
        <AuthTitle>Kayıt Ol</AuthTitle>
        <AuthSubtitle>Platforma katılarak botları kullanmaya başla</AuthSubtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...</SuccessMessage>}

        <AuthForm onSubmit={handleRegister}>
          <FormGrid>
            <InputGroup>
              <label>Ad</label>
              <input name="firstName" placeholder="Adınız" value={formData.firstName} onChange={handleChange} required />
            </InputGroup>
            <InputGroup>
              <label>Soyad</label>
              <input name="lastName" placeholder="Soyadınız" value={formData.lastName} onChange={handleChange} required />
            </InputGroup>
          </FormGrid>

          <InputGroup>
            <label>E-Posta Adresi</label>
            <input type="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
          </InputGroup>

          <FormGrid>
            <InputGroup>
              <label>Kullanıcı Adı</label>
              <input name="username" placeholder="Kullanıcı adınız" value={formData.username} onChange={handleChange} required />
            </InputGroup>
            <InputGroup>
              <label>Şifre</label>
              <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
            </InputGroup>
          </FormGrid>

          <InputGroup>
            <label>Telefon Numarası</label>
            <input name="phone" placeholder="05XX XXX XX XX" value={formData.phone} onChange={handleChange} />
          </InputGroup>

          <InputGroup>
            <label>Adres</label>
            <textarea 
              name="address" 
              placeholder="Açık adresiniz" 
              value={formData.address} 
              onChange={handleChange as any}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '80px',
                fontFamily: 'inherit'
              }}
            />
          </InputGroup>

          <SubmitButton type="submit" disabled={isLoading || success}>
            {isLoading ? 'Hesap Oluşturuluyor...' : 'Kayıt Ol'}
          </SubmitButton>
        </AuthForm>

        <FooterText>
          Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
        </FooterText>
      </AuthBox>
    </AuthContainer>
  );
};

export default Register;