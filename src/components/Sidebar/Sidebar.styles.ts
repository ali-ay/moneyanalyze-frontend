import styled from 'styled-components';

export const SidebarContainer = styled.div`
  width: 260px;
  background: #1e293b;
  border-right: 1px solid #334155;
  display: flex;
  flex-direction: column;
  padding: 30px 20px;
  height: 100vh;
  position: sticky;
  top: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    position: relative;
    padding: 15px;
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

export const SubNavItem = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #94a3b8;
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