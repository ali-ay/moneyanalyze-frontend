import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Search, Loader2, AlertCircle, ArrowLeft, ArrowUpDown, ChevronUp, ChevronDown, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../app/providers/AuthContext';
import { useNotification } from '../../app/providers/NotificationContext';
import api from '../../services/apiClient';
import { useDashboardData } from '../../features/dashboard/hooks/useDashboardData';
import { useMarketMode } from '../../context/MarketModeContext';
import * as S from './StockList.styles';

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
  svg { 
    position: absolute; 
    left: 14px; 
    top: 50%; 
    transform: translateY(-50%); 
    color: #5F6368; 
  }
  input {
    width: 100%;
    background: white;
    border: 1px solid #DADCE0;
    padding: 12px 16px 12px 42px;
    border-radius: 12px;
    font-size: 0.875rem;
    color: #202124;
    &:focus { 
      outline: none; 
      border-color: #1A73E8;
      box-shadow: 0 0 0 2px rgba(26, 115, 232, 0.1);
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
    color: #5F6368;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-bottom: 1px solid #F1F3F4;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
      background: #F8F9FA;
    }
  }
  td {
    padding: 16px;
    border-bottom: 1px solid #F1F3F4;
    font-size: 0.875rem;
    font-weight: 600;
  }
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    background: #F8F9FA;
  }
`;

const AssetInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  .icon {
    width: 36px;
    height: 36px;
    border-radius: 12px;
    background: #E8F0FE;
    color: #1A73E8;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 800;
  }
  .label-box {
    display: flex;
    flex-direction: column;
    .name-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .name { font-weight: 700; color: #202124; }
    .symbol { font-size: 0.6875rem; color: #5F6368; }
  }
`;

const IndexBadge = styled.span<{ $type: string }>`
  font-size: 0.625rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 800;
  background: ${props => props.$type === 'BIST30' ? '#E8F0FE' : '#F1F3F4'};
  color: ${props => props.$type === 'BIST30' ? '#1A73E8' : '#5F6368'};
  border: 1px solid ${props => props.$type === 'BIST30' ? '#1A73E820' : '#DADCE0'};
`;

const ChangeValue = styled.span<{ $up?: boolean }>`
  color: ${props => props.$up ? '#0F9D58' : '#DB4437'};
  font-weight: 700;
`;

const LoadingBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #5F6368;
  gap: 16px;
