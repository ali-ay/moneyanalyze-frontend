import * as S from './Footer.styles';

const Footer = () => {
  return (
    <S.FooterContainer>
      <S.FooterGrid>
        <S.FooterColumn>
          <S.Logo>MoneyAnalyze</S.Logo>
          <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', marginTop: '10px' }}>
            Finansal verileri analiz etmenin en modern yolu. 
            Gerçek zamanlı verilerle portföyünüzü yönetin.
          </p>
        </S.FooterColumn>

        <S.FooterColumn>
          <h4>Platform</h4>
          <a href="#">Piyasa Takibi</a>
          <a href="#">Analiz Araçları</a>
          <a href="#">API Dokümantasyonu</a>
        </S.FooterColumn>

        <S.FooterColumn>
          <h4>Kurumsal</h4>
          <a href="#">Hakkımızda</a>
          <a href="#">Kullanım Koşulları</a>
          <a href="#">Gizlilik Politikası</a>
        </S.FooterColumn>

        <S.FooterColumn>
          <h4>İletişim</h4>
          <a href="mailto:info@moneyanalyze.com">destek@moneyanalyze.com</a>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Istanbul, Türkiye</p>
        </S.FooterColumn>
      </S.FooterGrid>

      <S.Copyright>
        © {new Date().getFullYear()} MoneyAnalyze. Tüm hakları saklıdır. Ali Ay tarafından geliştirilmiştir.
      </S.Copyright>
    </S.FooterContainer>
  );
};

export default Footer;