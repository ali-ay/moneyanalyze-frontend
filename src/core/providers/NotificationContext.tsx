import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type NotificationType = 'success' | 'error' | 'info';

interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

let notifIdCounter = 0;
const generateId = () => {
  notifIdCounter += 1;
  return `notif_${Date.now()}_${notifIdCounter}`;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeNotification = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    const id = generateId();
    setNotifications((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      timersRef.current.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
    timersRef.current.set(id, timer);
  }, []);

  // Provider unmount olursa tüm timer'ları temizle
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <NotificationContainer>
        {notifications.map((n) => (
          <Toast key={n.id} $type={n.type}>
            <div className="icon">
              {n.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            </div>
            <div className="message">{n.message}</div>
            <button className="close" onClick={() => removeNotification(n.id)}>
              <X size={14} />
            </button>
          </Toast>
        ))}
      </NotificationContainer>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Styles
const slideIn = keyframes`
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 24px;
  z-index: 11000;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
`;

const Toast = styled.div<{ $type: NotificationType }>`
  pointer-events: auto;
  min-width: 280px;
  max-width: 400px;
  padding: 16px;
  border-radius: 12px;
  background: ${props => props.$type === 'success' ? '#0f9d58' : props.$type === 'error' ? '#db4437' : '#1a73e8'};
  color: white;
  box-shadow: 0 8px 30px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  gap: 12px;
  animation: ${slideIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-left: 5px solid rgba(0,0,0,0.2);

  .icon { display: flex; align-items: center; }
  .message { flex: 1; font-size: 14px; font-weight: 600; }
  .close { 
    background: none; border: none; color: white; cursor: pointer; 
    opacity: 0.6; padding: 4px; display: flex; align-items: center;
    &:hover { opacity: 1; }
  }
`;
