import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/apiClient';
import { PageContainer, PageHeader, PageTitle, PageSubtitle, LoadingState, EmptyState } from '../../components/ui/Layout.styles';
import { Card } from '../../components/ui/Card';
import { HStack, VStack } from '../../components/primitives/Flex';
import { History, TrendingUp, TrendingDown, Clock, Info, ArrowRightLeft, Trash2, Search, Activity, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import * as S from './StockActivity.styles';

const LogTable = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 8px;
  margin-top: -8px;

  @media (max-width: 768px) {
    border-spacing: 0 4px;
    min-width: 700px; /* Force scroll but keep rows thin */
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #5F6368;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 0.6875rem;
  }
`;

const Tr = styled.tr`
  background: white;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    z-index: 10;
  }

  /* Tooltip açıldığında satırı en üste çıkar */
  &:has(${S.TooltipContainer}:hover) {
    z-index: 9999;
  }
`;

const Td = styled.td`
  padding: 20px 16px;
  font-size: 0.9375rem;
  border-top: 1px solid #F1F3F4;
  border-bottom: 1px solid #F1F3F4;

  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 0.8125rem;
    width: 58px;
  }
  
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
  justify-content: center;
  gap: 6px;
  border: 1px solid ${props => props.$action === 'ADD' ? 'rgba(15, 157, 88, 0.2)' : 'rgba(219, 68, 55, 0.2)'};

  @media (max-width: 768px) {
    padding: 6px;
    width: 48px;
    height: 20px;
    .btn-text { display: none; }
  }
`;

const PriceText = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-weight: 700;
  color: #202124;

  @media (max-width: 768px) {
    width: 58px;
  }
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

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  h4 { margin: 0; color: #202124; }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #5F6368;
`;

const ResponsiveHeader = styled(PageHeader)`
  @media (max-width: 992px) {
    .header-stack {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }
    
    .actions-stack {
      width: 100%;
      flex-direction: column;
      gap: 12px;
    }
  }
`;

import { useAuth } from '../../app/providers/AuthContext';

