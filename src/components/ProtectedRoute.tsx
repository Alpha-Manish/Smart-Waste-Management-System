import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UNAUTHORIZED_ADMIN_MESSAGE } from '../utils/auth';

interface ProtectedRouteProps {
  allowedRoles?: ('citizen' | 'admin')[];
  redirectPath?: string;
}

export const ProtectedRoute = ({ 
  allowedRoles = ['citizen', 'admin'],
  redirectPath = '/login'
}: ProtectedRouteProps) => {
  const { user, role, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  // If this route is exclusively for admins and user is not the authorized admin
  if (allowedRoles.length === 1 && allowedRoles.includes('admin') && !isAdmin) {
    return (
      <Navigate 
        to="/unauthorized" 
        state={{ 
          unauthorizedMessage: UNAUTHORIZED_ADMIN_MESSAGE,
          from: location.pathname
        }} 
        replace 
      />
    );
  }

  if (role && !allowedRoles.includes(role)) {
    // If citizen tries to access non-citizen role
    if (role === 'citizen') {
      return (
        <Navigate 
          to="/unauthorized" 
          state={{ 
            unauthorizedMessage: UNAUTHORIZED_ADMIN_MESSAGE,
            from: location.pathname
          }} 
          replace 
        />
      );
    }
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

