import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import * as S from './styles';
import Navbar from '../../app/layouts/PublicLayout/Navbar/Navbar';
import Footer from '../../app/layouts/PublicLayout/Footer/Footer';

const Home = () => {
  const navigate = useNavigate();

  return (
    <S.HomeContainer>
      <Navbar />
      
      {/* Hero Section */}
      <S.HeroSection>
        <S.MainTitle>
          Yatırımda <br /> 
          Yeni Standart.
        </S.MainTitle>
        <S.Description>
          MoneyAnalyze ile finansal dünyanızı pürüzsüzleştirin. 
          Kripto ve borsa verilerini en akıllı ve en şık 
          yolla yönetmeye başlayın.
        </S.Description>

        <S.ButtonGroup>
          <S.KlarnaButton onClick={() => navigate('/register')}>
            Şimdi Kaydol
          </S.KlarnaButton>
          <S.KlarnaButton $variant="outline" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
            Keşfet <ArrowRight size={20} style={{ marginLeft: '8px', verticalAlign: 'middle' }} />
          </S.KlarnaButton>
        </S.ButtonGroup>

        <S.HeroImageWrapper>
          <img src="/klarna-hero.png" alt="MoneyAnalyze Finance" />
        </S.HeroImageWrapper>
      </S.HeroSection>

      {/* Stats Section */}
      <S.StatsSection>
        <S.StatsGrid>
          <S.StatItem>
            <div className="value">50k+</div>
            <div className="label">Kullanıcı</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">%20</div>
            <div className="label">Ort. Verim</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">0₺</div>
            <div className="label">Başlangıç Ücreti</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">24/7</div>
            <div className="label">Canlı Veri</div>
          </S.StatItem>
        </S.StatsGrid>
      </S.StatsSection>

      {/* Features Section */}
      <S.FeaturesSection>
        <S.FeaturesGrid>
          <S.FeatureCard>
            <div className="icon">🚀</div>
            <h3>Işık Hızında.</h3>
            <p>
              Binance ve BIST verilerini saniyeler içinde analiz edin. 
              Gecikme olmadan kararlarınızı verin.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon">🧠</div>
            <h3>Yapay Zeka.</h3>
            <p>
              Karmaşık indikatörleri biz sizin için yorumlayalım. 
              Basit, net ve aksiyon alınabilir sinyaller.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon">💎</div>
            <h3>Pürüzsüz.</h3>
            <p>
              Karmaşık arayüzlerden kurtulun. Finansal durumunuzu 
              hiç olmadığı kadar temiz bir şekilde görün.
            </p>
          </S.FeatureCard>
        </S.FeaturesGrid>
      </S.FeaturesSection>

      {/* CTA Section */}
      <S.CTASection>
        <h2>Daha akıllı bir <br />gelecek için hazır mısın?</h2>
        <S.KlarnaButton onClick={() => navigate('/register')} style={{ padding: '24px 64px', fontSize: '1.5rem' }}>
          Hemen Başla
        </S.KlarnaButton>
      </S.CTASection>

      <Footer />
    </S.HomeContainer>
  );
};

export default Home;