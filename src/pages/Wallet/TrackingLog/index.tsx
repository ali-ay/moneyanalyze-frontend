import React from 'react';
import { useTrackingLogLogic } from './logic';
import styled from 'styled-components';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../../components/ui/Layout.styles';
import { TableContainer, Table, Th, Td, TableRow, Badge } from '../../../components/ui/Table.styles';
import { ArrowUpRight, ArrowDownRight, History, Clock } from 'lucide-react';

const TrackingLog: React.FC = () => {
  const { transactions, livePrices, loading } = useTrackingLogLogic();

  return (
    <PageContainer>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <History size={32} color="#1A73E8" />
          <div>
            <PageTitle>Hisse Hareket Kaydı</PageTitle>
            <PageSubtitle>Cüzdanınıza eklediğiniz ve çıkardığınız tüm hisselerin tarihsel dökümü.</PageSubtitle>
          </div>
        </div>
      </PageHeader>

      {loading ? (
        <LoadingState>Hareketler yükleniyor...</LoadingState>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Tarih / Saat</Th>
                <Th>İşlem</Th>
                <Th>Hisse</Th>
                <Th>İşlem Fiyatı</Th>
                <Th>Anlık Fiyat</Th>
                <Th>Değişim (%)</Th>
                <Th>Miktar</Th>
                <Th>Toplam</Th>
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
                  <TableRow key={tx.id}>
                    <Td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={14} color="#9AA0A6" />
                        {new Date(tx.createdAt).toLocaleString('tr-TR')}
                      </div>
                    </Td>
                    <Td>
                      <Badge type={tx.type === 'BUY' ? 'BUY' : 'SELL'}>
                        {tx.type === 'BUY' ? 'EKLENDİ (ALIM)' : 'ÇIKARILDI (SATIM)'}
                      </Badge>
                    </Td>
                    <Td style={{ fontWeight: 'bold', color: '#1A73E8' }}>{tx.symbol}</Td>
                    <Td>₺{tx.price.toLocaleString('tr-TR')}</Td>
                    <Td>
                      {currentPrice 
                        ? `₺${currentPrice.toLocaleString('tr-TR')}` 
                        : <span style={{ color: '#9AA0A6' }}>Yükleniyor...</span>
                      }
                    </Td>
                    <Td>
                      {changePercent !== null ? (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          color: isPositive ? '#0F9D58' : '#DB4437',
                          fontWeight: 'bold'
                        }}>
                          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                          {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                        </div>
                      ) : '-'}
                    </Td>
                    <Td>{tx.amount}</Td>
                    <Td style={{ fontWeight: '600' }}>₺{tx.total.toLocaleString('tr-TR')}</Td>
                  </TableRow>
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
