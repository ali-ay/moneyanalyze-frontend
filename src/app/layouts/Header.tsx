import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Menu, Search, X } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { useMarketMode } from '../../context/MarketModeContext';
import api from '../../services/apiClient';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: transparent;
  width: 100%;
  gap: 20px;

  @media (max-width: 768px) {
    padding: 16px 12px;
    gap: 12px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.125rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;
  white-space: nowrap;

  @media (max-width: 1024px) {
    display: none;
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 500px;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${props => props.theme.colors.cardBg};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  padding: 0 16px;
  height: 44px;
  transition: all 0.2s;

  &:focus-within {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 4px rgba(26, 115, 232, 0.1);
  }

  svg {
    color: ${props => props.theme.colors.textSecondary};
    margin-right: 12px;
  }
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.textMain};
  font-size: 0.875rem;
  width: 100%;
  outline: none;

  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
    opacity: 0.7;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff; /* Varsayılan açık tema */
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 12px;
  margin-top: 8px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  z-index: 9999; /* En üstte görünmesi için */

  /* Koyu tema desteği için (Eğer temanızda isDark gibi bir flag varsa ona göre ayarlayabiliriz) */
  [data-theme='dark'] & {
    background: #1e293b; 
    border-color: #334155;
  }
  
  /* Manuel düzeltme: Eğer temanız koyuysa burayı kullansın */
  background: ${props => props.theme.colors.cardBg === 'transparent' ? '#1a1d21' : props.theme.colors.cardBg};
  opacity: 1;
`;

const SearchItem = styled.div`
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(26, 115, 232, 0.1);
  }

  .symbol {
    font-weight: 800;
    color: ${props => props.theme.colors.primary};
    font-size: 0.9rem;
  }

  .name {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.textMain};
    max-width: 70%;
    text-align: right;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 16px;
  color: ${props => props.theme.colors.textSecondary};
  svg {
    cursor: pointer;
    transition: color 0.2s;
    &:hover { color: ${props => props.theme.colors.primary}; }
  }

  @media (max-width: 1024px) {
    display: none;
  }
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-left: 24px;
  border-left: 1px solid ${props => props.theme.colors.border};
  cursor: pointer;

  @media (max-width: 768px) {
    padding-left: 0;
    border-left: none;
  }
`;

const UserMeta = styled.div`
  text-align: right;
  .name { font-size: 0.8125rem; font-weight: 700; color: ${props => props.theme.colors.textMain}; }
  .role { font-size: 0.625rem; font-weight: 600; color: ${props => props.theme.colors.textSecondary}; text-transform: uppercase; }

  @media (max-width: 480px) {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.colors.border};
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const ModeToggleContainer = styled.div`
  display: flex;
  gap: 4px;
  background: ${props => props.theme.colors.background};
  padding: 4px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const ModeToggleButton = styled.button<{ $active: boolean }>`
  padding: 6px 12px;
  border: none;
  background: ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.$active ? '#FFFFFF' : props.theme.colors.textSecondary};
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.6875rem;
  }

  &:hover {
    background: ${props => !props.$active ? props.theme.colors.background : props.theme.colors.primary};
  }
`;

const MenuButton = styled.div`
  display: none;
  @media (max-width: 1024px) {
    display: flex;
    padding: 8px;
    margin-left: -8px;
    cursor: pointer;
    color: ${props => props.theme.colors.textMain};
  }
`;

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mode, setMode } = useMarketMode();
  const isAdmin = user?.role === 'ADMIN';

  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<any[]>([]);
  const [filteredStocks, setFilteredStocks] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Hisseleri yükle (Sadece Admin için)
  useEffect(() => {
    if (isAdmin) {
      const fetchStocks = async () => {
        try {
          const res = await api.get('/admin/stocks');
          if (res.data && Array.isArray(res.data.data)) {
            setStocks(res.data.data);
          } else if (Array.isArray(res.data)) {
            setStocks(res.data);
          }
        } catch (err) {
          console.error('Stocks fetch error:', err);
        }
      };
      fetchStocks();
    }
  }, [isAdmin]);

  // Türkçe karakterleri normalize eden yardımcı fonksiyon
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ş/g, 's')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .trim();
  };

  // Arama filtreleme
  useEffect(() => {
    if (searchQuery.length > 1) {
      const normalizedQuery = normalizeText(searchQuery);
      
      const filtered = (stocks || []).filter(s => {
        const normalizedSymbol = normalizeText(s.symbol || '');
        const normalizedName = s.name ? normalizeText(s.name) : '';
        
        return normalizedSymbol.includes(normalizedQuery) || 
               normalizedName.includes(normalizedQuery);
      }).slice(0, 10);
      
      setFilteredStocks(filtered);
      setShowResults(true);
    } else {
      setFilteredStocks([]);
      setShowResults(false);
    }
  }, [searchQuery, stocks]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    navigate(`/dashboard/stock/${symbol}`);
    setSearchQuery('');
    setShowResults(false);
  };

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <MenuButton onClick={onMenuClick}>
          <Menu size={24} />
        </MenuButton>
        <HeaderTitle>Pazar Analiz Paneli</HeaderTitle>
      </div>

      {isAdmin && (
        <SearchContainer ref={searchRef}>
          <SearchInputWrapper>
            <Search size={18} />
            <SearchInput 
              placeholder="Hisse senedi ara (Örn: THYAO)..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setShowResults(true)}
            />
            {searchQuery && (
              <X 
                size={16} 
                style={{ cursor: 'pointer' }} 
                onClick={() => setSearchQuery('')} 
              />
            )}
          </SearchInputWrapper>

          {showResults && filteredStocks.length > 0 && (
            <SearchResults>
              {filteredStocks.map((s) => (
                <SearchItem key={s.symbol} onClick={() => handleSelect(s.symbol)}>
                  <div className="symbol">{s.symbol}</div>
                  <div className="name">{s.name}</div>
                </SearchItem>
              ))}
            </SearchResults>
          )}
        </SearchContainer>
      )}

      <HeaderActions>
        <ModeToggleContainer>
          <ModeToggleButton
            $active={mode === 'crypto'}
            onClick={() => setMode('crypto')}
          >
            Kripto
          </ModeToggleButton>
          <ModeToggleButton
            $active={mode === 'stock'}
            onClick={() => setMode('stock')}
          >
            Borsa
          </ModeToggleButton>
        </ModeToggleContainer>

        <ToolGroup>
          <Bell size={20} />
          <HelpCircle size={20} />
        </ToolGroup>

        <UserProfile onClick={() => navigate('/profile')}>
          <UserMeta>
            <div className="name">{user?.username || 'User Profile'}</div>
            <div className="role">{user?.role?.toUpperCase() || 'USER'}</div>
          </UserMeta>
          <UserAvatar>
            <img src={`https://ui-avatars.com/api/?name=${user?.username || 'User'}&background=1a73e8&color=fff`} alt="Avatar" />
          </UserAvatar>
        </UserProfile>
      </HeaderActions>
    </HeaderWrapper>
  );
};

export default Header;
