import styled from 'styled-components';

export const HomeContainer = styled.div`
  min-height: 100vh;
  background: radial-gradient(circle at top right, #1e293b, #080c14);
  color: white;
`;

export const Navbar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 10%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const Logo = styled.h1`
  font-size: 24px;
  color: #38bdf8;
  font-weight: 800;
  cursor: pointer;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 20px;
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 100px 20px;
`;

export const MainTitle = styled.h2`
  font-size: 64px;
  font-weight: 900;
  margin-bottom: 20px;
  background: linear-gradient(to right, #f8fafc, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 40px;
  }
`;

export const Description = styled.p`
  font-size: 18px;
  color: #94a3b8;
  max-width: 600px;
  line-height: 1.6;
  margin-bottom: 40px;
`;

export const CTAButton = styled.button<{ $primary?: boolean }>`
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 50px;
  background: ${props => props.$primary ? '#38bdf8' : 'transparent'};
  color: ${props => props.$primary ? '#0f172a' : '#f8fafc'};
  border: ${props => props.$primary ? 'none' : '2px solid #334155'};

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${props => props.$primary ? '0 10px 20px rgba(56, 189, 248, 0.3)' : 'none'};
    background: ${props => props.$primary ? '#7dd3fc' : '#1e293b'};
  }
`;