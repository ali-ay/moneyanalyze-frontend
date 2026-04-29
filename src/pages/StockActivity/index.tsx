import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';
import { HStack, VStack } from '../../components/primitives/Flex';
import { History, TrendingUp, TrendingDown, Clock, Info, ArrowRightLeft } from 'lucide-react';

const LogTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px 16px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #5F6368;
  border-bottom: 1px solid #F1F3F4;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Td = styled.td`
  padding: 16px;
  font-size: 0.875rem;
  border-bottom: 1px solid #F1F3F4;
`;

const ActionBadge = styled.span<{ $action: string }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => props.$action === 'ADD' ? '#E6F4EA' : '#FCE8E6'};
  color: ${props => props.$action === 'ADD' ? '#137333' : '#C5221F'};
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const ProfitBadge = styled.span<{ $positive: boolean }>`
  color: ${props => props.$positive ? '#0F9D58' : '#DB4437'};
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 4px;
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
  }, []);

  if (loading) return <LoadingState>Kayıtlar yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <PageHeader>
        <VStack $gap={4}>
          <PageTitle>
            <HStack $gap={10} $align="center">
              <History size={28} color="#1A73E8" />
              Hisse Hareket Kaydı
            </HStack>
          </PageTitle>
          <PageSubtitle>
            Yapay zekanın otomatik takip (Ekle/Çıkar) hareketlerini buradan izleyebilirsiniz.
          </PageSubtitle>
        </VStack>
      </PageHeader>

      <Card>
        <Card.Body>
          {logs.length === 0 ? (
            <EmptyState>Henüz bir hareket kaydı bulunmuyor. AI analizleri başladığında burada görünecektir.</EmptyState>
          ) : (
            <LogTable>
              <thead>
                <tr>
                  <Th>Zaman</Th>
                  <Th>Hisse / Periyot</Th>
                  <Th>İşlem</Th>
                  <Th>Giriş / Çıkış Fiyatı</Th>
                  <Th>Sonuç (K/Z)</Th>
                  <Th>Açıklama</Th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <Td>
                      <HStack $gap={6} $align="center" style={{ color: '#5F6368', fontSize: '0.8125rem' }}>
                        <Clock size={14} />
                        {new Date(log.createdAt).toLocaleString('tr-TR')}
                      </HStack>
                    </Td>
                    <Td>
                      <VStack>
                        <span style={{ fontWeight: 800, color: '#202124' }}>{log.symbol}</span>
                        <span style={{ fontSize: '0.75rem', color: '#1A73E8', fontWeight: 600, textTransform: 'uppercase' }}>
                          {log.period}
                        </span>
                      </VStack>
                    </Td>
                    <Td>
                      <ActionBadge $action={log.action}>
                        {log.action === 'ADD' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {log.action === 'ADD' ? 'TAKİBE ALINDI' : 'TAKİPTEN ÇIKTI'}
                      </ActionBadge>
                    </Td>
                    <Td>
                      <VStack>
                        <span style={{ fontWeight: 600 }}>₺{log.price?.toLocaleString() || '0'}</span>
                        {log.exitPrice !== null && log.exitPrice !== undefined && (
                          <HStack $gap={4} $align="center" style={{ fontSize: '0.75rem', color: '#5F6368' }}>
                            <ArrowRightLeft size={12} />
                            ₺{log.exitPrice.toLocaleString()}
                          </HStack>
                        )}
                      </VStack>
                    </Td>
                    <Td>
                      {log.profit !== null && log.profit !== undefined ? (
                        <ProfitBadge $positive={(log.profit || 0) >= 0}>
                          {(log.profit || 0) >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          %{Math.abs(log.profit || 0).toFixed(2)}
                        </ProfitBadge>
                      ) : (
                        <span style={{ color: '#9AA0A6' }}>İşlem sürüyor...</span>
                      )}
                    </Td>
                    <Td>
                      <HStack $gap={6} $align="center" style={{ color: '#5F6368', fontSize: '0.8125rem', maxWidth: '250px' }}>
                        <Info size={14} />
                        {log.description}
                      </HStack>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </LogTable>
          )}
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default StockActivityPage;
