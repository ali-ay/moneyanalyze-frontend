import * as S from './Sidebar.styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { HiMenu, HiX } from 'react-icons/hi'; // Hamburger ikonları

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Mobilde menünün açık/kapalı olma durumu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Cüzdan alt menüsünün durumu
  const [isWalletOpen, setIsWalletOpen] = useState(location.pathname.includes('/wallet') || location.pathname === '/history');

  // Menüleri kapatıp yönlendirme yapan yardımcı fonksiyon
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false); // Mobilde tıklandığında menüyü kapat
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* MOBİL HEADER: Sadece 768px altında görünür */}
      <S.MobileHeader>
        <S.Logo onClick={() => handleNavigation('/')} style={{ fontSize: '20px', margin: 0 }}>
          MoneyAnalyze
        </S.Logo>
        <S.HamburgerButton onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
        </S.HamburgerButton>
      </S.MobileHeader>

      {/* SİDEBAR KONTEYNER: Mobilde $isOpen durumuna göre aşağı açılır */}
      <S.SidebarContainer $isOpen={isMobileMenuOpen}>
        <S.Logo onClick={() => handleNavigation('/')} className="desktop-logo">
          MoneyAnalyze
        </S.Logo>
        
        <S.Nav>
          <S.NavItem 
            $active={location.pathname === '/dashboard'} 
            onClick={() => handleNavigation('/dashboard')}
          >
            🏠 Dashboard
          </S.NavItem>
          
          <S.NavItem 
            $active={location.pathname === '/watchlist'} 
            onClick={() => handleNavigation('/watchlist')}
          >
            ⭐ Watchlist
          </S.NavItem>
          
          <div>
            <S.NavItem 
              $active={location.pathname.includes('/wallet') || location.pathname === '/history'} 
              onClick={() => setIsWalletOpen(!isWalletOpen)}
            >
              💰 Cüzdanım
              <S.ArrowIcon $isOpen={isWalletOpen}>▼</S.ArrowIcon>
            </S.NavItem>

            <S.SubMenu $isOpen={isWalletOpen}>
              <S.SubNavItem 
                $active={location.pathname === '/wallet'} 
                onClick={() => handleNavigation('/wallet')}
              >
                📊 Portföyüm
              </S.SubNavItem>
              <S.SubNavItem 
                $active={location.pathname === '/wallet/history'} 
                onClick={() => handleNavigation('/wallet/history')}
              >
                📜 İşlem Geçmişi
              </S.SubNavItem>
              <S.SubNavItem 
                $active={location.pathname === '/wallet/deposit'} 
                onClick={() => handleNavigation('/wallet/deposit')}
              >
                💵 Bakiye Yükle
              </S.SubNavItem>
            </S.SubMenu>
          </div>
          
          <S.NavItem 
            $active={location.pathname === '/settings'} 
            onClick={() => handleNavigation('/settings')}
          >
            ⚙️ Ayarlar
          </S.NavItem>
        </S.Nav>
        
        <S.LogoutBtn onClick={() => { localStorage.clear(); navigate('/login'); }}>
          🚪 Çıkış
        </S.LogoutBtn>
      </S.SidebarContainer>
    </>
  );
};

export default Sidebar;