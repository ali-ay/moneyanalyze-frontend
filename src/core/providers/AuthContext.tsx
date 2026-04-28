import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '../../services/apiClient';

// Kullanıcı objesinin tipini tanımlayalım
interface User {
  id: string;
  username: string;
  role: string;
  tradingMode?: 'SIMULATION' | 'LIVE';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: (opts?: { redirect?: boolean }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = ['token', 'user', 'role', 'id', 'userId', 'tradingMode'];

const clearAuthStorage = () => {
  try {
    STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch { /* storage devre dışıysa sessizce geç */ }
};

const readUserFromStorage = (): User | null => {
  try {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    const savedId = localStorage.getItem('id') || localStorage.getItem('userId');

    if (!savedToken || !savedUser || !savedId) return null;

    return {
      id: savedId,
      username: savedUser,
      role: savedRole || 'USER',
      tradingMode: (localStorage.getItem('tradingMode') as any) || 'SIMULATION'
    };
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Lazy initializer: ilk render'da storage'tan oku, "loading flash" olmasın
  const [user, setUser] = useState<User | null>(() => readUserFromStorage());
  // Storage senkron okunduğu için loading her zaman false; alanı gelecekteki
  // async token doğrulaması için ileride aktif edebiliriz.
  const loading = false;

  const logout = useCallback((opts?: { redirect?: boolean }) => {
    setUser(null);
    clearAuthStorage();
    if (opts?.redirect !== false) {
      // Tam reset — eski state, açık WS/timer'lar temizlensin diye hard navigate
      window.location.href = '/login';
    }
  }, []);

  // apiClient 401 olayını dinle — token süresi dolduğunda otomatik logout
  useEffect(() => {
    const handler = () => {
      // localStorage zaten apiClient tarafından temizlendi; biz sadece state'i sıfırlayıp redirect yapıyoruz
      setUser(null);
      // Login sayfasındaysak tekrar yönlendirme yapma
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    };
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handler);
  }, []);

  // Tab/sekmeler arası senkron — biri çıkış yaparsa diğeri de çıksın
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'token' && e.newValue === null) {
        setUser(null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const login = useCallback((userData: User, token: string) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('user', userData.username);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('id', userData.id);
      if (userData.tradingMode) localStorage.setItem('tradingMode', userData.tradingMode);
    } catch { /* storage devre dışıysa sessizce geç */ }
    setUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook olarak dışarı aktaralım ki her yerde kolayca çağıralım
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};