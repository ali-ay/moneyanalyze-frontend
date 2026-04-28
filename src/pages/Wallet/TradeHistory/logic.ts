import { useState, useEffect, useCallback } from 'react';
import { getHistory } from '../../../services/wallet.api';
import { io } from 'socket.io-client';
import { useAuth } from '../../../core/providers/AuthContext';

const SOCKET_URL = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL?.replace('/api', '') || '');

export const useTransactionsLogic = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getHistory();
      
      // Backend yapına göre veriyi al (Genelde res.data.transactions veya res.data)
      const rawData = res.data.transactions || res.data.data || res.data;
      
      if (Array.isArray(rawData)) {
        // Sadece Alım ve Satım işlemlerini filtrele
        const tradeHistory = rawData.filter(tx => 
          tx.type === 'BUY' || tx.type === 'SELL'
        );
        setTransactions(tradeHistory);
      }
    } catch (err) {
      console.error("İşlem geçmişi yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Real-time updates via WebSocket
  useEffect(() => {
    if (!user?.id) return;

    const socket = io(SOCKET_URL);

    socket.on('connect', () => {
      socket.emit('join_user_room', user.id);
    });

    socket.on('new_transaction', (newTx: any) => {
      // Sadece BUY/SELL ise listeye ekle
      if (newTx.type === 'BUY' || newTx.type === 'SELL') {
        setTransactions(prev => [newTx, ...prev]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id]);

  return { transactions, loading };
};