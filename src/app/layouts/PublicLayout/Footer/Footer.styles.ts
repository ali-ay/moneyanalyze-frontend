import styled from 'styled-components';

export const FooterContainer = styled.footer`
  padding: 60px 10%;
  background: #080c14;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
`;

export const FooterGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-bottom: 40px;
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  h4 {
    color: #f8fafc;
    font-size: 16px;
    margin-bottom: 10px;
  }

  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    transition: 0.3s;
    &:hover { color: #38bdf8; }
  }
`;

export const Logo = styled.h2`
  font-size: 20px;
  color: #38bdf8;
  font-weight: 800;
  margin: 0;
`;

export const Copyright = styled.div`
  padding-top: 30px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  width: 100%;
  text-align: center;
  color: #64748b;
  font-size: 13px;
`;