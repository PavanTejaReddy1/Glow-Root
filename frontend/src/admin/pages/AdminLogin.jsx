import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import navbar_logo from '../../assets/navbar_logo.png';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication
    if (email === 'admin@glowroot.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      alert('Invalid credentials');
    }
    
    setLoading(false);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{ backgroundColor: '#F8F2E8' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div
          className="rounded-2xl p-8 shadow-lg"
          style={{ backgroundColor: '#F8F2E8', border: '1px solid rgba(197,155,69,0.25)' }}
        >
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img src={navbar_logo} alt="GlowRoot" className="h-16 w-auto" />
          </div>

          {/* Title */}
          <div className="mb-8 text-center">
            <h1
              className="mb-2 text-3xl font-semibold"
              style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
            >
              Admin Login
            </h1>
            <p
              className="text-sm"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              Sign in to manage your store
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  style={{ color: '#6E4B2A' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@glowroot.com"
                  className="w-full rounded-full border px-12 py-3 focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    borderColor: 'rgba(197,155,69,0.25)',
                    color: '#4B2F1F',
                    backgroundColor: '#FCFAF6'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2"
                  style={{ color: '#6E4B2A' }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-full border px-12 py-3 focus:outline-none focus:ring-2"
                  style={{
                    fontFamily: '"Poppins", sans-serif',
                    borderColor: 'rgba(197,155,69,0.25)',
                    color: '#4B2F1F',
                    backgroundColor: '#FCFAF6'
                  }}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-white font-medium transition-all hover:shadow-lg disabled:opacity-50"
              style={{
                fontFamily: '"Poppins", sans-serif',
                background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)'
              }}
            >
              {loading ? 'Signing in...' : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p
              className="text-xs"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              Demo: admin@glowroot.com / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
