import { useState, useEffect, useCallback, useRef } from 'react';
import { getHistory } from '../../../services/wallet.api';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../../core/providers/AuthContext';

const SOCKET_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL?.replace('/api', '') || '');

export const useTransactionsLogic = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const abortRef = useRef<AbortController | null>(null);

  const fetchTransactions = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      setLoading(true);
      const res = await getHistory({ signal: controller.signal } as any);

      // Backend yapına göre veriyi al (Genelde res.data.transactions veya res.data.data veya res.data)
      const rawData = res.data?.transactions || res.data?.data || res.data;

      if (Array.isArray(rawData)) {
        // Sadece Alım ve Satım işlemlerini filtrele
        const tradeHistory = rawData.filter(tx =>
          tx.type === 'BUY' || tx.type === 'SELL'
        );
        if (!controller.signal.aborted) setTransactions(tradeHistory);
      }
    } catch (err: any) {
      if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
      console.error("İşlem geçmişi yüklenemedi:", err);
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
    return () => abortRef.current?.abort();
  }, [fetchTransactions]);

  // Real-time updates via WebSocket — JWT auth ile bağlan
  useEffect(() => {
    if (!user?.id) return;
    const token = localStorage.getItem('token');
    if (!token) return;

    let socket: Socket | null = io(SOCKET_URL, {
      // Backend socket.handshake.auth.token bekliyor
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      timeout: 20000,
    });

    socket.on('new_transaction', (newTx: any) => {
      // Sadece BUY/SELL ise listeye ekle
      if (newTx?.type === 'BUY' || newTx?.type === 'SELL') {
        setTransactions(prev => [newTx, ...prev]);
      }
    });

    socket.on('connect_error', (err) => {
      console.warn('Socket bağlantı hatası:', err.message);
    });

    return () => {
      if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
      }
    };
  }, [user?.id]);

  return { transactions, loading };
};