import { useNavigate } from 'react-router-dom';
import * as S from './Navbar.styles';
import { Button } from '../../../../components/ui/Button';

const Navbar = () => {
  const navigate = useNavigate();
  return (
    <S.Navbar>
        <S.Logo onClick={() => navigate('/')}>MoneyAnalyze</S.Logo>
        <S.NavButtons>
            <S.ActionButton onClick={() => navigate('/login')}>
              Giriş Yap
            </S.ActionButton>
        </S.NavButtons>
    </S.Navbar>)};

export default Navbar;