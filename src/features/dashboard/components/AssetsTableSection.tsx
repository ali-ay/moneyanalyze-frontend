import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useMarketMode } from '../../../context/MarketModeContext';

const SearchContainer = styled.div`
  position: relative;
  width: 320px;
  svg { 
    position: absolute; 
    left: 14px; 
    top: 50%; 
    transform: translateY(-50%); 
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'}; 
  }
  input {
    width: 100%;
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    border: none;
    padding: 10px 16px 10px 42px;
    border-radius: ${props => props.theme?.radius?.md || '12px'};
    font-size: 0.8125rem;
    color: ${props => props.theme?.colors?.textMain || '#202124'};
    &:focus { 
      outline: none; 
      background: ${props => props.theme?.colors?.secondary || '#E8F0FE'}; 
    }
  }
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    text-align: left;
    padding: 12px 16px;
    font-size: 0.6875rem;
    font-weight: 700;
    color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  }
  td {
    padding: 16px;
    border-bottom: 1px solid ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
  }
  &:last-child td { border-bottom: none; }
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .icon {
    width: 32px;
    height: 32px;
    border-radius: ${props => props.theme?.radius?.full || '999px'};
    background: ${props => props.theme?.colors?.surfaceHover || '#F8F9FA'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.6875rem;
    font-weight: 800;
  }
  .label-box {
    display: flex;
    flex-direction: column;
    .name { font-weight: 700; color: ${props => props.theme?.colors?.textMain || '#202124'}; }
    .symbol { font-size: 0.6875rem; color: ${props => props.theme?.colors?.textSecondary || '#5F6368'}; }
  }
`;

const ChangeValue = styled.span<{ $up?: boolean }>`
  color: ${props => props.$up ? (props.theme?.colors?.success || '#0F9D58') : (props.theme?.colors?.danger || '#DB4437')};
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 48px;
  text-align: center;
  color: ${props => props.theme?.colors?.textSecondary || '#5F6368'};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

interface AssetsTableProps {
  data: any[];
  loading?: boolean;
  error?: string | null;
}

const ResponsiveCardHeader = styled(Card.Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const ResponsiveSearchContainer = styled(SearchContainer)`
  @media (max-width: ${props => props.theme?.breakpoints?.mobile || '768px'}) {
    width: 100%;
  }
`;

export const AssetsTableSection: React.FC<AssetsTableProps> = ({ data, loading, error }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { mode } = useMarketMode();

  const hasData = data && data.length > 0;

  const filteredData = hasData
    ? data.filter(item =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    : [];

  const displayData = searchTerm.trim() === ''
    ? filteredData.slice(0, 5)
    : filteredData;

  const handleCoinClick = (symbol: string) => {
    const path = mode === 'stock'
      ? `/dashboard/stock/${symbol}`
      : `/dashboard/coin/${symbol}`;
    navigate(path);
  };

  const title = mode === 'stock' ? 'Borsa Hisseleri' : 'Kripto Varlıklar';
  const placeholder = mode === 'stock' ? 'Hisse Ara (Örn: GARAN, THYAO...)' : 'Varlık Ara (Örn: BTC, ETH...)';
  const currency = mode === 'stock' ? '₺' : '$';

  return (
    <Card>
      <ResponsiveCardHeader>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>{title}</h3>
        <ResponsiveSearchContainer>
          <Search size={16} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </ResponsiveSearchContainer>
      </ResponsiveCardHeader>
      <Card.Body $noPadding>
        <div style={{ overflowX: 'auto', padding: '0 24px 24px' }}>
          {loading && !hasData ? (
            <EmptyState>
              <Loader2 size={32} className="animate-spin" style={{ color: '#1A73E8' }} />
              <p>Piyasa verileri yükleniyor...</p>
            </EmptyState>
          ) : error && !hasData ? (
            <EmptyState>
              <AlertCircle size={32} style={{ color: '#DB4437' }} />
              <p style={{ color: '#DB4437', fontWeight: 600 }}>{error}</p>
              <p style={{ fontSize: '0.75rem' }}>Piyasa verilerine şu an erişilemiyor.</p>
            </EmptyState>
          ) : filteredData.length === 0 && searchTerm !== '' ? (
            <EmptyState>
              <Search size={32} style={{ opacity: 0.3 }} />
              <p>"{searchTerm}" ile eşleşen varklık bulunamadı.</p>
            </EmptyState>
          ) : (
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
                {displayData.map((coin) => {
                  const price = coin.price || '0.00';
                  const change = parseFloat(coin.change || '0');
                  const isUp = change >= 0;
                  return (
                    <TableRow key={coin.symbol} onClick={() => handleCoinClick(coin.symbol)}>
                      <td>
                        <AssetInfo>
                          <div className="icon">
                            {coin.symbol.substring(0, 3)}
                          </div>
                          <div className="label-box">
                            <div className="name">{coin.symbol}</div>
                            <div className="symbol">{mode === 'stock' ? coin.name : `${coin.symbol}/USDT`}</div>
                          </div>
                        </AssetInfo>
                      </td>
                      <td>{currency}{price}</td>
                      <td>
                        <ChangeValue $up={isUp}>
                          {isUp ? '+' : ''}{coin.change || '0.00'}%
                        </ChangeValue>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button $variant="primary" $size="sm" onClick={(e) => {
                          e.stopPropagation(); // Prevent row click
                          handleCoinClick(coin.symbol);
                        }}>
                          İşlem Yap
                        </Button>
                      </td>
                    </TableRow>
                  );
                })}
              </tbody>
            </DataTable>
          )}
        </div>

        {hasData && searchTerm === '' && (
          <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'center' }}>
            <Button
              $variant="secondary"
              style={{ width: '100%', padding: '12px', fontWeight: 700, borderRadius: '12px' }}
              onClick={() => navigate('/stocks')}
            >
              Tüm Listeleri Görüntüle
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};
