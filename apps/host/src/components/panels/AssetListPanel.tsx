import React from 'react';
import styled from 'styled-components';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const PanelContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing?.lg || '24px'};
`;

const PanelTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => props.theme.colors.textMain};
  margin: 0 0 ${props => props.theme.spacing?.lg || '24px'} 0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th<{ $sortable?: boolean }>`
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${props => props.theme.colors.textSecondary};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  cursor: ${props => props.$sortable ? 'pointer' : 'default'};
  user-select: none;
  white-space: nowrap;

  &:hover {
    color: ${props => props.$sortable ? props.theme.colors.primary : 'inherit'};
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 0.6875rem;

    &.hide-mobile {
      display: none;
    }
  }
`;

const Td = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
  border-bottom: 1px solid ${props => props.theme.colors.border};

  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 0.8125rem;

    &.hide-mobile {
      display: none;
    }
  }
`;

const Tr = styled.tr`
  transition: background 0.2s ease;

  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const SymbolCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;

  @media (max-width: 768px) {
    gap: 8px;
    font-size: 0.875rem;
  }
`;

const ProfitText = styled.span<{ $positive?: boolean }>`
  color: ${props => props.$positive
    ? props.theme.colors.success
    : props.theme.colors.danger};
  font-weight: 700;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
`;

export interface Asset {
  symbol: string;
  originalSymbol?: string;
  amount: number;
  averagePrice: number;
}

export interface AssetListPanelProps {
  assets: Asset[];
  livePrices: { [key: string]: number };
  loading?: boolean;
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
  onSell?: (asset: Asset, currentPrice: number) => void;
  title?: string;
  currency?: '$' | '₺';
}

const getSortIndicator = (key: string, sortConfig?: { key: string; direction: 'asc' | 'desc' } | null) => {
  if (sortConfig?.key === key) {
    return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
  }
  return '';
};

export const AssetListPanel: React.FC<AssetListPanelProps> = ({
  assets,
  livePrices,
  loading,
  sortConfig,
  onSort,
  onSell,
  title = 'Varlıklarım',
  currency = '$',
}) => {
  return (
    <PanelContainer>
      <Card>
        <Card.Body>
          <PanelTitle>{title}</PanelTitle>

          {loading && assets.length === 0 ? (
            <EmptyState>Yükleniyor...</EmptyState>
          ) : assets.length === 0 ? (
            <EmptyState>Henüz varlığınız bulunmuyor.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th $sortable onClick={() => onSort?.('symbol')}>
                    Sembol{getSortIndicator('symbol', sortConfig)}
                  </Th>
                  <Th $sortable onClick={() => onSort?.('amount')}>
                    Miktar{getSortIndicator('amount', sortConfig)}
                  </Th>
                  <Th $sortable className="hide-mobile" onClick={() => onSort?.('averagePrice')}>
                    Ort. Fiyat{getSortIndicator('averagePrice', sortConfig)}
                  </Th>
                  <Th $sortable onClick={() => onSort?.('currentPrice')}>
                    Güncel{getSortIndicator('currentPrice', sortConfig)}
                  </Th>
                  <Th $sortable onClick={() => onSort?.('profit')}>
                    Kâr/Zarar{getSortIndicator('profit', sortConfig)}
                  </Th>
                  {onSell && <Th>İşlem</Th>}
                </tr>
              </thead>
              <tbody>
                {assets.map(asset => {
                  const currentPrice = livePrices[asset.symbol] || asset.averagePrice;
                  const profitPercent = asset.averagePrice > 0
                    ? ((currentPrice - asset.averagePrice) / asset.averagePrice) * 100
                    : 0;
                  const isPositive = profitPercent >= 0;

                  return (
                    <Tr key={asset.symbol}>
                      <Td>
                        <SymbolCell>{asset.symbol}</SymbolCell>
                      </Td>
                      <Td>{asset.amount.toFixed(assets[0]?.symbol?.includes('USDT') ? 4 : 2)}</Td>
                      <Td className="hide-mobile">{currency}{asset.averagePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                      <Td>{currency}{currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Td>
                      <Td>
                        <ProfitText $positive={isPositive}>
                          {isPositive ? '+' : ''}
                          {profitPercent.toFixed(2)}%
                        </ProfitText>
                      </Td>
                      {onSell && (
                        <Td>
                          <Button
                            $variant="danger"
                            $size="sm"
                            onClick={() => onSell(asset, currentPrice)}
                            style={{ padding: '4px 12px', fontSize: '0.75rem' }}
                          >
                            Sat
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </PanelContainer>
  );
};