`;

const StockListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { mode } = useMarketMode();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const { marketData, loading, error, refreshData } = useDashboardData();
  const isAdmin = user?.role === 'ADMIN';
  
  const [sortKey, setSortKey] = useState<string>('symbol');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterIndex, setFilterIndex] = useState<string>('ALL');
  const [updatingSymbol, setUpdatingSymbol] = useState<string | null>(null);

  const getHighestIndex = (indices: string | null) => {
    if (!indices) return '';
    if (indices.includes('BIST30')) return 'BIST30';
    if (indices.includes('BIST50')) return 'BIST50';
    if (indices.includes('BIST100')) return 'BIST100';
    return '';
  };

  const handleUpdateIndex = async (symbol: string, selectedValue: string) => {
    try {
      setUpdatingSymbol(symbol);
      
      // Hiyerarşik etiketleme yapalım
      let finalIndices = '';
      if (selectedValue === 'BIST30') finalIndices = 'BIST30,BIST50,BIST100';
      else if (selectedValue === 'BIST50') finalIndices = 'BIST50,BIST100';
      else if (selectedValue === 'BIST100') finalIndices = 'BIST100';

      const response = await api.patch(`/stock/${symbol}/admin-update`, { indices: finalIndices });
      if (response.data.success) {
        showNotification(`${symbol} endeksi güncellendi`, 'success');
        refreshData();
      }
    } catch (err: any) {
      showNotification(err.response?.data?.message || 'Güncelleme başarısız', 'error');
    } finally {
      setUpdatingSymbol(null);
    }
  };

  useEffect(() => {
    console.log('📊 Stock List Data:', marketData);
  }, [marketData]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortedData = () => {
    let filtered = marketData.filter(item =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filterIndex !== 'ALL') {
      filtered = filtered.filter(item => item.indices?.includes(filterIndex));
    }

    return [...filtered].sort((a, b) => {
      let valA: any = a[sortKey as keyof typeof a];
      let valB: any = b[sortKey as keyof typeof b];

      // Özel durumlar için düzeltme
      if (sortKey === 'price' || sortKey === 'change' || sortKey === 'changePercent') {
        valA = parseFloat(valA || '0');
        valB = parseFloat(valB || '0');
      } else if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedData = getSortedData();

  const SortIcon = ({ column }: { column: string }) => {
    if (sortKey !== column) return <ArrowUpDown size={12} style={{ marginLeft: 4, opacity: 0.3 }} />;
    return sortDirection === 'asc' ? 
      <ChevronUp size={12} style={{ marginLeft: 4, color: '#1A73E8' }} /> : 
      <ChevronDown size={12} style={{ marginLeft: 4, color: '#1A73E8' }} />;
  };
  const title = mode === 'stock' ? 'Tüm Borsa Hisseleri' : 'Tüm Kripto Varlıklar';
  const currency = mode === 'stock' ? '₺' : '$';

  const activeStocks = sortedData.filter(s => s.isActive !== false);
  const backlogStocks = sortedData.filter(s => s.isActive === false);

  return (
    <S.PageContainer>
      <PageHeader>
        <S.HeaderLeft>
          <S.BackButtonStyled $variant="secondary" $size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </S.BackButtonStyled>
          <S.PageTitle>{title}</S.PageTitle>
        </S.HeaderLeft>
        <S.PageSubtitle>Piyasadaki tüm varlıkların anlık durumları</S.PageSubtitle>
      </PageHeader>

      <Card>
        <S.CardHeader as={Card.Header}>
          <SearchContainer>
            <Search size={18} />
            <input
              type="text"
              placeholder="Varlık veya sembol ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          {mode === 'stock' && (
            <select 
              value={filterIndex}
              onChange={(e) => setFilterIndex(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #DADCE0',
                outline: 'none',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#3C4043',
                cursor: 'pointer',
                background: '#F8F9FA'
              }}
            >
              <option value="ALL">Tüm Endeksler</option>
              <option value="BIST30">BIST 30</option>
              <option value="BIST50">BIST 50</option>
              <option value="BIST100">BIST 100</option>
            </select>
          )}
          <S.ItemCount>
            Aktif: {activeStocks.length} | Backlog: {backlogStocks.length}
          </S.ItemCount>
        </S.CardHeader>
        <Card.Body $noPadding>
          {loading ? (
            <LoadingBox>
              <Loader2 size={40} className="animate-spin" color="#1A73E8" />
              <span>Piyasa verileri taranıyor...</span>
            </LoadingBox>
          ) : error ? (
            <LoadingBox>
              <AlertCircle size={40} color="#DB4437" />
              <S.ErrorMessage>{error}</S.ErrorMessage>
            </LoadingBox>
          ) : (
            <S.TableWrapper>
              <DataTable>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('symbol')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        VARLIK <SortIcon column="symbol" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('price')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        FİYAT <SortIcon column="price" />
                      </div>
                    </th>
                    {mode === 'stock' && (
                      <th onClick={() => handleSort('indices')}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          ENDEKS {isAdmin && <Settings size={12} style={{ marginLeft: 4 }} />} <SortIcon column="indices" />
                        </div>
                      </th>
                    )}
                    <th onClick={() => handleSort('change')}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        24S DEĞİŞİM <SortIcon column="change" />
                      </div>
                    </th>
                    <S.HeaderCell>İŞLEM</S.HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {activeStocks.map((item) => {
                    const price = item.price || '0.00';
                    const change = parseFloat(item.change || '0');
                    const isUp = change >= 0;

                    return (
                      <TableRow key={item.symbol} onClick={() => navigate(mode === 'stock' ? `/dashboard/stock/${item.symbol}` : `/dashboard/coin/${item.symbol}`)}>
                        <td>
                          <AssetInfo>
                            <div className="icon">{item.symbol.substring(0, 3)}</div>
                            <div className="label-box">
                              <div className="name-row">
                                <div className="name">{item.symbol}</div>
                              </div>
                              <div className="symbol">{mode === 'stock' ? item.name : `${item.symbol}/USDT`}</div>
                            </div>
                          </AssetInfo>
                        </td>
                        <td>{currency}{price}</td>
                        {mode === 'stock' && (
                          <td>
                            {isAdmin ? (
                              <select
                                value={getHighestIndex(item.indices)}
                                disabled={updatingSymbol === item.symbol}
                                onChange={(e) => handleUpdateIndex(item.symbol, e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '0.75rem',
                                  borderRadius: '6px',
                                  border: '1px solid #DADCE0',
                                  background: updatingSymbol === item.symbol ? '#F1F3F4' : '#FFF',
                                  color: '#3C4043',
                                  fontWeight: 600,
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="">---</option>
                                <option value="BIST30">BIST 30</option>
                                <option value="BIST50">BIST 50</option>
                                <option value="BIST100">BIST 100</option>
                              </select>
                            ) : (
                              <S.HStack $gap="4px">
                                {getHighestIndex(item.indices) && (
                                  <IndexBadge $type={getHighestIndex(item.indices)}>
                                    {getHighestIndex(item.indices)}
                                  </IndexBadge>
                                )}
                              </S.HStack>
                            )}
                          </td>
                        )}
                        <td>
                          <ChangeValue $up={isUp}>
                            {isUp ? '+' : ''}{item.change || '0.00'}%
                          </ChangeValue>
                        </td>
                        <S.ActionCell>
                          <Button $variant="primary" $size="sm">Detay</Button>
                        </S.ActionCell>
                      </TableRow>
                    );
                  })}

                  {backlogStocks.length > 0 && (
                    <>
                      <tr style={{ background: '#F1F3F4' }}>
                        <td colSpan={mode === 'stock' ? 5 : 4} style={{ padding: '10px 16px', fontSize: '0.65rem', fontWeight: 800, color: '#5F6368', letterSpacing: '1px' }}>
                          PASİF / VERİSİ GÜNCELLENMEYEN HİSSELER (BACKLOG)
                        </td>
                      </tr>
                      {backlogStocks.map((item) => (
                        <TableRow key={item.symbol} style={{ opacity: 0.5 }} onClick={() => navigate(mode === 'stock' ? `/dashboard/stock/${item.symbol}` : `/dashboard/coin/${item.symbol}`)}>
                          <td>
                            <AssetInfo>
                              <div className="icon" style={{ background: '#eee', color: '#999' }}>{item.symbol.substring(0, 3)}</div>
                              <div className="label-box">
                                <div className="name" style={{ color: '#666' }}>{item.symbol}</div>
                                <div className="symbol">{mode === 'stock' ? item.name : `${item.symbol}/USDT`}</div>
                              </div>
                            </AssetInfo>
                          </td>
                          <td style={{ color: '#999' }}>{currency}{item.price || '0.00'}</td>
                          {mode === 'stock' && (
                             <td>
                               <S.HStack $gap="4px" style={{ opacity: 0.6 }}>
                                 {getHighestIndex(item.indices) && (
                                   <IndexBadge $type={getHighestIndex(item.indices)}>
                                     {getHighestIndex(item.indices)}
                                   </IndexBadge>
                                 )}
                               </S.HStack>
                             </td>
                          )}
                          <td style={{ color: '#999' }}>---</td>
                          <S.ActionCell>
                            <Button $variant="secondary" $size="sm">İncele</Button>
                          </S.ActionCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </tbody>
              </DataTable>
            </S.TableWrapper>
          )}
        </Card.Body>
      </Card>
    </S.PageContainer>
  );
};

export default StockListPage;
