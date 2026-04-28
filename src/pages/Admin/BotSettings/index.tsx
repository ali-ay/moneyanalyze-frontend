import { useEffect, useState } from 'react';
import api from '../../../services/apiClient';
import { io } from 'socket.io-client';
import { useAuth } from '../../../core/providers/AuthContext';
import { AddBotModal } from '../../../components/modals/AddBotModal';

// WebSocket bağlantısı - dinamik URL kullanımı (Canlı ortamda VITE_API_URL kullanılacak)
const SOCKET_URL = import.meta.env.VITE_API_URL || '';
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
    <div style={{ padding: '24px', color: 'white' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0 }}>🔧 Genel Bot Ayarları</h2>
          <p style={{ color: '#94a3b8', fontSize: '14px' }}>Tüm aktif botlarını buradan yönetebilirsin.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={styles.addBtn}>
          + Yeni Bot Oluştur
        </button>
      </div>

      <div style={styles.grid}>
        {bots.length === 0 && (
          <p style={{ color: '#475569', gridColumn: '1/-1', textAlign: 'center', padding: '40px' }}>
            Henüz yapılandırılmış bir botun yok.
          </p>
        )}

        {bots.map((bot) => (
          <div key={bot.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h3 style={{ margin: 0 }}>{bot.symbol}</h3>
                <span style={{ fontSize: '12px', color: '#10b981' }}>{bot.strategy} STRATEJİSİ</span>
              </div>
              <div style={{ 
                ...styles.statusDot, 
                backgroundColor: bot.isActive ? '#10b981' : '#ef4444',
                boxShadow: bot.isActive ? '0 0 10px #10b981' : 'none'
              }} />
            </div>

            <div style={styles.infoRow}>
              <span>İşlem Başına Limit:</span>
              <strong style={{ color: '#f1f5f9' }}>${bot.limit}</strong>
            </div>

            <div style={styles.terminal}>
              {botLogs[bot.id]?.map((log, idx) => (
                <div key={idx} style={styles.logText}>
                  <span style={{ color: '#475569' }}>[{new Date().toLocaleTimeString()}]</span> {log}
                </div>
              ))}
              {(!botLogs[bot.id] || botLogs[bot.id].length === 0) && (
                <div style={{ color: '#475569', fontSize: '11px' }}>Sistem hazır, botun başlatılması bekleniyor...</div>
              )}
            </div>

            <button 
              onClick={() => handleToggleBot(bot.id)}
              style={{
                ...styles.actionBtn,
                backgroundColor: bot.isActive ? '#ef4444' : '#3b82f6'
              }}
            >
              {bot.isActive ? 'BOTU DURDUR' : 'BOTU BAŞLAT'}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <AddBotModal 
          userId={user?.id} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={fetchBots} 
        />
        
      )}
    </div>
  );
};

// Tasarım Nesneleri (Aynı kalabilir)
const styles = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#1e293b', borderRadius: '16px', padding: '20px', border: '1px solid #334155', display: 'flex', flexDirection: 'column' as const },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' },
  statusDot: { width: '10px', height: '10px', borderRadius: '50%' },
  infoRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#94a3b8', marginBottom: '15px' },
  terminal: { backgroundColor: '#0f172a', borderRadius: '8px', padding: '12px', height: '120px', overflowY: 'auto' as const, marginBottom: '15px', border: '1px solid #1e293b', fontFamily: 'monospace' },
  logText: { fontSize: '11px', color: '#34d399', marginBottom: '4px', lineHeight: '1.4' },
  addBtn: { padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' as const, cursor: 'pointer' },
  actionBtn: { padding: '12px', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 'bold' as const, cursor: 'pointer', transition: '0.2s opacity' }
};

export default GeneralSettings;