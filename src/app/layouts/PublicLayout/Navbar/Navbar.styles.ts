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
    height: 72px;
    background-color: #ffffff;
  }
`;

export const Logo = styled.div`
  font-size: 1.75rem;
  font-weight: 900;
  color: #171717;
  cursor: pointer;
  letter-spacing: -2px;

  @media (max-width: 768px) {
    font-size: 1.375rem;
    letter-spacing: -1px;
  }
`;

export const NavButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 10px;
  }
`;

export const LoginLink = styled.button`
  background: transparent;
  border: none;
  font-weight: 800;
  color: #171717;
  cursor: pointer;
  font-size: 1rem;
  padding: 8px;
  
  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 4px;
  }
`;

export const ActionButton = styled.button`
  background: #171717;
  color: white;
  border: none;
  font-weight: 800;
  cursor: pointer;
  padding: 12px 24px;
  border-radius: 99px;
  font-size: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.875rem;
  }
`;