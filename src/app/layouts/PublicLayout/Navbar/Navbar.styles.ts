import styled from 'styled-components';

export const Navbar = styled.nav`
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background: rgba(8, 12, 20, 0.8);
  backdrop-filter: blur(12px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 70px;
  }
`;

export const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #FFFFFF;
  cursor: pointer;
  letter-spacing: -1px;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    gap: 8px;
  }
`;