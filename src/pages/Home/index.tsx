import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, Shield, Zap, Globe, 
  BarChart3, PieChart, ArrowRight, Play 
} from 'lucide-react';
import * as S from './styles';
import Navbar from '../../app/layouts/PublicLayout/Navbar/Navbar';
import Footer from '../../app/layouts/PublicLayout/Footer/Footer';
import { Button } from '../../components/ui/Button';

const Home = () => {
  const navigate = useNavigate();

  return (
    <S.HomeContainer>
      <Navbar />
      
      {/* Hero Section */}
      <S.HeroSection>
        <S.Badge>Sürüm 2.0 Şimdi Yayında</S.Badge>
        <S.MainTitle>
          Yapay Zeka Destekli <br /> 
          Portföy Yönetimi
        </S.MainTitle>
        <S.Description>
          Kripto ve borsa dünyasını tek bir noktadan yönetin. 
          Gelişmiş AI algoritmaları ile piyasayı analiz edin, 
          anlık sinyalleri yakalayın ve stratejinizi otomatikleştirin.
        </S.Description>

        <S.ButtonGroup>
          <Button 
            $variant="primary" 
            $size="lg" 
            onClick={() => navigate('/register')}
            style={{ padding: '16px 32px', fontSize: '1.125rem' }}
          >
            Hemen Ücretsiz Başla <ArrowRight size={20} style={{ marginLeft: '8px' }} />
          </Button>
          <Button 
            $variant="outline" 
            $size="lg" 
            onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
            style={{ padding: '16px 32px', fontSize: '1.125rem', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <Play size={18} style={{ marginRight: '8px' }} /> Nasıl Çalışır?
          </Button>
        </S.ButtonGroup>

        <S.HeroImageWrapper>
          <img src="/hero-dashboard.png" alt="MoneyAnalyze Dashboard" />
        </S.HeroImageWrapper>
      </S.HeroSection>

      {/* Stats Section */}
      <S.StatsSection>
        <S.StatsGrid>
          <S.StatItem>
            <div className="value">50k+</div>
            <div className="label">Aktif Kullanıcı</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">$2.4B</div>
            <div className="label">İşlem Hacmi</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">100+</div>
            <div className="label">AI Algoritması</div>
          </S.StatItem>
          <S.StatItem>
            <div className="value">99.9%</div>
            <div className="label">Uptime</div>
          </S.StatItem>
        </S.StatsGrid>
      </S.StatsSection>

      {/* Features Section */}
      <S.FeaturesSection>
        <S.SectionHeader>
          <h2>Her Şey Tek Bir Noktada</h2>
          <p>Yatırımlarınızı yönetmek hiç bu kadar akıllıca olmamıştı.</p>
        </S.SectionHeader>

        <S.FeaturesGrid>
          <S.FeatureCard>
            <div className="icon"><Zap size={28} /></div>
            <h3>Anlık Takip</h3>
            <p>
              Binance ve Borsa İstanbul verilerini milisaniyeler içinde işleyin. 
              Piyasa hareketlerini asla kaçırmayın.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon"><TrendingUp size={28} /></div>
            <h3>Yapay Zeka Analizi</h3>
            <p>
              Gelişmiş indikatörler ve AI modelleri ile hisse ve coin 
              analizlerini profesyonel seviyede yapın.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon"><PieChart size={28} /></div>
            <h3>Portföy Yönetimi</h3>
            <p>
              Tüm varlıklarınızı, kâr/zarar durumunuzu ve işlem geçmişinizi 
              şık ve anlaşılır grafiklerle izleyin.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon"><Shield size={28} /></div>
            <h3>Güvenli Altyapı</h3>
            <p>
              Verileriniz en yüksek güvenlik standartlarında korunur. 
              Binance API anahtarlarınız tamamen şifrelidir.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon"><BarChart3 size={28} /></div>
            <h3>Detaylı Raporlama</h3>
            <p>
              Günlük, haftalık ve aylık performans raporları ile 
              stratejinizi sürekli optimize edin.
            </p>
          </S.FeatureCard>

          <S.FeatureCard>
            <div className="icon"><Globe size={28} /></div>
            <h3>Global Marketler</h3>
            <p>
              Kripto paradan hisse senetlerine kadar tüm global 
              pazarları tek bir arayüzden takip edin.
            </p>
          </S.FeatureCard>
        </S.FeaturesGrid>
      </S.FeaturesSection>

      {/* CTA Section */}
      <S.CTASection>
        <S.CTABox>
          <h2>Finansal Özgürlüğe Adım Atın</h2>
          <p>
            Binlerce başarılı yatırımcı arasına katılın ve piyasanın 
            önünde yer almaya başlayın. Hemen ücretsiz hesap oluşturun.
          </p>
          <Button 
            $variant="primary" 
            $size="lg" 
            onClick={() => navigate('/register')}
            style={{ 
              padding: '20px 48px', 
              fontSize: '1.25rem', 
              background: 'white', 
              color: '#1a73e8',
              fontWeight: 800
            }}
          >
            Ücretsiz Kayıt Ol
          </Button>
        </S.CTABox>
      </S.CTASection>

      <Footer />
    </S.HomeContainer>
  );
};

export default Home;