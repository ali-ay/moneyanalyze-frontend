import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a; // Dashboard arka plan rengi
  color: #f8fafc;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
    padding-top: 80px;
  }
`;

export const HeaderSection = styled.div`
  margin-bottom: 30px;
  
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 8px;
  }

  p {
    color: #94a3b8; // Daha yumuşak bir gri
    font-size: 0.95rem;
  }
`;

export const TableWrapper = styled.div`
  background: #1e293b; // Dashboard kart rengi
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow-x: auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 650px;
  
  thead {
    tr {
      border-bottom: 1px solid #334155;
    }
    th {
      padding: 12px 16px;
      text-align: left;
      color: #94a3b8;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid #334155;
      transition: background 0.15s ease-in-out;

      &:hover {
        background: #1e293b; // Hover'da biraz daha açık bir ton istersen #334155 yapabilirsin
        filter: brightness(1.2);
      }
      
      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 16px;
      font-size: 0.9rem;
      color: #e2e8f0;

      &.symbol {
        font-weight: 600;
        color: #f8fafc;
      }

      &.total {
        font-weight: 600;
        color: #ffffff;
      }

      @media (max-width: 768px) {
        padding: 12px;
      }
    }
  }
`;

export const Badge = styled.span<{ type: 'BUY' | 'SELL' }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
  background: ${props => props.type === 'BUY' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.type === 'BUY' ? '#4ade80' : '#f87171'};
  border: 1px solid ${props => props.type === 'BUY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
`;

export const LoadingText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #94a3b8;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  background: #1e293b;
  border-radius: 12px;
  border: 1px dashed #334155;
`;