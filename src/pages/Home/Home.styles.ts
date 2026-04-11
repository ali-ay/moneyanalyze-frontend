import styled from 'styled-components';

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e293b, #080c14);
  color: white;
  overflow-x: hidden; // Mobilde taşmaları önlemek için
`;

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 15px 5%;
    flex-direction: column; // Mobilde logoyu üste, butonları alta alır
    gap: 15px; // Logo ve buton grubu arasına boşluk
  }
`;

export const Logo = styled.h1`
  font-size: 24px;
  color: #38bdf8;
  font-weight: 800;
  cursor: pointer;

  @media (max-width: 480px) {
    font-size: 20px; // Çok küçük ekranlarda logoyu biraz küçülttük
  }
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
    width: 100%; // Buton grubunu tam genişlik yap
    justify-content: center; // Butonları ortala
  }
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px;

  @media (max-width: 768px) {
    padding: 60px 15px; // Tepe boşluğunu azalttık
  }
`;

export const MainTitle = styled.h2`
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(to right, #f8fafc, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1; // Mobilde satır aralığı daha sık olmalı

  @media (max-width: 768px) {
    font-size: 42px;
  }

  @media (max-width: 480px) {
    font-size: 36px; // Küçük telefonlar için ideal
  }
`;

export const Description = styled.p`
  font-size: 18px;
  color: #94a3b8;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;

  @media (max-width: 480px) {
    flex-direction: column; // Butonları mobilde alt alta dizdik
    width: 100%;
    max-width: 300px;
  }
`;

export const CTAButton = styled.button<{ $primary?: boolean; $small?: boolean }>`
  padding: ${props => props.$small ? '8px 16px' : '14px 32px'}; // Navbar için küçültme desteği
  font-size: ${props => props.$small ? '14px' : '16px'}; // Navbar için fontu küçültme
  font-weight: 700;
  border-radius: 50px;
  background: ${props => props.$primary ? '#38bdf8' : 'transparent'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: ${props => props.$primary ? 'none' : '2px solid #334155'};
  cursor: pointer;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    // Mobilde butonlar çok büyükse otomatik biraz daha küçülür
    padding: ${props => props.$small ? '6px 12px' : '12px 24px'};
    font-size: 13px;
    flex: 1; // Mobilde butonların eşit genişlikte olmasını sağlar
    max-width: 150px; // Çok yayılmasınlar
  }

  &:hover {
    transform: translateY(-2px);
    background: ${props => props.$primary ? '#7dd3fc' : '#1e293b'};
  }
`;