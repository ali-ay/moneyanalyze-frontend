import React, { useState, useEffect } from 'react';
import * as S from './StockManagement.styles';
import { Plus, Trash2, RefreshCw, Search, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/apiClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const StockManagement: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [syncing, setSyncing] = useState(false);
  const [updatingSymbol, setUpdatingSymbol] = useState<string | null>(null);

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stocks');
      setStocks(res.data);
    } catch (e) {}
    setLoading(false);
  };

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
      let finalIndices = '';
      if (selectedValue === 'BIST30') finalIndices = 'BIST30,BIST50,BIST100';
      else if (selectedValue === 'BIST50') finalIndices = 'BIST50,BIST100';
      else if (selectedValue === 'BIST100') finalIndices = 'BIST100';

      const response = await api.patch(`/stock/${symbol}/admin-update`, { indices: finalIndices });
      if (response.data.success) {
        alert(`${symbol} endeksi güncellendi`);
        fetchStocks();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Güncelleme başarısız');
    } finally {
      setUpdatingSymbol(null);
    }
  };

  const handleAdd = async () => {
    try {
      await api.post('/admin/stocks', newStock);
      setShowAddModal(false);
      setNewStock({ symbol: '', name: '' });
      fetchStocks();
    } catch (e) {
      alert('Hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bu hisseyi silmek istediğinize emin misiniz?')) return;
    try {
      await api.delete(`/admin/stocks/${id}`);
      fetchStocks();
    } catch (e) {}
  };

  const handleSync = async () => {
    if (!window.confirm('JSON dosyasındaki tüm hisseler veritabanına aktarılacak. Onaylıyor musunuz?')) return;
    setSyncing(true);
    try {
      const res = await api.post('/admin/stocks/sync');
      alert(`${res.data.added} yeni hisse eklendi.`);
      fetchStocks();
    } catch (e) {}
    setSyncing(false);
  };

  const filteredStocks = stocks.filter(s => 
    s.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <S.Container>
      <S.Header>
        <div>
          <S.HeaderTitle>Hisse Senedi Yönetimi</S.HeaderTitle>
          <S.HeaderSubtitle>Sistemdeki tüm BIST hisselerini buradan yönetin.</S.HeaderSubtitle>
        </div>
        <S.ButtonGroup>
          <Button $variant="secondary" onClick={handleSync} disabled={syncing}>
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} style={{ marginRight: 8 }} />
            Dosyadan Senkronize Et
          </Button>
          <Button $variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Yeni Hisse Ekle
          </Button>
        </S.ButtonGroup>
      </S.Header>

      <Card>
        <S.CardContent>
          <S.Controls>
            <S.SearchBox>
              <Search size={18} />
              <input
                placeholder="Sembol veya isim ara..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </S.SearchBox>
            <S.StockCountLabel>
              Toplam: {filteredStocks.length} Hisse
            </S.StockCountLabel>
          </S.Controls>

          {loading ? (
            <S.LoadingContainer>
              <Loader2 size={32} className="animate-spin" color="#1A73E8" />
            </S.LoadingContainer>
          ) : stocks.length === 0 ? (
            <S.EmptyState>
              <AlertCircle size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p>Henüz hiç hisse senedi eklenmemiş.</p>
            </S.EmptyState>
          ) : (
            <S.TableWrapper>
              <S.StockTable>
                <thead>
                  <tr>
                    <th>SEMBOL</th>
                    <th>İSİM (OPSİYONEL)</th>
                    <th>ENDEKS</th>
                    <th>EKLEME TARİHİ</th>
                    <S.TableHeaderCell $textAlign="right">İŞLEMLER</S.TableHeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map(stock => (
                    <tr key={stock.id}>
                      <td>
                        <S.StockSymbol onClick={() => navigate(`/dashboard/stock/${stock.symbol}`)}>
                          {stock.symbol}
                        </S.StockSymbol>
                      </td>
                      <td>{stock.name || '-'}</td>
                      <td>
                        <select
                          value={getHighestIndex(stock.indices)}
                          disabled={updatingSymbol === stock.symbol}
                          onChange={(e) => handleUpdateIndex(stock.symbol, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '0.8125rem',
                            borderRadius: '8px',
                            border: '1px solid #DADCE0',
                            background: updatingSymbol === stock.symbol ? '#F1F3F4' : '#FFF',
                            color: '#3C4043',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <option value="">Endeks Yok (---)</option>
                          <option value="BIST30">BIST 30</option>
                          <option value="BIST50">BIST 50</option>
                          <option value="BIST100">BIST 100</option>
                        </select>
                      </td>
                      <S.CreatedAtCell>
                        {new Date(stock.createdAt).toLocaleDateString('tr-TR')}
                      </S.CreatedAtCell>
                      <S.ActionCell>
                        <Button $variant="danger" $size="sm" onClick={() => handleDelete(stock.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </S.ActionCell>
                    </tr>
                  ))}
                </tbody>
              </S.StockTable>
            </S.TableWrapper>
          )}
        </S.CardContent>
      </Card>

      {showAddModal && (
        <S.Modal>
          <S.ModalContent>
            <S.ModalTitle>Yeni Hisse Senedi Ekle</S.ModalTitle>
            <S.InputGroup>
              <label>Sembol (Örn: THYAO)</label>
              <input
                value={newStock.symbol}
                onChange={e => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
                placeholder="Örn: GARAN"
              />
            </S.InputGroup>
            <S.InputGroup>
              <label>Şirket İsmi (Opsiyonel)</label>
              <input
                value={newStock.name}
                onChange={e => setNewStock({ ...newStock, name: e.target.value })}
                placeholder="Örn: Garanti Bankası"
              />
            </S.InputGroup>
            <S.ModalButtonGroup>
              <Button $variant="secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>İptal</Button>
              <Button $variant="primary" style={{ flex: 1 }} onClick={handleAdd}>Ekle</Button>
            </S.ModalButtonGroup>
          </S.ModalContent>
        </S.Modal>
      )}
    </S.Container>
  );
};

export default StockManagement;
