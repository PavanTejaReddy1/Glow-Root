import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import navbar_logo from '../assets/navbar_logo.png';

/* ── Step indicator ── */
function Steps({ current }) {
  const steps = ['Email', 'Verify OTP', 'New Password'];
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all duration-300"
              style={{
                backgroundColor: i <= current ? '#4B2F1F' : 'rgba(75,47,31,0.12)',
                color:           i <= current ? '#F8F2E8' : '#9CA3AF',
              }}
            >
              {i < current ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              ) : i + 1}
            </div>
            <span
              className="mt-1 text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: i === current ? '#4B2F1F' : '#9CA3AF', fontFamily: '"Poppins",sans-serif' }}
            >
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="mb-5 h-px w-10 transition-all duration-300"
              style={{ backgroundColor: i < current ? '#4B2F1F' : 'rgba(75,47,31,0.15)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ── OTP 6-box input ── */
function OtpInput({ value, onChange }) {
  const refs = Array.from({ length: 6 }, () => useRef(null));

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = [...value];
      if (next[i]) { next[i] = ''; onChange(next.join('')); }
      else if (i > 0) { refs[i - 1].current?.focus(); }
    }
  };

  const handleChange = (i, e) => {
    const char = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...value.padEnd(6, ' ').split('')];
    next[i] = char;
    const joined = next.join('').trimEnd();
    onChange(joined);
    if (char && i < 5) refs[i + 1].current?.focus();
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(paste);
    refs[Math.min(paste.length, 5)].current?.focus();
    e.preventDefault();
  };

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className="h-13 w-11 rounded-xl border-2 text-center text-[20px] font-bold outline-none transition-all duration-200 focus:scale-105"
          style={{
            borderColor:     value[i] ? '#4B2F1F' : 'rgba(197,155,69,0.3)',
            color:           '#4B2F1F',
            backgroundColor: value[i] ? 'rgba(75,47,31,0.06)' : '#F8F2E8',
            fontFamily:      'monospace',
            height:          '52px',
          }}
        />
      ))}
    </div>
  );
}

