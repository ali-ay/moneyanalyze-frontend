import styled from 'styled-components';

export const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  width: 260px;
  height: 100vh;
  background-color: #0f172a;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: fixed;
    top: 60px; // MobileHeader yüksekliği
    left: 0;
    width: 100%;
    height: ${props => props.$isOpen ? 'calc(100vh - 60px)' : '0'};
    overflow: hidden;
    z-index: 999;
    /* Masaüstü logosunu mobilde gizleyebilirsin */
    .desktop-logo { display: none; }
  }`
;

export const MobileHeader = styled.div`
  display: none; // Masaüstünde gizli
  
  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    width: 100%;
    background-color: #0f172a;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const HamburgerButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 20px;
  margin-top: 0;

  @media (max-width: 768px) {
    margin-top: 60px; // MobileHeader'ın altında kalması için
    padding: 10px 20px 30px;
  }
`;

export const Logo = styled.h2`
  color: #38bdf8;
  font-size: 22px;
  margin-bottom: 40px;
  text-align: center;
  letter-spacing: 1px;
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

// Sidebar.styles.ts


// Buradaki tanımı <{ $active?: boolean }> olarak güncelle
export const NavItem = styled.div<{ $active?: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  border-radius: 8px;
  margin-bottom: 4px;
  
  // Burada da $active kullanmalısın
  color: ${props => props.$active ? '#fff' : '#94a3b8'};
  background: ${props => props.$active ? '#334155' : 'transparent'};

  &:hover {
    background: #1e293b;
    color: #fff;
  }
`;

export const LogoutBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

// Sidebar.styles.ts dosyasına ekle

export const SubMenu = styled.div<{ $isOpen: boolean }>`
  display: ${props => (props.$isOpen ? 'block' : 'none')};
  overflow: hidden;
  transition: all 0.3s ease-in-out;
  padding-left: 20px; // İçeriden başlatarak hiyerarşi sağlıyoruz
  background: rgba(30, 41, 59, 0.5); // Hafif farklı bir arka plan
  border-radius: 8px;
  margin-top: -4px;
  margin-bottom: 8px;
`;

export const SubNavItem = styled.div<{ $active?: boolean }>`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: ${props => props.$active ? '#fff' : '#888'};
  background: ${props => props.$active ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    color: #10b981;
    background: rgba(16, 185, 129, 0.1);
  }
`;

export const ArrowIcon = styled.span<{ $isOpen: boolean }>`
  margin-left: auto;
  transition: transform 0.3s;
  transform: ${props => props.$isOpen ? 'rotate(180°)' : 'rotate(0)'};
  font-size: 12px;
`;