import * as S from './Sidebar.styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Hangi sayfada olduğumuzu anlamak için

  const [isWalletOpen, setIsWalletOpen] = useState(false);

  return (
    <S.SidebarContainer>
      <S.Logo>MoneyAnalyze</S.Logo>
      <S.Nav>
        <S.NavItem 
          $active={location.pathname === '/dashboard'} 
          onClick={() => navigate('/dashboard')}
        >
          🏠 Dashboard
        </S.NavItem>
        
        <S.NavItem 
          $active={location.pathname === '/watchlist'} 
          onClick={() => navigate('/watchlist')}
        >
          ⭐ Watchlist
        </S.NavItem>
        
        {/* Cüzdan İkonunu ve Yolunu Güncelledik */}
        <div>
          <S.NavItem 
            $active={location.pathname.includes('/wallet')} 
            onClick={() => setIsWalletOpen(!isWalletOpen)} // Tıklayınca alt menüyü aç/kapat
          >
            💰 Cüzdanım
            <S.ArrowIcon $isOpen={isWalletOpen}>▼</S.ArrowIcon>
          </S.NavItem>

          {/* ALT MENÜ */}
          <S.SubMenu $isOpen={isWalletOpen}>
            <S.SubNavItem onClick={() => navigate('/wallet')}>
              📊 Portföyüm
            </S.SubNavItem>
            <S.SubNavItem onClick={() => navigate('/wallet/deposit')}>
              💵 Bakiye Yükle
            </S.SubNavItem>
          </S.SubMenu>
        </div>
        
        <S.NavItem 
          $active={location.pathname === '/settings'} 
          onClick={() => navigate('/settings')}
        >
          ⚙️ Ayarlar
        </S.NavItem>
      </S.Nav>
      
      <S.LogoutBtn onClick={() => { localStorage.clear(); navigate('/login'); }}>
        🚪 Çıkış
      </S.LogoutBtn>
    </S.SidebarContainer>
  );
};

export default Sidebar;