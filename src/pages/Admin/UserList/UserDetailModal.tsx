import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { X, Wallet, Bot, History, Coins } from 'lucide-react';
import { getUserDetail } from '../../../services/admin.api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalContent = styled.div`
  background: ${props => props.theme.colors.surface};
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  border-radius: 24px;
  border: 1px solid ${props => props.theme.colors.border};
  padding: 40px;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadows.md};
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 24px;
  right: 24px;
  background: ${props => props.theme.colors.background};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { 
    color: ${props => props.theme.colors.danger};
    border-color: ${props => props.theme.colors.danger};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 32px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  background: ${props => props.theme.colors.background};
  border-radius: 16px;
  padding: 24px;
  border: 1px solid ${props => props.theme.colors.border};
`;

const CardTitle = styled.h4`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 0;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: ${props => props.theme.colors.surface};
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  font-size: 0.875rem;
  color: ${props => props.theme.colors.textMain};
`;

const Badge = styled.span<{ $active?: boolean }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: ${props => props.$active ? 'rgba(15, 157, 88, 0.1)' : 'rgba(95, 99, 104, 0.1)'};
  color: ${props => props.$active ? '#0F9D58' : '#5F6368'};
`;

const UserDetailModal = ({ userId, onClose }: { userId: string, onClose: () => void }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getUserDetail(userId);
        setData(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  if (loading) return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <div style={{ padding: '80px', textAlign: 'center', color: '#5F6368', fontWeight: 600 }}>
          Veriler Hazırlanıyor...
        </div>
      </ModalContent>
    </ModalOverlay>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseBtn onClick={onClose}><X size={20} /></CloseBtn>
        
        <div style={{ borderBottom: '1px solid #DADCE0', paddingBottom: '24px' }}>
          <h2 style={{ color: '#202124', marginBottom: '8px', fontSize: '1.5rem', fontWeight: 700 }}>
            {data.username}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginTop: '16px', color: '#5F6368', fontSize: '0.875rem' }}>
            <div><strong>E-posta:</strong> {data.email}</div>
            <div><strong>Telefon:</strong> {data.phone || '-'}</div>
            <div><strong>ID:</strong> {data.id}</div>
          </div>
          {data.address && (
            <div style={{ marginTop: '12px', fontSize: '0.875rem', color: '#5F6368' }}>
              <strong>Adres:</strong> {data.address}
            </div>
          )}
        </div>

        <Grid>
          {/* Bakiye */}
          <Card>
            <CardTitle><Wallet size={18} /> Cüzdan Bakiyesi</CardTitle>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#202124' }}>
              {data.wallet?.balance?.toLocaleString()} <small style={{ fontSize: '1rem', color: '#5F6368', fontWeight: 600 }}>USDT</small>
            </div>
          </Card>

          {/* Varlıklar */}
          <Card>
            <CardTitle><Coins size={18} /> Portföy Varlıkları</CardTitle>
            <List>
              {data.assets?.length > 0 ? data.assets.map((a: any) => (
                <ListItem key={a.symbol}>
                  <span style={{ fontWeight: 600 }}>{a.symbol}</span>
                  <span style={{ fontWeight: 700, color: '#1a73e8' }}>{a.amount.toFixed(4)}</span>
                </ListItem>
              )) : <div style={{ color: '#9AA0A6', fontSize: '0.8125rem', textAlign: 'center', padding: '10px' }}>Henüz varlık yok</div>}
            </List>
          </Card>

          {/* Botlar */}
          <Card>
            <CardTitle><Bot size={18} /> Bot Durumları</CardTitle>
            <List>
              {data.bots?.map((b: any) => (
                <ListItem key={b.id}>
                  <span style={{ fontWeight: 600 }}>{b.strategy} Stratejisi</span>
                  <Badge $active={b.isActive}>{b.isActive ? 'AKTİF' : 'DEVRE DIŞI'}</Badge>
                </ListItem>
              ))}
            </List>
          </Card>

          {/* Son İşlemler */}
          <Card>
            <CardTitle><History size={18} /> Son İşlemler</CardTitle>
            <List>
              {data.transactions?.slice(0, 10).map((t: any) => (
                <ListItem key={t.id}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: t.type === 'BUY' ? '#0F9D58' : '#DB4437', fontWeight: 700 }}>
                      {t.type} {t.symbol}
                    </span>
                    <small style={{ color: '#9AA0A6', fontSize: '0.6875rem', marginTop: '2px' }}>
                      {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                    </small>
                  </div>
                  <span style={{ fontWeight: 700 }}>{t.total.toFixed(2)} USDT</span>
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserDetailModal;
