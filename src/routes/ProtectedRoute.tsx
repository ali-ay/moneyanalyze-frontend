import { Navigate } from 'react-router-dom';
import type { JSX } from 'react/jsx-dev-runtime';

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Giriş yapmamışsa login'e at
    return <Navigate to="/login" replace />;
  }
  
  return children;
};