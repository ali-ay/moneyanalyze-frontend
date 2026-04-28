import { Navigate, useLocation } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';
import { useAuth } from '../core/providers/AuthContext';

/**
 * Auth gerektiren rotaları sarar.
 * AuthContext'i tek doğruluk kaynağı olarak kullanır — localStorage ve context
 * arasında race condition olmasın diye.
 */
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // AuthContext storage doğrulaması bitene kadar bekle
    return null;
  }

  if (!isAuthenticated) {
    // Giriş yaptıktan sonra geri dönebilmek için "from" state'i taşı
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};