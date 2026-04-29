import { Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';
import { useAuth } from '../app/providers/AuthContext';

/**
 * Sadece ADMIN yetkisine sahip kullanıcıların erişebileceği rota bekçisi.
 * Kullanımı: <AdminRoute><UserList /></AdminRoute>
 */
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Veritabanında Enum olarak "ADMIN" kullandığımız için
  // karşılaştırmayı .toUpperCase() ile yapmak daha güvenli olur.
  if (user?.role?.toUpperCase() !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};