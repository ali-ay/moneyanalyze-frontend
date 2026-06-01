import React from 'react';
import * as S from './TrackingLog.styles';
import { useTrackingLogLogic } from './logic';
import { useNavigate } from 'react-router-dom';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../../components/ui/Layout.styles';
import { TableContainer, Table, Th, Td, TableRow, Badge } from '../../../components/ui/Table.styles';
import { ArrowUpRight, ArrowDownRight, History, Clock } from 'lucide-react';

const TrackingLog: React.FC = () => {
  const navigate = useNavigate();
  const { transactions, livePrices, loading, sortConfig, requestSort } = useTrackingLogLogic();

  const getSortIndicator = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    }
    return '';
  };

  return (
    <PageContainer>
      <PageHeader>
        <S.HeaderRow>
          <History size={32} color="#1A73E8" />
          <div>
            <PageTitle>Hisse Hareket Kaydı</PageTitle>
            <PageSubtitle>Cüzdanınıza eklediğiniz ve çıkardığınız tüm hisselerin tarihsel dökümü.</PageSubtitle>
          </div>
        </S.HeaderRow>
      </PageHeader>

      {loading ? (
        <LoadingState>Hareketler yükleniyor...</LoadingState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <S.SortableHeader as={Th} onClick={() => requestSort('createdAt')}>Tarih / Saat{getSortIndicator('createdAt')}</S.SortableHeader>
                <Th>İşlem</Th>
                <S.SortableHeader as={Th} onClick={() => requestSort('symbol')}>Hisse{getSortIndicator('symbol')}</S.SortableHeader>
                <Th>İşlem Tipi</Th>
                <S.SortableHeader as={Th} onClick={() => requestSort('price')}>İşlem Fiyatı{getSortIndicator('price')}</S.SortableHeader>
                <S.SortableHeader as={Th} onClick={() => requestSort('currentPrice')}>Anlık Fiyat{getSortIndicator('currentPrice')}</S.SortableHeader>
                <S.SortableHeader as={Th} onClick={() => requestSort('profit')}>Değişim (%){getSortIndicator('profit')}</S.SortableHeader>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const cleanSym = tx.symbol.replace('.IS', '');
                const currentPrice = livePrices[cleanSym];
                const changePercent = currentPrice
                  ? ((currentPrice - tx.price) / tx.price * 100)
                  : null;
                const isPositive = changePercent !== null && changePercent >= 0;

                return (
                  <S.ClickableRow
                    key={tx.id}
                    onClick={() => navigate(`/dashboard/stock/${cleanSym}`)}
                  >
                    <Td>
                      <S.DateCell>
                        <Clock size={14} color="#9AA0A6" />
                        {new Date(tx.createdAt).toLocaleString('tr-TR')}
                      </S.DateCell>
                    </Td>
                    <Td>
                      {tx.entryType === 'AI_SIGNAL' ? (
                        <Badge type="info" as={S.AISignalBadge}>
                          YAPAY ZEKA ({tx.period === 'weekly' ? 'Haftalık' : tx.period === 'monthly' ? 'Aylık' : tx.period})
                        </Badge>
                      ) : (
                        <Badge type={tx.type === 'BUY' ? 'BUY' : 'SELL'}>
                          {tx.type === 'BUY' ? 'EKLENDİ (ALIM)' : 'ÇIKARILDI (SATIM)'}
                        </Badge>
                      )}
                    </Td>
                    <S.SymbolCell>{cleanSym}</S.SymbolCell>
                    <Td>
                      <Badge type={tx.type === 'BUY' || tx.entryType === 'AI_SIGNAL' ? 'BUY' : 'SELL'}>
                        {tx.type === 'BUY' || tx.entryType === 'AI_SIGNAL' ? 'ALIM' : 'SATIM'}
                      </Badge>
                    </Td>
                    <Td>₺{tx.price.toLocaleString('tr-TR')}</Td>
                    <Td>
                      {currentPrice
                        ? `₺${currentPrice.toLocaleString('tr-TR')}`
                        : <S.LoadingText>Yükleniyor...</S.LoadingText>
                      }
                    </Td>
                    <Td>
                      {changePercent !== null ? (
                        <S.ChangeContainer $isPositive={isPositive}>
                          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                        </S.ChangeContainer>
                      ) : '-'}
                    </Td>
                  </S.ClickableRow>
                );
              })}
            </tbody>
          </Table>

          {transactions.length === 0 && (
            <EmptyState>Henüz bir hisse hareketi bulunmuyor.</EmptyState>
          )}
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default TrackingLog;
