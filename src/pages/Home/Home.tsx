import { useNavigate } from 'react-router-dom';
import * as S from './Home.styles';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <S.HomeContainer>
      <S.Navbar>
        <S.Logo onClick={() => navigate('/')}>MoneyAnalyze</S.Logo>
        <S.NavButtons>
          {/* $small prop'unu burada ekliyoruz */}
          <S.CTAButton $small onClick={() => navigate('/login')}>
            Giriş Yap
          </S.CTAButton>
          <S.CTAButton $small $primary onClick={() => navigate('/register')}>
            Ücretsiz Başla
          </S.CTAButton>
        </S.NavButtons>
      </S.Navbar>

      <S.HeroSection>
        <S.MainTitle>Kripto Dünyasını <br /> Gerçek Zamanlı Analiz Et</S.MainTitle>
        <S.Description>
          Piyasadaki tüm trendleri anlık olarak takip et, favori paritelerini listene ekle 
          ve yatırım stratejini Binance verileriyle güçlendir.
        </S.Description>
        
        {/* Buradaki butonlar büyük kalmaya devam eder ($small yok) */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <S.CTAButton $primary onClick={() => navigate('/register')}>
            Hemen Analize Başla
          </S.CTAButton>
          <S.CTAButton onClick={() => window.scrollTo(0, 800)}>
            Nasıl Çalışır?
          </S.CTAButton>
        </div>
      </S.HeroSection>
      <Footer />
    </S.HomeContainer>
  );
};

export default Home;