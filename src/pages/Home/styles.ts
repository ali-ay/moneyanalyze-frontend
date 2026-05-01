import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: #080c14;
  color: white;
  overflow-x: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

export const HeroSection = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 140px 20px 100px;
  background: radial-gradient(circle at 50% -20%, #1a73e833 0%, transparent 50%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #1a73e8, transparent);
  }

  @media (max-width: 768px) {
    padding: 100px 20px 60px;
  }
`;

export const Badge = styled.div`
  background: rgba(26, 115, 232, 0.1);
  border: 1px solid rgba(26, 115, 232, 0.2);
  color: #1a73e8;
  padding: 8px 16px;
  border-radius: 99px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const MainTitle = styled.h1`
  font-size: 5rem;
  font-weight: 900;
  margin-bottom: 24px;
  background: linear-gradient(to bottom, #ffffff 50%, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  letter-spacing: -2px;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 3rem;
    letter-spacing: -1px;
  }
`;

export const Description = styled.p`
  font-size: 1.25rem;
  color: #94a3b8;
  max-width: 700px;
  line-height: 1.6;
  margin-bottom: 48px;
  animation: ${fadeInUp} 1s ease-out;

  @media (max-width: 768px) {
    font-size: 1.125rem;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  animation: ${fadeInUp} 1.2s ease-out;

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
`;

export const HeroImageWrapper = styled.div`
  margin-top: 80px;
  width: 100%;
  max-width: 1200px;
  position: relative;
  animation: ${float} 6s ease-in-out infinite;

  img {
    width: 100%;
    height: auto;
    border-radius: 24px;
    box-shadow: 0 40px 100px rgba(0,0,0,0.5), 0 0 40px rgba(26, 115, 232, 0.2);
    border: 1px solid rgba(255,255,255,0.1);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 10%;
    right: 10%;
    height: 40px;
    background: rgba(26, 115, 232, 0.3);
    filter: blur(60px);
    z-index: -1;
  }
`;

export const FeaturesSection = styled.section`
  padding: 120px 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;

  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 16px;
  }

  p {
    color: #94a3b8;
    font-size: 1.125rem;
  }
`;

export const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 40px;
  border-radius: 24px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #1a73e866;
    transform: translateY(-8px);
  }

  .icon {
    width: 56px;
    height: 56px;
    background: #1a73e815;
    color: #1a73e8;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 16px;
  }

  p {
    color: #94a3b8;
    line-height: 1.6;
  }
`;

export const StatsSection = styled.section`
  padding: 80px 20px;
  background: rgba(26, 115, 232, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px;
  text-align: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const StatItem = styled.div`
  .value {
    font-size: 2.5rem;
    font-weight: 800;
    color: #1a73e8;
    margin-bottom: 8px;
  }
  .label {
    color: #94a3b8;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const CTASection = styled.section`
  padding: 120px 20px;
  text-align: center;
`;

export const CTABox = styled.div`
  background: linear-gradient(135deg, #1a73e8 0%, #0c4cb3 100%);
  max-width: 1000px;
  margin: 0 auto;
  padding: 80px 40px;
  border-radius: 32px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -20%;
    width: 60%;
    height: 200%;
    background: rgba(255,255,255,0.1);
    transform: rotate(30deg);
  }

  h2 {
    font-size: 3rem;
    font-weight: 800;
    margin-bottom: 24px;
    position: relative;
  }

  p {
    font-size: 1.25rem;
    margin-bottom: 40px;
    opacity: 0.9;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
    position: relative;
  }
`;
