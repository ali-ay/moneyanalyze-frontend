import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Bell, HelpCircle, Menu } from 'lucide-react';
import { useAuth } from '../../app/providers/AuthContext';
import { useMarketMode } from '../../context/MarketModeContext';

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 48px;
  background: transparent;
  width: 100%;

  @media (max-width: 768px) {
    padding: 16px 20px;
  }
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
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

  @media (max-width: 768px) {
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
`;

const UserMeta = styled.div`
  text-align: right;
  .name { font-size: 0.8125rem; font-weight: 700; color: ${props => props.theme.colors.textMain}; }
  .role { font-size: 0.625rem; font-weight: 600; color: ${props => props.theme.colors.textSecondary}; text-transform: uppercase; }
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.radius.full};
  background: ${props => props.theme.colors.border};
  overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; }
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

  &:hover {
    background: ${props => !props.$active ? props.theme.colors.background : props.theme.colors.primary};
  }
`;

const MenuButton = styled.div`
  display: none;
  @media (max-width: 768px) {
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

  return (
    <HeaderWrapper>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <MenuButton onClick={onMenuClick}>
          <Menu size={24} />
        </MenuButton>
        <HeaderTitle>Pazar Analiz Paneli</HeaderTitle>
      </div>

      <HeaderActions>
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
