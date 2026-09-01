import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthContext';

/**
 * Sadece ADMIN yetkisine sahip kullanıcıların erişebileceği rota bekçisi.
 * Kullanımı: <AdminRoute><UserList /></AdminRoute>
 */
export const AdminRoute = ({ children }: { children: React.ReactElement }) => {
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