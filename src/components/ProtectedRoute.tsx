import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: ('citizen' | 'admin')[];
  redirectPath?: string;
}

export const ProtectedRoute = ({ 
  allowedRoles = ['citizen', 'admin'],
  redirectPath = '/login'
}: ProtectedRouteProps) => {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (role && !allowedRoles.includes(role as 'citizen' | 'admin')) {
    // Redirect based on their actual role if they try to access unauthorized area
    return <Navigate to={role === 'admin' ? '/admin' : '/citizen'} replace />;
  }

  return <Outlet />;
};
