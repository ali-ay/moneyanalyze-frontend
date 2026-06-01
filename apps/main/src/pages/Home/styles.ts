import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: #f7f7f7;
  color: #171717;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 180px 20px 120px;
  background: #ffb3c7;
  border-bottom-left-radius: 80px;
  border-bottom-right-radius: 80px;
  position: relative;

  @media (max-width: 768px) {
    padding: 120px 20px 80px;
    border-bottom-left-radius: 40px;
    border-bottom-right-radius: 40px;
  }
`;

export const MainTitle = styled.h1`
  font-size: 6.5rem;
  font-weight: 900;
  margin-bottom: 24px;
  color: #171717;
  line-height: 0.95;
  letter-spacing: -4px;
  animation: ${fadeInUp} 0.8s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 1024px) {
    font-size: 4.5rem;
    letter-spacing: -2px;
  }

  @media (max-width: 768px) {
    font-size: 3.5rem;
    letter-spacing: -1px;
  }
`;

export const Description = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: #171717;
  max-width: 600px;
  line-height: 1.4;
  margin-bottom: 48px;
  opacity: 0.8;
  animation: ${fadeInUp} 1s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  animation: ${fadeInUp} 1.2s cubic-bezier(0.16, 1, 0.3, 1);

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
`;

export const KlarnaButton = styled.button<{ $variant?: 'primary' | 'outline' }>`
  padding: 20px 48px;
  font-size: 1.125rem;
  font-weight: 800;
  border-radius: 99px;
  border: ${props => props.$variant === 'outline' ? '2px solid #171717' : 'none'};
  background: ${props => props.$variant === 'outline' ? 'transparent' : '#171717'};
  color: ${props => props.$variant === 'outline' ? '#171717' : '#ffffff'};
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: none;

  &:hover {
    transform: scale(1.05);
    background: ${props => props.$variant === 'outline' ? '#171717' : '#000000'};
    color: #ffffff;
  }

  @media (max-width: 480px) {
    width: 100%;
  }
`;

export const HeroImageWrapper = styled.div`
  margin-top: 60px;
  width: 100%;
  max-width: 800px;
  display: flex;
  justify-content: center;
  animation: ${fadeInUp} 1.4s cubic-bezier(0.16, 1, 0.3, 1);

  img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
  }
`;

export const FeaturesSection = styled.section`
  padding: 120px 5%;
  max-width: 1400px;
  margin: 0 auto;
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  padding: 40px;
  background: #ffffff;
  border-radius: 40px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-10px);
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 16px;
    letter-spacing: -1px;
  }

  p {
    font-size: 1.125rem;
    color: #555;
    line-height: 1.5;
  }
`;

export const StatsSection = styled.section`
  background: #ffffff;
  padding: 100px 5%;
  border-radius: 80px;
  margin: 0 20px;
  
  @media (max-width: 768px) {
    border-radius: 40px;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StatItem = styled.div`
  .value {
    font-size: 4rem;
    font-weight: 900;
    color: #171717;
    margin-bottom: 4px;
    letter-spacing: -2px;
  }
  .label {
    font-size: 1.125rem;
    font-weight: 600;
    color: #777;
  }
`;

export const CTASection = styled.section`
  padding: 140px 20px;
  text-align: center;
  background: #f7f7f7;

  h2 {
    font-size: 5rem;
    font-weight: 900;
    margin-bottom: 32px;
    letter-spacing: -3px;
    line-height: 1;

    @media (max-width: 768px) {
      font-size: 3rem;
      letter-spacing: -1px;
    }
  }
`;
