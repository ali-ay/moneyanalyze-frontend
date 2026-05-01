import { useNavigate } from 'react-router-dom';
import * as S from './Navbar.styles';
import { Button } from '../../../../components/ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <S.Navbar>
        <S.Logo onClick={() => navigate('/')}>MoneyAnalyze</S.Logo>
        <S.NavButtons>
            <button 
              onClick={() => navigate('/login')}
              style={{ 
                background: 'transparent', 
                border: 'none', 
                fontWeight: 800, 
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Giriş Yap
            </button>
            <button 
              onClick={() => navigate('/register')}
              style={{ 
                background: '#171717', 
                color: 'white',
                border: 'none', 
                fontWeight: 800, 
                cursor: 'pointer',
                padding: '12px 24px',
                borderRadius: '99px',
                fontSize: '1rem'
              }}
            >
              Hemen Başla
            </button>
        </S.NavButtons>
    </S.Navbar>)};

export default Navbar;