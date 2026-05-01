import styled from 'styled-components';

export const Navbar = styled.nav`
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5%;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    padding: 0 20px;
    height: 80px;
  }
`;

export const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 900;
  color: #171717;
  cursor: pointer;
  letter-spacing: -2px;
`;

export const NavButtons = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    gap: 8px;
  }
`;