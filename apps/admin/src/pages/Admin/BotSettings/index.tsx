import { useEffect, useState } from 'react';
import * as S from './BotSettings.styles';
import api from '../../../services/apiClient';
import { io } from 'socket.io-client';
import { useAuth } from '../../../app/providers/AuthContext';
import { AddBotModal } from '../../../components/modals/AddBotModal';

// WebSocket bağlantısı - dinamik URL kullanımı (Canlı ortamda VITE_API_URL kullanılacak)
const SOCKET_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL?.replace('/api', '') || '');
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  withCredentials: true
});

const GeneralSettings = () => {
  const { user } = useAuth();
  const [bots, setBots] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [botLogs, setBotLogs] = useState<{ [key: string]: string[] }>({});

  const fetchBots = async () => {
    if (!user?.id) return;
    try {
      // Merkezi api objesini kullanıyoruz
      const res = await api.get(`/bots/${user.id}`);
      if (res.data.success) {
        setBots(res.data.data);
      }
    } catch (err) {
      console.error("Bot listesi çekilemedi:", err);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    // Verileri çek ve odaya katıl
    fetchBots();
    socket.emit('join_user_room', user.id);

    // 1. Canlı logları dinle
    const handleLog = (data: { botId: string; message: string }) => {
      setBotLogs(prev => ({
        ...prev,
        [data.botId]: [data.message, ...(prev[data.botId] || [])].slice(0, 10)
      }));
    };

    // 2. Durum güncellemelerini dinle
    const handleStatusUpdate = ({ botId, running }: { botId: string, running: boolean }) => {
      setBots(prev => prev.map(b => b.id === botId ? { ...b, isActive: running } : b));
    };

    socket.on('bot_log', handleLog);
    socket.on('bot_status_update', handleStatusUpdate);

    // Cleanup: Bileşen kapandığında veya user.id değiştiğinde dinleyicileri temizle
    return () => {
      socket.off('bot_log', handleLog);
      socket.off('bot_status_update', handleStatusUpdate);
    };
  }, [user?.id]); // Sadece kullanıcı ID'si değiştiğinde tetiklenir

  const handleToggleBot = (botId: string) => {
    socket.emit('toggle_bot', { botId, userId: user?.id });
  };

  return (
    <S.Container>
      <S.Header>
        <S.HeaderContent>
          <S.HeaderTitle>🔧 Genel Bot Ayarları</S.HeaderTitle>
          <S.HeaderSubtitle>Tüm aktif botlarını buradan yönetebilirsin.</S.HeaderSubtitle>
        </S.HeaderContent>
        <S.AddButton onClick={() => setIsModalOpen(true)}>
          + Yeni Bot Oluştur
        </S.AddButton>
      </S.Header>

      <S.Grid>
        {bots.length === 0 && (
          <S.EmptyMessage>
            Henüz yapılandırılmış bir botun yok.
          </S.EmptyMessage>
        )}

        {bots.map((bot) => (
          <S.Card key={bot.id}>
            <S.CardHeader>
              <div>
                <S.CardTitle>{bot.symbol}</S.CardTitle>
                <S.StrategyLabel>{bot.strategy} STRATEJİSİ</S.StrategyLabel>
              </div>
              <S.StatusDot $isActive={bot.isActive} />
            </S.CardHeader>

            <S.InfoRow>
              <span>İşlem Başına Limit:</span>
              <S.InfoValue>${bot.limit}</S.InfoValue>
            </S.InfoRow>

            <S.Terminal>
              {botLogs[bot.id]?.map((log, idx) => (
                <S.LogText key={idx}>
                  <S.LogTimestamp>[{new Date().toLocaleTimeString()}]</S.LogTimestamp> {log}
                </S.LogText>
              ))}
              {(!botLogs[bot.id] || botLogs[bot.id].length === 0) && (
                <S.EmptyLog>Sistem hazır, botun başlatılması bekleniyor...</S.EmptyLog>
              )}
            </S.Terminal>

            <S.ActionButton
              $isActive={bot.isActive}
              onClick={() => handleToggleBot(bot.id)}
            >
              {bot.isActive ? 'BOTU DURDUR' : 'BOTU BAŞLAT'}
            </S.ActionButton>
          </S.Card>
        ))}
      </S.Grid>

      {isModalOpen && (
        <AddBotModal
          userId={user?.id}
          onClose={() => setIsModalOpen(false)}
          onSuccess={fetchBots}
        />
      )}
    </S.Container>
  );
};
export default GeneralSettings;