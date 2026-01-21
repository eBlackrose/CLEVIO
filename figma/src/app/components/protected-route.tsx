import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Development logging helper
const isDev = process.env.NODE_ENV === 'development';
const debugLog = (...args: any[]) => {
  if (isDev) {
    console.log(...args);
  }
};

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';

  useEffect(() => {
    debugLog('🔒 ProtectedRoute check:', {
      path: location.pathname,
      isLoggedIn,
      userEmail: localStorage.getItem('userEmail'),
      timestamp: new Date().toISOString(),
    });

    if (!isLoggedIn) {
      console.warn('⚠️ Unauthorized access attempt to:', location.pathname);
      debugLog('Redirecting to /signin...');
      
      toast.error('Please sign in to continue', {
        description: 'You must be logged in to access the dashboard',
      });
      navigate('/signin');
    } else {
      debugLog('✅ Access granted to:', location.pathname);
    }
  }, [isLoggedIn, navigate, location.pathname]);

  // If not logged in, don't render anything (will redirect)
  if (!isLoggedIn) {
    debugLog('Rendering null (not logged in)');
    return null;
  }

  return <>{children}</>;
}