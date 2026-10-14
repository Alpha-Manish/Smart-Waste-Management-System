import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UNAUTHORIZED_ADMIN_MESSAGE } from '../utils/auth';

/**
 * AdminRoute Guard
 * 
 * Enforces strict authorization check:
 * - Prevents unauthorized users from seeing any admin content during loading.
 * - Redirects unauthenticated users to /login.
 * - Redirects authenticated users whose email does not strictly match the authorized
 *   admin email (`2302031800069@silveroakuni.ac.in`) to the Unauthorized page with
 *   the message "You are not authorized to access the Admin Portal."
 * - Renders child routes via <Outlet /> only for the verified admin.
 */
export const AdminRoute = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
        <p className="text-sm font-medium text-slate-500 animate-pulse">
          Verifying administrative credentials...
        </p>
      </div>
    );
  }

  // Not authenticated at all -> Redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Authenticated, but email is not the authorized admin email
  if (!isAdmin) {
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

  // Fully authenticated and authorized admin
  return <Outlet />;
};

export default AdminRoute;
