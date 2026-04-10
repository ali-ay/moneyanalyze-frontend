import styled from 'styled-components';

const HeaderContainer = styled.header`
  height: 64px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.textMain};
  display: flex;
  align-items: center;
  gap: 8px;
  
  span { color: ${(props) => props.theme.colors.primary}; }
`;

const Nav = styled.nav`
  display: flex;
  gap: 32px;
  
  a {
    color: ${(props) => props.theme.colors.textSecondary};
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s;
    &:hover { color: ${(props) => props.theme.colors.primary}; }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 14px;
  background-color: ${(props) => (props.$primary ? props.theme.colors.primary : 'transparent')};
  color: ${(props) => (props.$primary ? '#fff' : props.theme.colors.primary)};
  border: ${(props) => (props.$primary ? 'none' : `1px solid ${props.theme.colors.border}`)};
  
  &:hover { opacity: 0.9; }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Logo>money<span>analyze</span></Logo>
      <Nav>
        <a href="#">Piyasalar</a>
        <a href="#">Analizler</a>
        <a href="#">Hakkımızda</a>
      </Nav>
      <ActionButtons>
        <button style={{background:'none', color:'#5f6368', marginRight:'10px'}}>Giriş Yap</button>
        <Button $primary>Kayıt Ol</Button>
      </ActionButtons>
    </HeaderContainer>
  );
};

export default Header;