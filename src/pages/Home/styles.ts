import styled from 'styled-components';

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e293b, #080c14);
  color: white;
  overflow-x: hidden; // Mobilde taşmaları önlemek için
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
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(to right, #f8fafc, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1; // Mobilde satır aralığı daha sık olmalı

  @media (max-width: 768px) {
    font-size: 2.625rem;
  }

  @media (max-width: 480px) {
    font-size: 2.25rem; // Küçük telefonlar için ideal
  }
`;

export const Description = styled.p`
  font-size: 1.125rem;
  color: #94a3b8;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    font-size: 1rem;
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


