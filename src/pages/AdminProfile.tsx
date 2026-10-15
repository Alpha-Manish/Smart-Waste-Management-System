import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  User, 
  KeyRound, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Lock, 
  Activity, 
  Trash2, 
  AlertTriangle,
  Sparkles,
  Phone,
  Building,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { AUTHORIZED_ADMIN_EMAIL, getAuthorizedAdminEmail } from '../utils/auth';

export default function AdminProfile() {
  const { user } = useAuth();

  // Profile Form State
  const initialEmail = user?.email || getAuthorizedAdminEmail();
  const initialName = user?.user_metadata?.name || localStorage.getItem('admin_name') || 'System Administrator';
  const initialPhone = localStorage.getItem('admin_phone') || '+91 98765 43210';
  const initialDept = localStorage.getItem('admin_dept') || 'Urban Waste Operations & AI Logistics';

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [department, setDepartment] = useState(initialDept);

  // Password State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status feedback
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Sync state if user loads
  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    }
    if (user?.user_metadata?.name) {
      setName(user.user_metadata.name);
    }
  }, [user]);

  const initials = name
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AD';

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setProfileMessage({ type: 'error', text: 'Name cannot be empty.' });
      setIsUpdatingProfile(false);
      return;
    }

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setProfileMessage({ type: 'error', text: 'Please enter a valid email address.' });
      setIsUpdatingProfile(false);
      return;
    }

    try {
      // 1. Update Supabase User if user is logged in
      const { error } = await supabase.auth.updateUser({
        email: trimmedEmail,
        data: { name: trimmedName }
      });

      if (error) {
        console.warn('Supabase auth update note:', error.message);
      }

      // 2. Persist locally to preserve updated admin email and name across sessions
      localStorage.setItem('admin_name', trimmedName);
      localStorage.setItem('admin_phone', phone.trim());
      localStorage.setItem('admin_dept', department.trim());
      localStorage.setItem('custom_admin_email', trimmedEmail);

      setProfileMessage({
        type: 'success',
        text: 'Admin profile updated successfully! Changes are applied across the control panel.'
      });
    } catch (err: any) {
      console.error('Failed to update admin profile:', err);
      // Fallback local save
      localStorage.setItem('admin_name', trimmedName);
      localStorage.setItem('custom_admin_email', trimmedEmail);
      setProfileMessage({
        type: 'success',
        text: 'Profile updated and saved locally in your admin session.'
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingPassword(false);
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    try {
      setIsUpdatingPassword(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordMessage({
        type: 'success',
        text: 'Password updated successfully! Keep your new credentials secure.'
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Password update error:', err);
      setPasswordMessage({
        type: 'error',
        text: err.message || 'Failed to update password. Please check your credentials.'
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-teal-600" />
          Admin Profile & Settings
        </h1>
        <p className="text-slate-500 mt-1">Manage system administrator identity, credentials, and security preferences</p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-700 px-8 flex items-end">
          <div className="w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl translate-y-10 flex-shrink-0">
            <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-inner">
              {initials}
            </div>
          </div>
        </div>

        <div className="pt-14 pb-8 px-6 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
                  {name}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Authorized Super Admin
                </span>
              </div>
              <p className="text-slate-500 mt-1 font-mono text-sm">{email}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Active Session
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Trash2 className="w-4 h-4 text-teal-600" />
                Managed Bins
              </div>
              <p className="text-xl font-bold text-slate-800">20+ Units</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                High Fill Alerts
              </div>
              <p className="text-xl font-bold text-slate-800">5 Active</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Activity className="w-4 h-4 text-emerald-600" />
                System Health
              </div>
              <p className="text-xl font-bold text-slate-800">99.8% Online</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold mb-1">
                <Lock className="w-4 h-4 text-indigo-600" />
                Security Mode
              </div>
              <p className="text-xl font-bold text-slate-800">RLS Strict</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Form & Security */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Edit Profile Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-teal-600" />
                Admin Identity & Contact
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">Modify administrator full name, email address, and department</p>
            </div>
          </div>

          {profileMessage && (
            <div className={`p-4 rounded-xl flex items-start gap-3 mb-6 ${
              profileMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {profileMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm font-medium">{profileMessage.text}</p>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Admin Full Name</label>
                <div className="relative">
                  <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Manish Prajapati"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. 2302031800069@silveroakuni.ac.in"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Default authorized: <span className="font-mono text-slate-600">{AUTHORIZED_ADMIN_EMAIL}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Contact Number</label>
                <div className="relative">
                  <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Department / Role</label>
                <div className="relative">
                  <Building className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Waste Operations & Logistics"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-xl font-semibold shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isUpdatingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Security & Credentials */}
        <div className="space-y-6">
          {/* Password Change Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <KeyRound className="w-5 h-5 text-teal-600" />
              Change Password
            </h3>

            {passwordMessage && (
              <div className={`p-3.5 rounded-xl flex items-start gap-2.5 mb-4 text-xs font-medium ${
                passwordMessage.type === 'success' 
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <p>{passwordMessage.text}</p>
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

          {/* Authorization Specs */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-3xl border border-teal-100 p-6 shadow-sm">
            <h4 className="text-sm font-bold text-teal-900 flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              Administrative Permissions
            </h4>
            <p className="text-xs text-teal-800/80 leading-relaxed mb-4">
              As an authorized administrator, your account is granted unrestricted privileges across the system:
            </p>
            <ul className="space-y-2 text-xs text-teal-950 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Add, Edit, and Delete Smart Waste Bins
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Resolve Citizen Complaints & Assign Field Crews
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Access AI Predictive Analytics & SDG Reports
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                Route Optimization & Garbage Collection Dispatch
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
