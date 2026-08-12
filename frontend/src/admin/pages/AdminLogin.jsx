import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { api } from '../../services/api.js';
import navbar_logo from '../../assets/navbar_logo.png';

/* ── OTP 6-box input (same as client) ── */
function OtpInput({ value, onChange }) {
  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = [...value];
      if (next[i]) { next[i] = ''; onChange(next.join('')); }
      else if (i > 0) refs[i - 1].current?.focus();
    }
  };
  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value.padEnd(6, ' ').split('')];
    next[i] = char;
    onChange(next.join('').trimEnd());
    if (char && i < 5) refs[i + 1].current?.focus();
  };
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(paste);
    refs[Math.min(paste.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex justify-center gap-3 my-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <input key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="h-12 w-10 rounded-xl border-2 text-center text-[20px] font-bold outline-none transition-all focus:scale-105"
          style={{
            borderColor:     value[i] ? '#C59B45' : 'rgba(197,155,69,0.3)',
            color:           '#4B2F1F',
            backgroundColor: value[i] ? 'rgba(197,155,69,0.06)' : '#FCFAF6',
            fontFamily:      'monospace',
          }}
        />
      ))}
    </div>
  );
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const { success, error } = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  // forgot: 0=email, 1=otp, 2=newpass
  const [fpStep,       setFpStep]       = useState(0);
  const [fpEmail,      setFpEmail]      = useState('');
  const [fpOtp,        setFpOtp]        = useState('');
  const [fpPassword,   setFpPassword]   = useState('');
  const [fpConfirm,    setFpConfirm]    = useState('');
  const [countdown,    setCountdown]    = useState(0);

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* ── Login submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login({ email, password });
      if (result.success) {
        success('Welcome to the dashboard!');
        navigate('/admin/dashboard');
      } else {
        error(result.message || 'Invalid credentials.');
      }
    } catch (err) {
      error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Forgot: send OTP ── */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/v1/admin/auth/forgot-password', { email: fpEmail.trim() });
      success('OTP sent to admin email!');
      setFpStep(1);
      setCountdown(60);
    } catch (err) {
      error(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Forgot: verify OTP → go to step 2 ── */
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (fpOtp.length < 6) { error('Enter all 6 digits'); return; }
    setFpStep(2);
  };

  /* ── Forgot: reset password ── */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (fpPassword !== fpConfirm) { error('Passwords do not match'); return; }
    if (fpPassword.length < 8)   { error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await api.post('/api/v1/admin/auth/verify-otp-reset', {
        email:       fpEmail.trim(),
        otp:         fpOtp.trim(),
        newPassword: fpPassword,
      });
      success('Password reset! Please login with your new password.');
      setMode('login');
      setFpStep(0); setFpEmail(''); setFpOtp(''); setFpPassword(''); setFpConfirm('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed.';
      error(msg);
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('expired')) {
        setFpStep(1); setFpOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ── Resend OTP ── */
  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post('/api/v1/admin/auth/forgot-password', { email: fpEmail.trim() });
      success('New OTP sent!');
      setCountdown(60);
      setFpOtp('');
    } catch { error('Failed to resend OTP.'); }
    finally { setLoading(false); }
  };

  const cardStyle = { backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' };
  const inputCls  = 'w-full rounded-full border px-12 py-3 focus:outline-none focus:ring-2 focus:ring-amber-300';
  const inputSty  = { fontFamily: '"Poppins",sans-serif', borderColor: 'rgba(197,155,69,0.25)', color: '#4B2F1F', backgroundColor: '#FCFAF6' };
  const btnSty    = { fontFamily: '"Poppins",sans-serif', background: 'linear-gradient(135deg,#C59B45 0%,#A8771E 100%)' };

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ backgroundColor: '#F8F2E8' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl p-8 shadow-lg" style={cardStyle}>

          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src={navbar_logo} alt="GlowRoot" className="h-16 w-auto" />
          </div>

          <AnimatePresence mode="wait">

            {/* ══ LOGIN ══════════════════════════════════════════════ */}
            {mode === 'login' && (
              <motion.div key="login"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <div className="mb-8 text-center">
                  <h1 className="mb-2 text-3xl font-semibold"
                    style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                    Admin Login
                  </h1>
                  <p className="text-sm" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                    Sign in to manage your store
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#6E4B2A' }} />
                      <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                        placeholder="admin@glowroot.com" className={inputCls} style={inputSty} />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#6E4B2A' }} />
                      <input type={showPass ? 'text' : 'password'} required value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••" className={inputCls} style={inputSty} />
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          {showPass
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Forgot password link */}
                  <div className="text-right">
                    <button type="button" onClick={() => setMode('forgot')}
                      className="text-[12px] font-semibold hover:underline transition-colors"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#C59B45' }}>
                      Forgot Password?
                    </button>
                  </div>

                  <button type="submit" disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                    style={btnSty}>
                    {loading ? 'Signing in…' : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ══ FORGOT — step 0: Email ══════════════════════════ */}
            {mode === 'forgot' && fpStep === 0 && (
              <motion.div key="fp0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <div className="mb-6 text-center">
                  <h2 className="mb-1 text-2xl font-semibold"
                    style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                    Reset Admin Password
                  </h2>
                  <p className="text-[13px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                    Enter the admin email to receive an OTP.
                  </p>
                </div>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#6E4B2A' }} />
                    <input type="email" required autoFocus value={fpEmail}
                      onChange={e => setFpEmail(e.target.value)}
                      placeholder="admin@glowroot.com" className={inputCls} style={inputSty} />
                  </div>
                  <button type="submit" disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                    style={btnSty}>
                    {loading
                      ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending…</>
                      : 'Send OTP'}
                  </button>
                </form>
                <button onClick={() => setMode('login')}
                  className="mt-4 w-full text-center text-[12px] hover:underline"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                  ← Back to Login
                </button>
              </motion.div>
            )}

            {/* ══ FORGOT — step 1: OTP ════════════════════════════ */}
            {mode === 'forgot' && fpStep === 1 && (
              <motion.div key="fp1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <div className="mb-4 text-center">
                  <h2 className="mb-1 text-2xl font-semibold"
                    style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                    Enter OTP
                  </h2>
                  <p className="text-[13px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                    6-digit code sent to <strong>{fpEmail}</strong>
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <OtpInput value={fpOtp} onChange={setFpOtp} />
                  <button type="submit" disabled={fpOtp.length < 6}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                    style={btnSty}>
                    Verify OTP
                  </button>
                </form>
                <div className="mt-4 flex items-center justify-between text-[12px]"
                  style={{ fontFamily: '"Poppins",sans-serif' }}>
                  <button onClick={() => setFpStep(0)} className="text-gray-400 hover:underline">
                    ← Change email
                  </button>
                  <button onClick={handleResend} disabled={countdown > 0}
                    className="font-semibold disabled:opacity-40"
                    style={{ color: countdown > 0 ? '#9CA3AF' : '#C59B45' }}>
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ══ FORGOT — step 2: New Password ═══════════════════ */}
            {mode === 'forgot' && fpStep === 2 && (
              <motion.div key="fp2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.22 }}>
                <div className="mb-6 text-center">
                  <h2 className="mb-1 text-2xl font-semibold"
                    style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                    New Password
                  </h2>
                  <p className="text-[13px]" style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                    Choose a strong admin password.
                  </p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#6E4B2A' }} />
                    <input type={showPass ? 'text' : 'password'} required minLength={8}
                      value={fpPassword} onChange={e => setFpPassword(e.target.value)}
                      placeholder="Minimum 8 characters" className={inputCls} style={inputSty} />
                    <button type="button" onClick={() => setShowPass(p => !p)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        {showPass
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: '#6E4B2A' }} />
                    <input type={showPass ? 'text' : 'password'} required
                      value={fpConfirm} onChange={e => setFpConfirm(e.target.value)}
                      placeholder="Re-enter password"
                      className={inputCls}
                      style={{ ...inputSty, borderColor: fpConfirm && fpConfirm !== fpPassword ? 'rgba(239,68,68,0.5)' : inputSty.borderColor }} />
                  </div>
                  {fpConfirm && fpConfirm !== fpPassword && (
                    <p className="text-[11px]" style={{ color: '#EF4444', fontFamily: '"Poppins",sans-serif' }}>
                      Passwords do not match
                    </p>
                  )}
                  <button type="submit"
                    disabled={loading || !fpPassword || fpPassword !== fpConfirm}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                    style={btnSty}>
                    {loading
                      ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Resetting…</>
                      : 'Reset Password'}
                  </button>
                </form>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
