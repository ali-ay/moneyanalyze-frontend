import React, { useState } from 'react';
import styled from 'styled-components';
import { useWatchlistLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HStack } from '../../components/primitives/Flex';
import { Trash2, Plus, Eye } from 'lucide-react';

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
`;

const Td = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const Tr = styled.tr`
  transition: background 0.2s ease;
  &:hover {
    background: ${props => props.theme.colors.surfaceHover};
  }
`;

const ChangeValue = styled.span<{ $isPositive: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  font-size: 0.8125rem;
  padding: 4px 10px;
  border-radius: ${props => props.theme.radius.sm};
  color: ${props => props.$isPositive ? props.theme.colors.success : props.theme.colors.danger};
  background: ${props => props.$isPositive
    ? `${props.theme.colors.success}15`
    : `${props.theme.colors.danger}15`};
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px 0;
  color: ${props => props.theme.colors.textMain};
`;

const Watchlist: React.FC = () => {
  const {
    watchlist,
    loading,
    sortConfig,
    requestSort,
    handleRemove,
    handleAdd,
    mode,
    currency,
  } = useWatchlistLogic();

  const [adding, setAdding] = useState(false);

  const getSortIndicator = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  const handleAddClick = async () => {
    const placeholder = mode === 'stock'
      ? 'Hisse sembolü (örn. THYAO)'
      : 'Kripto sembolü (örn. BTC)';
    const sym = prompt(`${placeholder}:`);
    if (!sym) return;
    setAdding(true);
    try {
      await handleAdd(sym.toUpperCase());
    } finally {
      setAdding(false);
    }
  };

  if (loading && watchlist.length === 0) {
    return <LoadingState>Yükleniyor...</LoadingState>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <HStack $justify="space-between" $align="center" $fullWidth>
          <div>
            <PageTitle>Takip Listesi</PageTitle>
            <PageSubtitle>
              {mode === 'stock' ? 'BIST hisseleri' : 'Kripto varlıklar'} — anlık takip.
            </PageSubtitle>
          </div>
          <Button $variant="primary" onClick={handleAddClick} disabled={adding}>
            <Plus size={16} /> Sembol Ekle
          </Button>
        </HStack>
      </PageHeader>

      <Card>
        <Card.Body>
          <SectionTitle>
            <Eye size={20} /> Takip Listem
          </SectionTitle>

          {watchlist.length === 0 ? (
            <EmptyState>Henüz takip listesinde sembol bulunmuyor.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th $sortable onClick={() => requestSort('symbol')}>
                    Sembol{getSortIndicator('symbol')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('price')}>
                    Anlık Fiyat{getSortIndicator('price')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('addedPrice')}>
                    Eklenme Fiyatı{getSortIndicator('addedPrice')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('priceChangePercent')}>
                    Değişim (24s){getSortIndicator('priceChangePercent')}
                  </Th>
                  <Th style={{ textAlign: 'right' }}>İşlem</Th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(item => {
                  const change = item.priceChangePercent || 0;
                  const isPositive = change >= 0;

                  return (
                    <Tr key={item.symbol}>
                      <Td style={{ fontWeight: 700 }}>{item.symbol}</Td>
                      <Td>{currency}{item.price?.toLocaleString() || '-'}</Td>
                      <Td>
                        {item.addedPrice
                          ? `${currency}${item.addedPrice.toLocaleString()}`
                          : '-'}
                      </Td>
                      <Td>
                        {item.priceChangePercent !== undefined ? (
                          <ChangeValue $isPositive={isPositive}>
                            {isPositive ? '▲' : '▼'} %{Math.abs(change).toFixed(2)}
                          </ChangeValue>
                        ) : (
                          '-'
                        )}
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        <Button
                          $variant="danger"
                          $size="sm"
                          onClick={() => handleRemove(item.symbol)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default Watchlist;