export default function ForgotPassword() {
  const navigate  = useNavigate();
  const { success, error: toastError } = useToast();

  const [step,        setStep]        = useState(0); // 0=email, 1=otp, 2=password
  const [email,       setEmail]       = useState('');
  const [otp,         setOtp]         = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [countdown,   setCountdown]   = useState(0);
  const [showPass,    setShowPass]    = useState(false);

  useEffect(() => { document.title = 'Forgot Password — GlowRoot'; }, []);

  /* countdown timer for resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  /* Step 1 — send OTP */
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post('/api/v1/auth/forgot-password', { email: email.trim() });
      success('OTP sent! Check your inbox.');
      setStep(1);
      setCountdown(60);
    } catch (err) {
      toastError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* Step 1 resend */
  const handleResend = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await api.post('/api/v1/auth/forgot-password', { email: email.trim() });
      success('New OTP sent!');
      setCountdown(60);
      setOtp('');
    } catch (err) {
      toastError('Failed to resend OTP.');
    } finally {
      setLoading(false);
    }
  };

  /* Step 2 — verify OTP (move to step 3) */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toastError('Enter all 6 digits'); return; }
    // We just move to step 3; actual verification happens on password submit
    setStep(2);
  };

  /* Step 3 — reset password */
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) { toastError('Passwords do not match'); return; }
    if (newPassword.length < 8)      { toastError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await api.post('/api/v1/auth/verify-otp-reset', {
        email: email.trim(),
        otp:   otp.trim(),
        newPassword,
      });
      success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Reset failed. Please try again.';
      toastError(msg);
      // If OTP invalid/expired go back to OTP step
      if (msg.toLowerCase().includes('otp') || msg.toLowerCase().includes('expired')) {
        setStep(1);
        setOtp('');
      }
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#F8F2E8',
    border: '1px solid rgba(197,155,69,0.22)',
  };

  const inputStyle = {
    fontFamily:      '"Poppins",sans-serif',
    borderColor:     'rgba(197,155,69,0.3)',
    color:           '#4B2F1F',
    backgroundColor: '#FCFAF6',
  };

  const btnStyle = {
    fontFamily: '"Poppins",sans-serif',
    background: 'linear-gradient(135deg,#4B2F1F 0%,#6E4B2A 100%)',
    color:      '#F8F2E8',
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#F5EDE0' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link to="/">
            <img src={navbar_logo} alt="GlowRoot" className="h-14 w-auto" />
          </Link>
        </div>

        <div className="rounded-3xl p-8 shadow-xl" style={cardStyle}>
          <Steps current={step} />

          <AnimatePresence mode="wait">
            {/* ── Step 0: Email ── */}
            {step === 0 && (
              <motion.div key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="mb-2 text-2xl font-semibold text-center"
                  style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                  Forgot Password?
                </h2>
                <p className="mb-6 text-center text-[13px]"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                  Enter your email and we'll send a 6-digit OTP.
                </p>
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                      Email Address
                    </label>
                    <input
                      type="email" required autoFocus
                      value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-amber-300"
                      style={inputStyle}
                    />
                  </div>
                  <button type="submit" disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-60"
                    style={btnStyle}>
                    {loading
                      ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending OTP…</>
                      : 'Send OTP'}
                  </button>
                </form>
                <p className="mt-6 text-center text-[12px]"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#9CA3AF' }}>
                  Remember your password?{' '}
                  <Link to="/login" className="font-semibold hover:underline" style={{ color: '#4B2F1F' }}>
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {/* ── Step 1: OTP ── */}
            {step === 1 && (
              <motion.div key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="mb-2 text-2xl font-semibold text-center"
                  style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                  Enter OTP
                </h2>
                <p className="mb-2 text-center text-[13px]"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                  We sent a 6-digit code to
                </p>
                <p className="mb-6 text-center text-[14px] font-semibold"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#4B2F1F' }}>
                  {email}
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  <OtpInput value={otp} onChange={setOtp} />

                  <button type="submit" disabled={otp.length < 6 || loading}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-60"
                    style={btnStyle}>
                    Verify OTP
                  </button>
                </form>

                <div className="mt-5 flex items-center justify-between text-[12px]"
                  style={{ fontFamily: '"Poppins",sans-serif' }}>
                  <button onClick={() => setStep(0)} className="text-gray-400 hover:text-gray-600">
                    ← Change email
                  </button>
                  <button
                    onClick={handleResend}
                    disabled={countdown > 0}
                    className="font-semibold transition-colors disabled:opacity-40"
                    style={{ color: countdown > 0 ? '#9CA3AF' : '#4B2F1F' }}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 2: New Password ── */}
            {step === 2 && (
              <motion.div key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <h2 className="mb-2 text-2xl font-semibold text-center"
                  style={{ fontFamily: '"Cormorant Garamond",serif', color: '#4B2F1F' }}>
                  Set New Password
                </h2>
                <p className="mb-6 text-center text-[13px]"
                  style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                  Choose a strong password for your account.
                </p>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPass ? 'text' : 'password'}
                        required minLength={8}
                        value={newPassword} onChange={e => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full rounded-xl border px-4 py-3 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-amber-300"
                        style={inputStyle}
                      />
                      <button type="button" onClick={() => setShowPass(p => !p)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                          {showPass
                            ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                            : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}
                        </svg>
                      </button>
                    </div>
                    {/* Password strength bar */}
                    {newPassword && (
                      <div className="mt-2 flex gap-1">
                        {[...Array(4)].map((_, i) => {
                          const strength = newPassword.length >= 12 && /[A-Z]/.test(newPassword) && /\d/.test(newPassword) ? 4
                            : newPassword.length >= 10 ? 3 : newPassword.length >= 8 ? 2 : 1;
                          return (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all"
                              style={{ backgroundColor: i < strength ? (strength > 2 ? '#5B7F3A' : '#C59B45') : 'rgba(197,155,69,0.2)' }} />
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wider"
                      style={{ fontFamily: '"Poppins",sans-serif', color: '#6E4B2A' }}>
                      Confirm Password
                    </label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full rounded-xl border px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-amber-300"
                      style={{
                        ...inputStyle,
                        borderColor: confirmPass && confirmPass !== newPassword ? 'rgba(239,68,68,0.5)' : inputStyle.borderColor,
                      }}
                    />
                    {confirmPass && confirmPass !== newPassword && (
                      <p className="mt-1 text-[11px]" style={{ color: '#EF4444', fontFamily: '"Poppins",sans-serif' }}>
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <button type="submit"
                    disabled={loading || !newPassword || newPassword !== confirmPass}
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[12px] font-bold uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-60"
                    style={btnStyle}>
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
