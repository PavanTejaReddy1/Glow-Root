import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) { setStatus('error'); return; }
    setStatus('loading');
    try {
      await new Promise(r => setTimeout(r, 900));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="relative overflow-hidden py-20 md:py-28" style={{ backgroundColor: '#4B2F1F' }}>
      {/* Decorative rings */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full opacity-10"
        style={{ border: '1px solid rgba(197,155,69,0.6)' }} />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-[400px] w-[400px] rounded-full opacity-10"
        style={{ border: '1px solid rgba(197,155,69,0.6)' }} />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.06]"
        style={{ border: '1px solid rgba(197,155,69,1)' }} />

      <div className="relative mx-auto max-w-content px-4">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span
            className="mb-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ backgroundColor: 'rgba(197,155,69,0.15)', color: '#C59B45', border: '1px solid rgba(197,155,69,0.3)' }}
          >
            Join The Ritual
          </span>
          <h2
            className="mb-5 text-3xl font-medium md:text-4xl lg:text-5xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8' }}
          >
            Begin your glow journey
          </h2>
          <p
            className="mb-10 text-[15px] leading-relaxed"
            style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.72)' }}
          >
            Receive 10% off your first order, plus ritual guides, formulation notes,
            and early access to limited harvests — never more than twice a month.
          </p>

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-sm flex-col items-center gap-3 rounded-2xl p-8"
              style={{ backgroundColor: 'rgba(197,155,69,0.12)', border: '1px solid rgba(197,155,69,0.3)' }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(197,155,69,0.2)' }}>
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="#C59B45" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <p className="text-[15px] font-medium" style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8', fontSize: '1.1rem' }}>
                Welcome to GlowRoot!
              </p>
              <p className="text-[13px]" style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.65)' }}>
                Check your inbox for your 10% off gift.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="relative w-full sm:w-auto">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  aria-label="Email address"
                  className="w-full rounded-full px-6 py-3.5 text-[13px] outline-none transition-shadow focus:ring-2 sm:w-80"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    backgroundColor: 'rgba(248,242,232,0.08)',
                    color: '#F8F2E8',
                    border: '1px solid rgba(197,155,69,0.35)',
                    boxShadow: status === 'error' ? '0 0 0 2px #EF4444' : undefined,
                  }}
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={status === 'loading'}
                className="w-full rounded-full px-8 py-3.5 text-[12px] font-semibold uppercase tracking-widest transition-all hover:brightness-110 hover:-translate-y-0.5 disabled:opacity-70 sm:w-auto"
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)',
                  color: '#fff',
                  boxShadow: '0 4px 20px rgba(197,155,69,0.35)',
                }}
              >
                {status === 'loading' ? 'Subscribing…' : 'Get 10% Off'}
              </motion.button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-[12px]" style={{ fontFamily: '"Poppins", sans-serif', color: '#FCA5A5' }}>
              Please enter a valid email address.
            </p>
          )}

          <p className="mt-6 text-[11px]" style={{ fontFamily: '"Poppins", sans-serif', color: 'rgba(248,242,232,0.35)' }}>
            No spam. Unsubscribe anytime. We respect your inbox.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
