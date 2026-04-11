import styled from 'styled-components';

export const Layout = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #0f172a;
  color: #f8fafc;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: 768px) {
    padding: 16px;
    padding-top: 80px; // MobileHeader yüksekliği
  }

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
    font-size: 14px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #38bdf8; // Başlığı biraz daha belirgin yaptık
  }

  h2 {
    font-size: 36px;
    font-weight: 800;
    color: #10b981;
    margin: 0;
  }
`;

// --- MASAÜSTÜ TABLO ---
export const PortfolioTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    display: none; // Mobilde tabloyu gizle
  }
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

// --- MOBİL KART YAPISI ---
export const MobileCardContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

export const AssetCard = styled.div`
  background: #1e293b;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #334155;
`;

export const CardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  &:last-child {
    margin-bottom: 0;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }
`;

export const SymbolInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 18px;
    color: #38bdf8;
  }

  span {
    color: #94a3b8;
    font-size: 13px;
  }
`;

export const PriceInfo = styled.div<{ $isProfit?: boolean }>`
  text-align: right;

  .price {
    font-size: 18px;
    font-weight: 700;
    color: #f8fafc;
  }

  .profit {
    font-size: 14px;
    font-weight: 600;
    color: ${props => props.$isProfit ? '#10b981' : '#ef4444'};
  }
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