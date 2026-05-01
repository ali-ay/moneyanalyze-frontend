import { useEffect, useState } from 'react';
import * as S from './UserDetailModal.styles';
import { X, Wallet, Bot, History, Coins } from 'lucide-react';
import { getUserDetail } from '../../../services/admin.api';

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
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.LoadingContainer>
          Veriler Hazırlanıyor...
        </S.LoadingContainer>
      </S.ModalContent>
    </S.ModalOverlay>
  );

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={e => e.stopPropagation()}>
        <S.CloseBtn onClick={onClose}><X size={20} /></S.CloseBtn>

        <S.HeaderSection>
          <S.HeaderTitle>
            {data.username}
          </S.HeaderTitle>
          <S.HeaderInfo>
            <div><strong>E-posta:</strong> {data.email}</div>
            <div><strong>Telefon:</strong> {data.phone || '-'}</div>
            <div><strong>ID:</strong> {data.id}</div>
          </S.HeaderInfo>
          {data.address && (
            <S.AddressInfo>
              <strong>Adres:</strong> {data.address}
            </S.AddressInfo>
          )}
        </S.HeaderSection>

        <S.Grid>
          {/* Bakiye */}
          <S.Card>
            <S.CardTitle><Wallet size={18} /> Cüzdan Bakiyesi</S.CardTitle>
            <S.BalanceDisplay>
              {data.wallet?.balance?.toLocaleString()} <S.BalanceUnit>USDT</S.BalanceUnit>
            </S.BalanceDisplay>
          </S.Card>

          {/* Varlıklar */}
          <S.Card>
            <S.CardTitle><Coins size={18} /> Portföy Varlıkları</S.CardTitle>
            <S.List>
              {data.assets?.length > 0 ? data.assets.map((a: any) => (
                <S.ListItem key={a.symbol}>
                  <S.SymbolCell>{a.symbol}</S.SymbolCell>
                  <S.AmountCell>{a.amount.toFixed(4)}</S.AmountCell>
                </S.ListItem>
              )) : <S.EmptyMessage>Henüz varlık yok</S.EmptyMessage>}
            </S.List>
          </S.Card>

          {/* Botlar */}
          <S.Card>
            <S.CardTitle><Bot size={18} /> Bot Durumları</S.CardTitle>
            <S.List>
              {data.bots?.map((b: any) => (
                <S.ListItem key={b.id}>
                  <S.StrategyCell>{b.strategy} Stratejisi</S.StrategyCell>
                  <S.Badge $active={b.isActive}>{b.isActive ? 'AKTİF' : 'DEVRE DIŞI'}</S.Badge>
                </S.ListItem>
              ))}
            </S.List>
          </S.Card>

          {/* Son İşlemler */}
          <S.Card>
            <S.CardTitle><History size={18} /> Son İşlemler</S.CardTitle>
            <S.List>
              {data.transactions?.slice(0, 10).map((t: any) => (
                <S.ListItem key={t.id}>
                  <S.TransactionContainer>
                    <S.TransactionType $isBuy={t.type === 'BUY'}>
                      {t.type} {t.symbol}
                    </S.TransactionType>
                    <S.TransactionDate>
                      {new Date(t.createdAt).toLocaleDateString('tr-TR')}
                    </S.TransactionDate>
                  </S.TransactionContainer>
                  <S.TransactionAmount>{t.total.toFixed(2)} USDT</S.TransactionAmount>
                </S.ListItem>
              ))}
            </S.List>
          </S.Card>
        </S.Grid>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default UserDetailModal;
