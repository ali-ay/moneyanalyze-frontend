import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';
import { HStack, VStack } from '../../components/primitives/Flex';
import { History, TrendingUp, TrendingDown, Clock, Info, ArrowRightLeft } from 'lucide-react';

const LogTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: -8px;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #5F6368;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Tr = styled.tr`
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
`;

const Td = styled.td`
  padding: 20px 16px;
  font-size: 0.9375rem;
  border-top: 1px solid #F1F3F4;
  border-bottom: 1px solid #F1F3F4;
  
  &:first-child {
    border-left: 1px solid #F1F3F4;
    border-radius: 12px 0 0 12px;
  }
  
  &:last-child {
    border-right: 1px solid #F1F3F4;
    border-radius: 0 12px 12px 0;
  }
`;

const ActionBadge = styled.span<{ $action: string }>`
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  background: ${props => props.$action === 'ADD' ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
  color: ${props => props.$action === 'ADD' ? '#0F9D58' : '#DB4437'};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid ${props => props.$action === 'ADD' ? 'rgba(15, 157, 88, 0.2)' : 'rgba(219, 68, 55, 0.2)'};
`;

const PriceText = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  color: #202124;
`;

const Label = styled.div`
  font-size: 0.6875rem;
  color: #80868B;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const ProfitBadge = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#0F9D58' : '#DB4437'};
  background: ${props => props.$positive ? 'rgba(15, 157, 88, 0.1)' : 'rgba(219, 68, 55, 0.1)'};
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9375rem;
`;

const StockActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/stock/activity-logs');
        if (response.data.success) {
          setLogs(response.data.data);
        }
      } catch (error) {
        console.error('Logs fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 30000); // 30 saniyede bir güncelle
    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingState>Kayıtlar yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <PageHeader>
        <VStack $gap="4px">
          <PageTitle>
            <HStack $gap="12px" $align="center">
              <History size={32} color="#1A73E8" />
              AI Hisse İşlem Dekontları
            </HStack>
          </PageTitle>
          <PageSubtitle>
            Yapay zekanın otomatik alım-satım ve takip hareketlerinin detaylı dökümü.
          </PageSubtitle>
        </VStack>
      </PageHeader>

      <div style={{ padding: '0 4px' }}>
        {logs.length === 0 ? (
          <EmptyState>Henüz bir hareket kaydı bulunmuyor. AI analizleri başladığında burada görünecektir.</EmptyState>
        ) : (
          <LogTable>
            <thead>
              <tr>
                <Th>İşlem Tarihi</Th>
                <Th>Varlık / Periyot</Th>
                <Th>İşlem Tipi</Th>
                <Th>Birim Fiyatlar</Th>
                <Th>Performans</Th>
                <Th>Analiz Notu</Th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => {
                const isAdd = log.action === 'ADD';
                const profitValue = isAdd ? log.liveProfit : log.profit;
                const isPositive = (profitValue || 0) >= 0;

                return (
                  <Tr key={log.id}>
                    <Td>
                      <VStack $gap="4px">
                        <HStack $gap="6px" $align="center" style={{ color: '#202124', fontWeight: 600 }}>
                          <Clock size={14} color="#1A73E8" />
                          {new Date(log.createdAt).toLocaleDateString('tr-TR')}
                        </HStack>
                        <span style={{ fontSize: '0.75rem', color: '#5F6368', marginLeft: '20px' }}>
                          {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </VStack>
                    </Td>
                    <Td>
                      <VStack $gap="4px">
                        <span style={{ fontWeight: 900, color: '#1A73E8', fontSize: '1.05rem' }}>{log.symbol.replace('.IS', '')}</span>
                        <div style={{ 
                          fontSize: '0.65rem', 
                          background: '#F8F9FA', 
                          padding: '2px 6px', 
                          borderRadius: '4px',
                          display: 'inline-block',
                          width: 'fit-content',
                          border: '1px solid #E8EAED',
                          fontWeight: 700,
                          color: '#5F6368'
                        }}>
                          {log.period?.toUpperCase()} TARAMASI
                        </div>
                      </VStack>
                    </Td>
                    <Td>
                      <ActionBadge $action={log.action}>
                        {isAdd ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                        {isAdd ? 'EKLENDİ' : 'ÇIKARILDI'}
                      </ActionBadge>
                    </Td>
                    <Td>
                      <HStack $gap="20px">
                        <VStack>
                          <Label>{isAdd ? 'Giriş Fiyatı' : 'Alış Fiyatı'}</Label>
                          <PriceText>₺{log.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</PriceText>
                        </VStack>
                        
                        <VStack>
                          <Label>{isAdd ? 'Anlık Fiyat' : 'Çıkış Fiyatı'}</Label>
                          <PriceText style={{ color: isAdd ? '#1A73E8' : '#202124' }}>
                            ₺{(isAdd ? log.currentPrice : log.exitPrice)?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '---'}
                          </PriceText>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <VStack $gap="4px">
                        <Label>{isAdd ? 'Anlık Kar/Zarar' : 'Net Kar/Zarar'}</Label>
                        {profitValue !== null && profitValue !== undefined ? (
                          <ProfitBadge $positive={isPositive} style={{ fontSize: '1rem' }}>
                            {isPositive ? '+' : ''}{profitValue.toFixed(2)}%
                          </ProfitBadge>
                        ) : (
                          <span style={{ color: '#9AA0A6', fontSize: '0.8125rem' }}>Hesaplanıyor...</span>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      <HStack $gap="8px" $align="flex-start" style={{ maxWidth: '280px' }}>
                        <Info size={16} color="#9AA0A6" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span style={{ color: '#5F6368', fontSize: '0.8125rem', lineHeight: '1.4' }}>
                          {log.description}
                        </span>
                      </HStack>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
          </LogTable>
        )}
      </div>
    </PageContainer>
  );
};

export default StockActivityPage;
