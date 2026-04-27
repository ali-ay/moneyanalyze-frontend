import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

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
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Uygulama ilk açıldığında localStorage'a bak
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    const savedId = localStorage.getItem('id') || localStorage.getItem('userId');

    if (savedToken && savedUser && savedId) {
      setUser({
        id: savedId,
        username: savedUser,
        role: savedRole || 'USER', // Role yoksa USER varsay
        tradingMode: (localStorage.getItem('tradingMode') as any) || 'SIMULATION'
      });
    }
    setLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', userData.username);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('id', userData.id);
    if (userData.tradingMode) localStorage.setItem('tradingMode', userData.tradingMode);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    window.location.href = '/login'; // Temiz bir çıkış için yönlendir
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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