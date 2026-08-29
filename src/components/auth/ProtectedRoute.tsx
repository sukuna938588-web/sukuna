import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useData } from '@/context/DataContext';

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, currentUser } = useData();
  const location = useLocation();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
