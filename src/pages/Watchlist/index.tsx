import React, { useState } from 'react';
import styled from 'styled-components';
import { useWatchlistLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { HStack } from '../../components/primitives/Flex';
import { Trash2, Plus, Eye, Trash } from 'lucide-react';
import * as S from './Watchlist.styles';

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
    handleClearAll,
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

  const handleClearClick = async () => {
    if (watchlist.length === 0) return;
    const confirmed = window.confirm(
      `${mode === 'stock' ? 'BIST' : 'Kripto'} takip listendeki tüm öğeler silinecek. Devam edilsin mi?`
    );
    if (!confirmed) return;
    await handleClearAll();
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
          <HStack $gap="sm">
            <Button
              $variant="danger"
              onClick={handleClearClick}
              disabled={watchlist.length === 0 || adding}
            >
              <Trash size={16} /> Listeyi Temizle
            </Button>
            <Button $variant="primary" onClick={handleAddClick} disabled={adding}>
              <Plus size={16} /> Sembol Ekle
            </Button>
          </HStack>
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
                  <Th>Periyot</Th>
                  <Th $sortable onClick={() => requestSort('entryPrice')}>
                    Sinyal Fiyatı{getSortIndicator('entryPrice')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('currentPrice')}>
                    Anlık Fiyat{getSortIndicator('currentPrice')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('profitPercent')}>
                    Sinyal K/Z (%){getSortIndicator('profitPercent')}
                  </Th>
                  <Th $sortable onClick={() => requestSort('priceChangePercent')}>
                    Değişim (Günlük){getSortIndicator('priceChangePercent')}
                  </Th>
                  <S.RightAlignTh>İşlem</S.RightAlignTh>
                </tr>
              </thead>
              <tbody>
                {watchlist.map(item => {
                  const dailyChange = item.priceChangePercent || 0;
                  const profit = item.profitPercent || 0;
                  const isPositiveDaily = dailyChange >= 0;
                  const isPositiveProfit = profit >= 0;

                  return (
                    <Tr key={item.id}>
                      <S.SymbolCell>{item.symbol}</S.SymbolCell>
                      <Td>
                        <S.PeriodBadge>
                          {item.period || 'Manuel'}
                        </S.PeriodBadge>
                      </Td>
                      <Td>{currency}{item.entryPrice?.toLocaleString() || '-'}</Td>
                      <Td>{currency}{item.currentPrice?.toLocaleString() || '-'}</Td>
                      <Td>
                        <S.ChangeValueWithSize $isPositive={isPositiveProfit}>
                          {isPositiveProfit ? '+' : ''}{profit.toFixed(2)}%
                        </S.ChangeValueWithSize>
                      </Td>
                      <Td>
                        <S.ProfitChangeValue $isPositive={isPositiveDaily}>
                          {isPositiveDaily ? '▲' : '▼'} %{Math.abs(dailyChange).toFixed(2)}
                        </S.ProfitChangeValue>
                      </Td>
                      <S.RightAlignTd>
                        <Button
                          $variant="danger"
                          $size="sm"
                          onClick={() => handleRemove(item.symbol)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </S.RightAlignTd>
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
