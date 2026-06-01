import styled from 'styled-components';

export const FooterContainer = styled.footer`
  padding: 100px 10%;
  background: #ffffff;
  border-top: 1px solid #eee;
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
  gap: 60px;
  margin-bottom: 60px;
`;

export const FooterColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  h4 {
    color: #171717;
    font-size: 1.25rem;
    font-weight: 800;
    margin-bottom: 10px;
    letter-spacing: -1px;
  }

  a {
    color: #555;
    text-decoration: none;
    font-size: 1rem;
    font-weight: 500;
    transition: 0.3s;
    &:hover { color: #171717; text-decoration: underline; }
  }
`;

export const Logo = styled.h2`
  font-size: 1.75rem;
  color: #171717;
  font-weight: 900;
  margin: 0;
  letter-spacing: -2px;
`;

export const Copyright = styled.div`
  padding-top: 40px;
  border-top: 1px solid #eee;
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 0.875rem;
  font-weight: 500;
`;