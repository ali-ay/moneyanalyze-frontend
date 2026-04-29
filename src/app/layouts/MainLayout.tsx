import React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const LayoutRoot = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PageWrapper = styled.div`
  padding: 1.6rem;
  flex: 1;
  overflow-y: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <LayoutRoot>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent>
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <PageWrapper>
          <Outlet />
        </PageWrapper>
      </MainContent>
    </LayoutRoot>
  );
};

export default MainLayout;
