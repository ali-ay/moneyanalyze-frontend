import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;

  h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 32px;
    color: #f8fafc;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 20px;
    color: #94a3b8;
  }
`;

export const BalanceCard = styled.div`
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid #334155;
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 40px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  max-width: 500px;

  h3 {
    font-size: 16px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  h2 {
    font-size: 36px;
    font-weight: 800;
    color: #10b981; // Kripto yeşili
    margin: 0;
  }
`;

export const PortfolioTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
`;

export const Th = styled.th`
  text-align: left;
  padding: 16px;
  background: #334155;
  color: #cbd5e1;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
`;

export const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #334155;
  font-size: 15px;

  strong {
    color: #f8fafc;
  }
`;

export const ProfitBadge = styled.span<{ isPositive: boolean }>`
  background: ${props => props.isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.isPositive ? '#10b981' : '#ef4444'};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 13px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px;
  background: #1e293b;
  border-radius: 16px;
  border: 2px dashed #334155;
  color: #94a3b8;
  font-size: 16px;
`;