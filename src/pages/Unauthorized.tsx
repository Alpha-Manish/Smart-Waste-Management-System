import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Home } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UNAUTHORIZED_ADMIN_MESSAGE } from '../utils/auth';

export default function Unauthorized() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const customMessage = (location.state as { unauthorizedMessage?: string })?.unauthorizedMessage;
  const message = customMessage || UNAUTHORIZED_ADMIN_MESSAGE;

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-600 shadow-sm border border-red-100">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          Access Restricted
        </h1>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm font-semibold text-red-800">
            {message}
          </p>
          <p className="text-xs text-red-600 mt-1.5">
            This portal is strictly reserved for authorized system administrators. Your account does not have permission to view or manage admin resources.
          </p>
        </div>

        {user?.email && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 mb-6 text-xs text-slate-600 break-all">
            <span className="font-semibold text-slate-700">Logged in as: </span>
            <span className="font-mono text-slate-900">{user.email}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate('/citizen', { replace: true })}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Citizen Portal
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={handleLogout}
            className="w-full border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-600 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    </div>
  );
}
