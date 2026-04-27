import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, RefreshCw, Search, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/apiClient';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const Container = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9AA0A6; }
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border-radius: 8px;
    border: 1px solid #DADCE0;
    &:focus { outline: none; border-color: #1A73E8; }
  }
`;

const StockTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th { text-align: left; padding: 12px; color: #5F6368; font-size: 12px; border-bottom: 1px solid #F1F3F4; }
  td { padding: 12px; border-bottom: 1px solid #F1F3F4; font-size: 14px; }
`;

const Modal = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  label { font-size: 13px; font-weight: 700; color: #3C4043; }
  input { padding: 10px; border-radius: 8px; border: 1px solid #DADCE0; }
`;

const StockManagement: React.FC = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [syncing, setSyncing] = useState(false);

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
    <Container>
      <Header>
        <div>
          <h2 style={{ margin: 0, fontWeight: 800 }}>Hisse Senedi Yönetimi</h2>
          <p style={{ margin: '4px 0 0', color: '#5F6368' }}>Sistemdeki tüm BIST hisselerini buradan yönetin.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button $variant="secondary" onClick={handleSync} disabled={syncing}>
            <RefreshCw size={18} className={syncing ? 'animate-spin' : ''} style={{ marginRight: 8 }} />
            Dosyadan Senkronize Et
          </Button>
          <Button $variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus size={18} style={{ marginRight: 8 }} />
            Yeni Hisse Ekle
          </Button>
        </div>
      </Header>

      <Card>
        <div style={{ padding: '20px' }}>
          <Controls>
            <SearchBox>
              <Search size={18} />
              <input 
                placeholder="Sembol veya isim ara..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </SearchBox>
            <div style={{ fontSize: '13px', color: '#5F6368', fontWeight: 600 }}>
              Toplam: {filteredStocks.length} Hisse
            </div>
          </Controls>

          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <Loader2 size={32} className="animate-spin" color="#1A73E8" />
            </div>
          ) : stocks.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#5F6368' }}>
              <AlertCircle size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
              <p>Henüz hiç hisse senedi eklenmemiş.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <StockTable>
                <thead>
                  <tr>
                    <th>SEMBOL</th>
                    <th>İSİM (OPSİYONEL)</th>
                    <th>EKLEME TARİHİ</th>
                    <th style={{ textAlign: 'right' }}>İŞLEMLER</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStocks.map(stock => (
                    <tr key={stock.id}>
                      <td>
                        <span 
                          style={{ 
                            fontWeight: 800, 
                            color: '#1A73E8', 
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                          onClick={() => navigate(`/dashboard/stock/${stock.symbol}`)}
                        >
                          {stock.symbol}
                        </span>
                      </td>
                      <td>{stock.name || '-'}</td>
                      <td style={{ color: '#5F6368', fontSize: '12px' }}>
                        {new Date(stock.createdAt).toLocaleDateString('tr-TR')}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <Button $variant="danger" $size="sm" onClick={() => handleDelete(stock.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </StockTable>
            </div>
          )}
        </div>
      </Card>

      {showAddModal && (
        <Modal>
          <ModalContent>
            <h3 style={{ margin: 0 }}>Yeni Hisse Senedi Ekle</h3>
            <InputGroup>
              <label>Sembol (Örn: THYAO)</label>
              <input 
                value={newStock.symbol}
                onChange={e => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
                placeholder="Örn: GARAN"
              />
            </InputGroup>
            <InputGroup>
              <label>Şirket İsmi (Opsiyonel)</label>
              <input 
                value={newStock.name}
                onChange={e => setNewStock({ ...newStock, name: e.target.value })}
                placeholder="Örn: Garanti Bankası"
              />
            </InputGroup>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <Button $variant="secondary" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>İptal</Button>
              <Button $variant="primary" style={{ flex: 1 }} onClick={handleAdd}>Ekle</Button>
            </div>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default StockManagement;
