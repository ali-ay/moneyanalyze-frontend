import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  background: #0f172a;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  margin-bottom: 30px;
  h1 {
    color: white;
    font-size: 24px;
    margin-bottom: 8px;
  }
`;