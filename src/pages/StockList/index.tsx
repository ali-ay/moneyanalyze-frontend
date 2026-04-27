import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';
import { useMarketMode } from '../../context/MarketModeContext';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  svg { 
    position: absolute; 
    left: 14px; 
    top: 50%; 
    transform: translateY(-50%); 
    color: #5F6368; 
  }
  input {
    width: 100%;
    background: white;
    border: 1px solid #DADCE0;
    padding: 12px 16px 12px 42px;
    border-radius: 12px;
    font-size: 14px;
    color: #202124;
    &:focus { 
      outline: none; 
      border-color: #1A73E8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
    }
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    color: #5F6368;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #F1F3F4;
  }
  td {
    padding: 16px;
    border-bottom: 1px solid #F1F3F4;
    font-size: 14px;
    font-weight: 600;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #F8F9FA;
  }
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: #E8F0FE;
    color: #1A73E8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
  }
  .label-box {
    display: flex;
    flex-direction: column;
    .name { font-weight: 700; color: #202124; }
    .symbol { font-size: 11px; color: #5F6368; }
  }
`;

const ChangeValue = styled.span<{ $up?: boolean }>`
  color: ${props => props.$up ? '#0F9D58' : '#DB4437'};
  font-weight: 700;
`;

const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #5F6368;
  gap: 16px;
`;

const StockListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { mode } = useMarketMode();
  const { marketData, loading, error } = useDashboardData();

  const filteredData = marketData.filter(item =>
    item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const title = mode === 'stock' ? 'Tüm Borsa Hisseleri' : 'Tüm Kripto Varlıklar';
  const currency = mode === 'stock' ? '₺' : '$';

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <PageHeader>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <Button $variant="secondary" $size="sm" onClick={() => navigate(-1)} style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0 }}>
            <ArrowLeft size={20} />
          </Button>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>{title}</h2>
        </div>
        <p style={{ margin: '4px 0 0', color: '#5F6368', fontSize: '13px' }}>Piyasadaki tüm varlıkların anlık durumları</p>
      </PageHeader>

      <Card>
        <Card.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <SearchContainer>
            <Search size={18} />
            <input
              type="text"
              placeholder="Varlık veya sembol ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#5F6368' }}>
            Toplam: {filteredData.length} Varlık
          </div>
        </Card.Header>
        <Card.Body $noPadding>
          {loading ? (
            <LoadingBox>
              <Loader2 size={40} className="animate-spin" color="#1A73E8" />
              <span>Piyasa verileri taranıyor...</span>
            </LoadingBox>
          ) : error ? (
            <LoadingBox>
              <AlertCircle size={40} color="#DB4437" />
              <span style={{ color: '#DB4437', fontWeight: 700 }}>{error}</span>
            </LoadingBox>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <DataTable>
                <thead>
                  <tr>
                    <th>VARLIK</th>
                    <th>FİYAT</th>
                    <th>24S DEĞİŞİM</th>
                    <th style={{ textAlign: 'right' }}>İŞLEM</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => {
                    const price = item.price || '0.00';
                    const change = parseFloat(item.change || '0');
                    const isUp = change >= 0;

                    return (
                      <TableRow key={item.symbol} onClick={() => navigate(mode === 'stock' ? `/dashboard/stock/${item.symbol}` : `/dashboard/coin/${item.symbol}`)}>
                        <td>
                          <AssetInfo>
                            <div className="icon">{item.symbol.substring(0, 3)}</div>
                            <div className="label-box">
                              <div className="name">{item.symbol}</div>
                              <div className="symbol">{mode === 'stock' ? item.name : `${item.symbol}/USDT`}</div>
                            </div>
                          </AssetInfo>
                        </td>
                        <td>{currency}{price}</td>
                        <td>
                          <ChangeValue $up={isUp}>
                            {isUp ? '+' : ''}{item.change || '0.00'}%
                          </ChangeValue>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Button $variant="primary" $size="sm">Detay</Button>
                        </td>
                      </TableRow>
                    );
                  })}
                </tbody>
              </DataTable>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default StockListPage;
