import { Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';

/**
 * Sadece ADMIN yetkisine sahip kullanıcıların erişebileceği rota bekçisi.
 * Kullanımı: <AdminRoute><UserList /></AdminRoute>
 */
export const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  
  // Veritabanında Enum olarak "ADMIN" kullandığımız için 
  // karşılaştırmayı .toUpperCase() ile yapmak daha güvenli olur.
  const userRole = localStorage.getItem('role')?.toUpperCase(); 

  // Eğer token yoksa veya kullanıcı ADMIN değilse kapıdan çevir
  if (!token || userRole !== 'ADMIN') {
    // Kullanıcıyı yetkisi olmayan bir yere erişmeye çalıştığında Dashboard'a yönlendiriyoruz
    return <Navigate to="/dashboard" replace />;
  }
  
  // Her şey yolundaysa sayfayı göster
  return children;
};