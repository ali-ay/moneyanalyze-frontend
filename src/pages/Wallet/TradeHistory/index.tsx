import React, { useMemo } from 'react';
import { useTransactionsLogic } from './logic';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../../components/ui/Layout.styles';
import { MetricsGrid, MetricCard, CardHeader, CardTitle, CardIcon, CardValue } from '../../../components/ui/Card.styles';
import { TableContainer, Table, Th, Td, TableRow, Badge } from '../../../components/ui/Table.styles';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Transactions: React.FC = () => {
  const { transactions, loading } = useTransactionsLogic();

  const getTypeText = (type: string) => {
    switch (type) {
      case 'BUY': return 'ALIM';
      case 'SELL': return 'SATIM';
      default: return type;
    }
  };

  const metrics = useMemo(() => {
    let totalBuyVolume = 0;
    let totalSellVolume = 0;

    transactions.forEach(tx => {
      if (tx.type === 'BUY') totalBuyVolume += Number(tx.total);
      if (tx.type === 'SELL') totalSellVolume += Number(tx.total);
    });

    const netProfit = totalSellVolume - totalBuyVolume;
    const profitPercentage = totalBuyVolume > 0 ? (netProfit / totalBuyVolume) * 100 : 0;

    return {
      totalCount: transactions.length,
      buyVolume: totalBuyVolume,
      sellVolume: totalSellVolume,
      netProfit,
      profitPercentage
    };
  }, [transactions]);

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>İşlem Geçmişi</PageTitle>
        <PageSubtitle>Yaptığınız tüm alım ve satım işlemlerinin dökümü ve performans özeti.</PageSubtitle>
      </PageHeader>

      {!loading && transactions.length > 0 && (
        <MetricsGrid>
          <MetricCard style={{ gridColumn: 'span 2' }}>
            <CardHeader>
              <CardTitle>Genel Performans (Kar / Zarar)</CardTitle>
              <CardIcon $variant={metrics.netProfit >= 0 ? 'success' : 'danger'}>
                {metrics.netProfit >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
              </CardIcon>
            </CardHeader>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ 
                fontSize: '32px', 
                fontWeight: '800', 
                color: metrics.netProfit >= 0 ? '#0F9D58' : '#DB4437',
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px'
              }}>
                {metrics.netProfit >= 0 ? '+' : ''}{metrics.netProfit.toLocaleString('tr-TR', { maximumFractionDigits: 2 })} USDT
                <span style={{ fontSize: '18px', fontWeight: '600', opacity: 0.8 }}>
                  ({metrics.profitPercentage >= 0 ? '+' : ''}{metrics.profitPercentage.toFixed(2)}%)
                </span>
              </div>
              <div style={{ color: '#5F6368', fontSize: '14px', fontWeight: '500' }}>
                Toplam {metrics.totalCount} adet işlem üzerinden hesaplanmıştır.
              </div>
            </div>
          </MetricCard>

          <MetricCard>
            <CardHeader>
              <CardTitle>Toplam Alım Hacmi</CardTitle>
              <CardIcon $variant="primary">
                <ArrowDownRight size={20} />
              </CardIcon>
            </CardHeader>
            <CardValue>${metrics.buyVolume.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</CardValue>
          </MetricCard>

          <MetricCard>
            <CardHeader>
              <CardTitle>Toplam Satım Hacmi</CardTitle>
              <CardIcon $variant="primary">
                <ArrowUpRight size={20} />
              </CardIcon>
            </CardHeader>
            <CardValue>${metrics.sellVolume.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}</CardValue>
          </MetricCard>
        </MetricsGrid>
      )}

      {loading ? (
        <LoadingState>Veriler yükleniyor...</LoadingState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Tarih</Th>
                <Th>İşlem Tipi</Th>
                <Th>Sembol</Th>
                <Th>Kaynak</Th>
                <Th>Miktar</Th>
                <Th>Fiyat</Th>
                <Th>Toplam Tutar</Th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => {
                const isBist = tx.symbol.includes('.IS') || tx.symbol.length <= 6; // Simple heuristic
                const currency = isBist ? '₺' : '$';
                return (
                  <TableRow key={tx.id}>
                    <Td>{new Date(tx.createdAt).toLocaleString('tr-TR')}</Td>
                    <Td>
                      <Badge type={tx.type}>
                        {getTypeText(tx.type)}
                      </Badge>
                    </Td>
                    <Td style={{ fontWeight: 'bold' }}>{tx.symbol}</Td>
                    <Td>
                      <Badge type={tx.origin === 'MANUAL' ? 'secondary' : 'primary'} style={{ fontSize: '10px', background: tx.origin === 'MANUAL' ? '#f1f3f4' : '#e8f0fe', color: tx.origin === 'MANUAL' ? '#5f6368' : '#1a73e8' }}>
                        {tx.origin === 'MANUAL' ? 'MANUEL' : 'BOT'}
                      </Badge>
                    </Td>
                    <Td>{tx.amount}</Td>
                    <Td>{currency}{tx.price.toLocaleString('tr-TR')}</Td>
                    <Td style={{ 
                      color: tx.type === 'BUY' ? '#ef4444' : '#10b981',
                      fontWeight: 'bold'
                    }}>
                      {tx.type === 'BUY' ? '-' : '+'}{currency}{tx.total.toLocaleString('tr-TR', { maximumFractionDigits: 2 })}
                    </Td>
                  </TableRow>
                );
              })}
            </tbody>
          </Table>
          
          {transactions.length === 0 && (
            <EmptyState>Henüz bir alım-satım işleminiz bulunmuyor.</EmptyState>
          )}
        </TableContainer>
      )}
    </PageContainer>
  );
};

export default Transactions;