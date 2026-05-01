import { useNavigate } from 'react-router-dom';
import * as S from './styles';
import Navbar from '../../app/layouts/PublicLayout/Navbar/Navbar';
import Footer from '../../app/layouts/PublicLayout/Footer/Footer';
import { Button } from '../../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <S.HomeContainer>
      <Navbar />
      <S.HeroSection>
        <S.MainTitle>Kripto Dünyasını <br /> Gerçek Zamanlı Analiz Et</S.MainTitle>
        <S.Description>
          Piyasadaki tüm trendleri anlık olarak takip et, favori paritelerini listene ekle
          ve yatırım stratejini Binance verileriyle güçlendir.
        </S.Description>

        <S.ButtonGroup>
          <Button $variant="primary" $size="lg" onClick={() => navigate('/register')}>
            Hemen Analize Başla
          </Button>
          <Button $variant="outline" $size="lg" onClick={() => window.scrollTo(0, 800)}>
            Nasıl Çalışır?
          </Button>
        </S.ButtonGroup>
      </S.HeroSection>
      <Footer />
    </S.HomeContainer>
  );
};

export default Home;