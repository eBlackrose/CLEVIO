import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const navigate = useNavigate();
  const isAdminLoggedIn = localStorage.getItem('clevio_admin_auth') === 'true';
  
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdminLoggedIn, navigate]);
  
  if (!isAdminLoggedIn) {
    return null;
  }
  
  return <>{children}</>;
}
