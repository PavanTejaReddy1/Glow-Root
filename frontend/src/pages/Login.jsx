import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';
import AuthInput from '../components/auth/AuthInput.jsx';
import PasswordInput from '../components/auth/PasswordInput.jsx';
import SocialLogin from '../components/auth/SocialLogin.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { success, error } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    document.title = 'Login — GlowRoot';
  }, []);

  const onSubmit = async (data) => {
    try {
      await login({ email: data.email, password: data.password });
      success('Login successful! Welcome back.');
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      error(err.response?.data?.message || 'Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <AuthLayout title="Login">
      <AuthCard
        title="Welcome Back"
        subtitle="Sign in to continue your GlowRoot journey."
        footerText="Don't have an account?"
        footerLink={{ to: '/signup', text: 'Create Account' }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            }
          />

          <PasswordInput
            label="Password"
            placeholder="Enter your password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
            error={errors.password?.message}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border"
                style={{ borderColor: 'rgba(197,155,69,0.25)', accentColor: '#C59B45' }}
                {...register('remember')}
              />
              <span
                className="text-sm"
                style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
              >
                Remember me
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-sm transition-colors hover:opacity-80"
              style={{ color: '#C59B45', fontFamily: '"Poppins", sans-serif' }}
            >
              Forgot Password?
            </Link>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full py-3 text-sm font-medium tracking-wider uppercase transition-all hover:shadow-lg disabled:opacity-70"
            style={{
              fontFamily: '"Poppins", sans-serif',
              background: 'linear-gradient(135deg, #C59B45 0%, #A8771E 100%)',
              color: '#F8F2E8'
            }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>

        <SocialLogin text="OR" />
      </AuthCard>
    </AuthLayout>
  );
}
