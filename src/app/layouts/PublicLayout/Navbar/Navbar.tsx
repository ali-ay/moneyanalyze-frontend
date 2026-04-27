import { useNavigate } from 'react-router-dom';
import * as S from './Navbar.styles';
import { Button } from '../../../../components/ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <S.Navbar>
        <S.Logo onClick={() => navigate('/')}>MoneyAnalyze</S.Logo>
        <S.NavButtons>
            <Button $variant="outline" $size="sm" onClick={() => navigate('/login')}>
              Giriş Yap
            </Button>
            <Button $variant="primary" $size="sm" onClick={() => navigate('/register')}>
              Ücretsiz Başla
            </Button>
        </S.NavButtons>
    </S.Navbar>)};

export default Navbar;