const StockActivityPage: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const fetchLogs = async (pageNum: number, append: boolean = false, search: string = searchTerm) => {
    try {
      const response = await api.get(`/stock/activity-logs?page=${pageNum}&search=${search}`);
      if (response.data.success) {
        const newLogs = response.data.data;
        setTotal(response.data.total || 0);
        if (newLogs.length < 50) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (append) {
          setLogs(prev => [...prev, ...newLogs]);
        } else {
          setLogs(newLogs);
        }
      }
    } catch (error) {
      console.error('Logs fetch error:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleCleanup = async () => {
    if (!window.confirm('Mükerrer (üst üste gelen) kayıtlar temizlenecektir. Emin misiniz?')) return;

    setIsCleaning(true);
    try {
      const response = await api.post('/stock/activity-logs/cleanup');
      if (response.data.success) {
        alert(response.data.message);
        // Sayfayı yenile
        setPage(1);
        fetchLogs(1, false);
      }
    } catch (error) {
      console.error('Cleanup error:', error);
      alert('Temizleme işlemi sırasında bir hata oluştu.');
    } finally {
      setIsCleaning(false);
    }
  };

  useEffect(() => {
    // İlk yükleme
    fetchLogs(1);
  }, []);

  // Arama değiştiğinde debounced fetch
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchLogs(1, false, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  useEffect(() => {
    // Canlı fiyatları güncellemek için interval
    // Sadece 1. sayfadayken ve arama yokken çalışır
    const interval = setInterval(() => {
      if (page === 1 && !loadingMore && !isCleaning && !searchTerm) {
        fetchLogs(1);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [page, loadingMore, isCleaning, searchTerm]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLogs(nextPage, true, searchTerm);
  };

  if (loading) return <LoadingState>Kayıtlar yükleniyor...</LoadingState>;

  return (
    <PageContainer>
      <ResponsiveHeader>
        <HStack className="header-stack" $justify="space-between" $align="center" style={{ width: '100%' }}>
          <VStack $gap="4px">
            <PageTitle>
              <HStack $gap="12px" $align="center">
                <History size={32} color="#1A73E8" />
                AI Hisse İşlem Dekontları
                {total > 0 && (
                  <S.StatsBadge>
                    <Activity size={14} />
                    {total.toLocaleString()} Hareket
                  </S.StatsBadge>
                )}
              </HStack>
            </PageTitle>
            <PageSubtitle>
              Yapay zekanın otomatik alım-satım ve takip hareketlerinin detaylı dökümü.
            </PageSubtitle>
          </VStack>

          <HStack className="actions-stack" $gap="16px" $align="center">
            <S.SearchContainer>
              <S.SearchIconWrapper>
                <Search size={18} />
              </S.SearchIconWrapper>
              <S.SearchInput
                placeholder="Hisse ara (Örn: THYAO)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </S.SearchContainer>

            {isAdmin && (
              <S.CleanupButton onClick={handleCleanup} disabled={isCleaning}>
                <Trash2 size={16} />
                {isCleaning ? 'Temizleniyor...' : 'Mükerrer Temizlik'}
              </S.CleanupButton>
            )}
          </HStack>
        </HStack>
      </ResponsiveHeader>

      <S.TableWrapper>
        {logs.length === 0 ? (
          <EmptyState>Henüz bir hareket kaydı bulunmuyor. AI analizleri başladığında burada görünecektir.</EmptyState>
        ) : (
          <>
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
                          <S.DateColumn as={HStack} $gap="6px" $align="center">
                            <Clock size={14} color="#1A73E8" />
                            {new Date(log.createdAt).toLocaleDateString('tr-TR')}
                          </S.DateColumn>
                          <S.TimeText>
                            {new Date(log.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </S.TimeText>
                        </VStack>
                      </Td>
                      <Td>
                        <VStack $gap="4px">
                          <S.SymbolText>{log.symbol.replace('.IS', '')}</S.SymbolText>
                          <S.PeriodBadge>
                            <span className="full-text">{log.period?.toUpperCase()} TARAMASI</span>
                            <span className="short-text">{log.period?.toUpperCase()}</span>
                          </S.PeriodBadge>
                        </VStack>
                      </Td>
                      <Td>
                        <ActionBadge $action={log.action}>
                          {isAdd ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          <span className="btn-text">{isAdd ? 'EKLENDİ' : 'ÇIKARILDI'}</span>
                        </ActionBadge>
                      </Td>
                      <Td>
                        <HStack $gap="20px">
                          <VStack>
                            <Label>{isAdd ? 'Giriş' : 'Alış'}</Label>
                            <PriceText>₺{log.price?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</PriceText>
                          </VStack>

                          <VStack>
                            <Label>{isAdd ? 'Anlık' : 'Çıkış'}</Label>
                            <S.PriceWithColor $entryPrice={isAdd}>
                              ₺{(isAdd ? log.currentPrice : log.exitPrice)?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '---'}
                            </S.PriceWithColor>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <VStack $gap="4px">
                          <Label>{isAdd ? 'Kar/Zarar' : 'Net K/Z'}</Label>
                          {profitValue !== null && profitValue !== undefined ? (
                            <S.ProfitBadgeWithSize $positive={isPositive}>
                              {isPositive ? '+' : ''}{profitValue.toFixed(2)}%
                            </S.ProfitBadgeWithSize>
                          ) : (
                            <S.CalculatingText>Hesaplanıyor...</S.CalculatingText>
                          )}
                        </VStack>
                      </Td>
                      <Td>
                        <S.TooltipContainer>
                          <S.NotesIcon as="div">
                            <Info size={22} color="#1A73E8" />
                          </S.NotesIcon>
                          <S.TooltipBox>
                            <div className="tooltip-header">Analiz Notu</div>
                            {log.description}
                          </S.TooltipBox>
                        </S.TooltipContainer>
                      </Td>
                    </Tr>
                  );
                })}
              </tbody>
            </LogTable>

            {hasMore && (
              <S.LoadMoreContainer>
                <S.LoadMoreButton onClick={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? 'Yükleniyor...' : (
                    <>
                      <ArrowRightLeft size={16} />
                      Daha Fazla Kayıt Göster
                    </>
                  )}
                </S.LoadMoreButton>
              </S.LoadMoreContainer>
            )}
          </>
        )}
      </S.TableWrapper>
    </PageContainer>
  );
};

export default StockActivityPage;
