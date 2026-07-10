import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="py-16 md:py-24" style={{ backgroundColor: '#4B2F1F' }}>
      <div className="mx-auto max-w-content px-4">
        <div className="mx-auto max-w-xl text-center">
          <span
            className="mb-3 inline-block text-sm font-medium tracking-wider uppercase"
            style={{ color: '#C59B45' }}
          >
            Join The Ritual
          </span>
          <h2
            className="mb-4 text-3xl font-medium md:text-4xl"
            style={{ fontFamily: '"Cormorant Garamond", serif', color: '#F8F2E8' }}
          >
            Begin your glow journey
          </h2>
          <p
            className="mb-8 text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#FCFAF6' }}
          >
            Receive 10% off your first order, plus ritual guides, formulation notes,
            and early access to limited harvests — never more than twice a month.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full px-6 py-3 text-sm sm:w-80"
              style={{
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: '#F8F2E8',
                color: '#4B2F1F',
                border: '1px solid rgba(197,155,69,0.25)'
              }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-full px-8 py-3 text-sm font-medium tracking-wider uppercase transition-colors hover:opacity-90 sm:w-auto"
              style={{
                fontFamily: '"Poppins", sans-serif',
                backgroundColor: '#C59B45',
                color: '#F8F2E8'
              }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>

          {status === 'success' && (
            <p
              className="mt-4 text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#C59B45' }}
            >
              Welcome to GlowRoot — check your inbox for your gift.
            </p>
          )}
          {status === 'error' && (
            <p
              className="mt-4 text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#EFE3D1' }}
            >
              Please enter a valid email address.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
