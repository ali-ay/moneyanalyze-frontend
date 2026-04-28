import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Wallet, 
  Bot, 
  LogOut,
  Users,
  Settings,
  ShieldCheck,
  BarChart3,
  X
} from 'lucide-react';
import { useAuth } from '../../core/providers/AuthContext';

const SidebarAside = styled.aside<{ $isOpen: boolean }>`
  width: 260px;
  height: 100vh;
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  border-right: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  display: flex;
  flex-direction: column;
  padding: 32px 0;
  position: sticky;
  top: 0;
  z-index: 1000;

  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.$isOpen ? '0' : '-260px'};
    transition: all 0.3s ease;
    box-shadow: ${props => props.$isOpen ? '0 0 40px rgba(0,0,0,0.1)' : 'none'};
  }
`;

const Backdrop = styled.div<{ $show: boolean }>`
  display: none;
  @media (max-width: 768px) {
    display: ${props => props.$show ? 'block' : 'none'};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.4);
    z-index: 999;
    backdrop-filter: blur(2px);
  }
`;

const MobileClose = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
    position: absolute;
    right: 16px;
    top: 16px;
    padding: 8px;
    cursor: pointer;
    color: #5F6368;
  }
`;

const LogoSection = styled.div`
  padding: 0 24px;
  margin-bottom: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  
  .logo-icon {
    width: 32px;
    height: 32px;
    background: ${props => props.theme?.colors?.primary || '#1A73E8'};
    border-radius: ${props => props.theme?.radius?.sm || '8px'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  
  span {
    font-size: 18px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }
`;

const NavList = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NavItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  cursor: pointer;
  color: ${props => props.$active ? (props.theme?.colors?.primary || '#1A73E8') : (props.theme?.colors?.textSecondary || '#5F6368')};
  background: ${props => props.$active ? (props.theme?.colors?.secondary || '#E8F0FE') : 'transparent'};
  font-weight: ${props => props.$active ? '700' : '500'};
  border-right: ${props => props.$active ? `3px solid ${props.theme?.colors?.primary || '#1A73E8'}` : 'none'};
  transition: all 0.2s;
  font-size: 14px;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }
`;

const NavGroupLabel = styled.div`
  padding: 24px 24px 8px;
  font-size: 10px;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#9AA0A6'};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AccountBadge = styled.div`
  margin: 24px;
  padding: 16px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  border-radius: ${props => props.theme?.radius?.lg || '16px'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  .label {
    font-size: 9px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .type {
    font-size: 13px;
    font-weight: 700;
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const LogoutButton = styled.button`
  margin: 0 24px;
  background: rgba(219, 68, 55, 0.05);
  color: ${props => props.theme?.colors?.danger || '#DB4437'};
  border: 1px solid rgba(219, 68, 55, 0.1);
  padding: 12px;
  border-radius: ${props => props.theme?.radius?.md || '12px'};
  cursor: pointer;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme?.colors?.danger || '#DB4437'};
    color: white;
  }
`;

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      <Backdrop $show={isOpen} onClick={onClose} />
      <SidebarAside $isOpen={isOpen}>
        <MobileClose onClick={onClose}><X size={24} /></MobileClose>
        <LogoSection onClick={() => handleNav('/dashboard')}>
        <div className="logo-icon">
          <LayoutDashboard size={20} />
        </div>
        <span>MoneyAnalyze</span>
      </LogoSection>

      <NavList>
        <NavGroupLabel>Ana Menü</NavGroupLabel>
        <NavItem $active={location.pathname === '/dashboard'} onClick={() => handleNav('/dashboard')}>
          <LayoutDashboard size={20} /> Analiz Paneli
        </NavItem>
        <NavItem $active={location.pathname === '/watchlist'} onClick={() => handleNav('/watchlist')}>
          <Wallet size={20} /> Cüzdan Takibi
        </NavItem>
        <NavItem $active={location.pathname === '/bots'} onClick={() => handleNav('/bots')}>
          <Bot size={20} /> Bot Yönetimi
        </NavItem>

        {isAdmin && (
          <>
            <NavGroupLabel>Yönetim</NavGroupLabel>
            <NavItem $active={location.pathname.startsWith('/admin/userlist')} onClick={() => handleNav('/admin/userlist')}>
              <Users size={20} /> Kullanıcılar
            </NavItem>
            <NavItem $active={location.pathname.startsWith('/admin/settings')} onClick={() => handleNav('/admin/settings')}>
              <Settings size={20} /> Sistem Ayarları
            </NavItem>
            <NavItem $active={location.pathname.startsWith('/admin/stocks')} onClick={() => handleNav('/admin/stocks')}>
              <BarChart3 size={20} /> Hisse Yönetimi
            </NavItem>
          </>
        )}
      </NavList>

      <AccountBadge>
        <div className="label">HESAP DURUMU</div>
        <div className="type">
          {isAdmin ? <ShieldCheck size={14} /> : null}
          {isAdmin ? 'Administrator' : 'Institutional Pro'}
        </div>
      </AccountBadge>
      
      <LogoutButton onClick={() => logout()}>
        <LogOut size={20} /> Güvenli Çıkış
      </LogoutButton>
      </SidebarAside>
    </>
  );
};

export default Sidebar;
