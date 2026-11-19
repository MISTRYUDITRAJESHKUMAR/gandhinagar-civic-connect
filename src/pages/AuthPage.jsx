import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_WARDS, INITIAL_DEPARTMENTS, DEMO_USERS } from '../data/initialData';
import { 
  Building2, 
  ShieldCheck, 
  User, 
  Lock, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  KeyRound, 
  Users, 
  Briefcase, 
  HardHat, 
  AlertCircle,
  ChevronLeft,
  Flame,
  HelpCircle,
  LogIn,
  UserPlus
} from 'lucide-react';

export const AuthPage = ({ initialTab = 'login', onBack, onSuccess }) => {
  const { login, register } = useAuth();
  
  const [activeTab, setActiveTab] = useState(initialTab === 'register' ? 'register' : 'login'); // 'login' | 'register'
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regMobile, setRegMobile] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regWardId, setRegWardId] = useState('W-04');
  const [regRole, setRegRole] = useState('citizen');
  const [regDeptId, setRegDeptId] = useState('DEP-SAN');
  
  // Feedback
  const [statusMessage, setStatusMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Email Login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    const res = await login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Welcome back, ${res.user.name}! Opening your module...` });
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user);
      }, 500);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Invalid credentials. Please verify your email and password.' });
    }
  };

  // Handle Registration (Saved to Firestore & Local DB)
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage(null);

    if (regPassword !== regConfirmPassword) {
      setIsSubmitting(false);
      setStatusMessage({ type: 'error', text: 'Passwords do not match. Please re-enter.' });
      return;
    }

    if (regPassword.length < 6) {
      setIsSubmitting(false);
      setStatusMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    const regData = {
      name: regName,
      mobile: regMobile,
      email: regEmail,
      password: regPassword,
      wardId: regWardId,
      role: regRole,
      departmentId: ['officer', 'worker'].includes(regRole) ? regDeptId : null,
      designation: regRole === 'citizen' ? 'Verified Gandhinagar Citizen' : `${regRole.toUpperCase()} Authority`
    };

    const res = await register(regData);
    setIsSubmitting(false);

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Account registered & saved into database! Welcome, ${res.user.name}.` });
      setTimeout(() => {
        if (onSuccess) onSuccess(res.user);
      }, 600);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Registration failed. Please check form details.' });
    }
  };

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto">
      
      {/* Top Breadcrumb / Back button */}
      {onBack && (
        <div className="mb-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Public Portal</span>
          </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT PANEL: Municipal Trust & Authority */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-emerald-950 to-teal-950 text-white p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/30">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold tracking-tight">GANDHINAGAR</h2>
                <p className="text-[11px] text-emerald-400 font-semibold tracking-wider uppercase">Municipal Corporation</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white leading-tight">
                Official Civic Access Portal
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Welcome to Gandhinagar Civic Connect. Secure digital gateway for Gandhinagar residents and municipal authorities.
              </p>
            </div>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs">Secure Credential Verification</span>
                  <span className="text-[11px] text-slate-300">All logins are encrypted and authenticated directly against the municipal database.</span>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block text-xs">Single Gateway for All Services</span>
                  <span className="text-[11px] text-slate-300">Your account automatically directs you to your authorized municipal workspace.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Secure Database Verification Badge */}
          <div className="pt-6 border-t border-white/10 mt-6 space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GMC Civic Grievance Helpline: 1800-233-0000</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Gandhinagar Municipal Corporation • Official Governance Grid
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Tabs & Form */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
          
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-5">
            <div className="flex gap-2">
              <button
                onClick={() => { setActiveTab('login'); setStatusMessage(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeTab === 'login'
                    ? 'bg-slate-900 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setActiveTab('register'); setStatusMessage(null); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition ${
                  activeTab === 'register'
                    ? 'bg-emerald-600 text-white shadow shadow-emerald-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Register
              </button>
            </div>

            <span className="text-[10px] font-semibold text-slate-400">
              GMC Authority
            </span>
          </div>

          {/* Feedback & Status Alert */}
          {statusMessage && (
            <div className={`p-3.5 rounded-2xl mb-4 text-xs font-semibold flex items-start gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                : statusMessage.type === 'error'
                ? 'bg-rose-50 border border-rose-200 text-rose-800'
                : 'bg-blue-50 border border-blue-200 text-blue-800'
            }`}>
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {statusMessage.type === 'info' && <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: EMAIL & PASSWORD LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 active:scale-95 transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'Verifying with Database...' : 'Sign In to Designated Module'}</span>
                </button>
              </div>

              <div className="text-center pt-2 text-xs text-slate-500">
                New to Gandhinagar Civic Connect?{' '}
                <button
                  type="button"
                  onClick={() => { setActiveTab('register'); setStatusMessage(null); }}
                  className="text-emerald-700 font-bold hover:underline"
                >
                  Register Account
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: REGISTER ACCOUNT */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Aarav Patel"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={regMobile}
                    onChange={(e) => setRegMobile(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="aarav@gandhinagar.citizen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Account Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="citizen">Citizen (Resident)</option>
                    <option value="corporator">Ward Corporator (Elected Rep)</option>
                    <option value="officer">Department Officer (Sanitation/Civil)</option>
                    <option value="worker">Field Worker (Resolution Squad)</option>
                    <option value="admin">Municipal Admin (GMC Officer)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Assigned Ward *
                  </label>
                  <select
                    value={regWardId}
                    onChange={(e) => setRegWardId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-emerald-500"
                  >
                    {INITIAL_WARDS.map(w => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {['officer', 'worker'].includes(regRole) && (
                <div>
                  <label className="block font-bold text-amber-800 uppercase tracking-wider mb-1">
                    Assigned Municipal Department *
                  </label>
                  <select
                    value={regDeptId}
                    onChange={(e) => setRegDeptId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl border border-amber-300 text-xs bg-amber-50 focus:ring-2 focus:ring-amber-500"
                  >
                    {INITIAL_DEPARTMENTS.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Registering into Database...' : 'Register Account & Save to DB'}</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
