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
  X,
  History,
  Eye,
  Briefcase,
  Zap,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';

const SidebarAside = styled.aside<{ $isOpen: boolean }>`
  width: 208px;
  height: 100vh;
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  border-right: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  display: flex;
  flex-direction: column;
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

const SidebarScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;

  /* Custom Scrollbar Styles */
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme?.colors?.border || '#DADCE0'};
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }
`;

const SidebarFooter = styled.div`
  border-top: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};
  padding-bottom: 32px;
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
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
  padding: 32px 24px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  background: ${props => props.theme?.colors?.white || '#FFFFFF'};
  
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
    font-size: 1.125rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
  }
`;

const NavList = styled.nav`
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
  font-size: 0.875rem;

  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
  }
`;

const NavGroupLabel = styled.div`
  padding: 24px 24px 8px;
  font-size: 0.625rem;
  font-weight: 700;
  color: ${props => props.theme?.colors?.textSecondary || '#9AA0A6'};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const AccountBadge = styled.div`
  margin: 16px 24px;
  padding: 16px;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  border-radius: ${props => props.theme?.radius?.lg || '16px'};
  border: 1px solid ${props => props.theme?.colors?.border || '#DADCE0'};

  .label {
    font-size: 0.5625rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .type {
    font-size: 0.8125rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.primary || '#1A73E8'};
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const LogoutButton = styled.button`
  margin: 0 24px;
  width: calc(100% - 48px);
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
            <LayoutDashboard size={18} />
          </div>
          <span>MoneyAnalyze</span>
        </LogoSection>

        <SidebarScrollArea>
          <NavList>
            <NavGroupLabel>Ana Menü</NavGroupLabel>
            <NavItem $active={location.pathname === '/dashboard'} onClick={() => handleNav('/dashboard')}>
              <LayoutDashboard size={18} /> Analiz Paneli
            </NavItem>
            <NavItem $active={location.pathname === '/dashboard/ai-analysis'} onClick={() => handleNav('/dashboard/ai-analysis')}>
              <Zap size={18} color="#F4B400" fill="#F4B400" /> Yapay Zeka Analizi
            </NavItem>
            <NavItem $active={location.pathname === '/dashboard/wallet'} onClick={() => handleNav('/dashboard/wallet')}>
              <Briefcase size={18} /> Varlıklarım
            </NavItem>
            <NavItem $active={location.pathname === '/watchlist'} onClick={() => handleNav('/watchlist')}>
              <Wallet size={18} /> Cüzdan Takibi
            </NavItem>
            <NavItem $active={location.pathname === '/dashboard/stock-activity'} onClick={() => handleNav('/dashboard/stock-activity')}>
              <History size={18} /> Hisse Hareket Kaydı
            </NavItem>
            <NavItem $active={location.pathname === '/bots'} onClick={() => handleNav('/bots')}>
              <Bot size={18} /> Bot Yönetimi
            </NavItem>

            {isAdmin && (
              <>
                <NavGroupLabel>Yönetim</NavGroupLabel>
                <NavItem $active={location.pathname.startsWith('/admin/userlist')} onClick={() => handleNav('/admin/userlist')}>
                  <Users size={18} /> Kullanıcılar
                </NavItem>
                <NavItem $active={location.pathname.startsWith('/admin/settings')} onClick={() => handleNav('/admin/settings')}>
                  <Settings size={18} /> Sistem Ayarları
                </NavItem>
                <NavItem $active={location.pathname.startsWith('/admin/stocks')} onClick={() => handleNav('/admin/stocks')}>
                  <BarChart3 size={18} /> Hisse Yönetimi
                </NavItem>
                <NavItem $active={location.pathname.startsWith('/admin/media')} onClick={() => handleNav('/admin/media')}>
                  <ImageIcon size={18} /> Medya Kütüphanesi
                </NavItem>
              </>
            )}
          </NavList>
        </SidebarScrollArea>

        <SidebarFooter>
          <AccountBadge>
            <div className="label">HESAP DURUMU</div>
            <div className="type">
              {isAdmin ? <ShieldCheck size={14} /> : null}
              {isAdmin ? 'Administrator' : 'Institutional Pro'}
            </div>
          </AccountBadge>

          <LogoutButton onClick={() => logout()}>
            <LogOut size={18} /> Güvenli Çıkış
          </LogoutButton>
        </SidebarFooter>
      </SidebarAside>
    </>
  );
};

export default Sidebar;
