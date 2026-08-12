import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import AuthCard from '../components/auth/AuthCard.jsx';
import AuthInput from '../components/auth/AuthInput.jsx';
import PasswordInput from '../components/auth/PasswordInput.jsx';
import SocialLogin from '../components/auth/SocialLogin.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { success, error } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  useEffect(() => {
    document.title = 'Sign Up — GlowRoot';
  }, []);

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const nameParts = data.fullName.split(' ');
      const userData = {
        firstName: nameParts[0],
        email: data.email,
        password: data.password
      };

      if (nameParts.length > 1) {
        userData.lastName = nameParts.slice(1).join(' ');
      }

      if (data.phone) {
        userData.phone = data.phone;
      }

      await registerUser(userData);
      success('Account created successfully! Welcome to GlowRoot.');
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      error(err.response?.data?.message || 'Signup failed. Please try again with different credentials.');
    }
  };

  return (
    <AuthLayout title="Signup">
      <AuthCard
        title="Create Your GlowRoot Account"
        subtitle="Join thousands embracing natural skincare."
        footerText="Already have an account?"
        footerLink={{ to: '/login', text: 'Login' }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <AuthInput
            label="Full Name"
            type="text"
            placeholder="Enter your full name"
            {...register('fullName', {
              required: 'Full name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            error={errors.fullName?.message}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

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

          <AuthInput
            label="Phone Number"
            type="tel"
            placeholder="Enter your phone number (optional)"
            {...register('phone', {
              pattern: {
                value: /^[6-9]\d{9}$/,
                message: 'Invalid phone number'
              }
            })}
            error={errors.phone?.message}
            icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            }
          />

          <PasswordInput
            label="Password"
            placeholder="Create a password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message: 'Password must contain uppercase, lowercase, and number'
              }
            })}
            error={errors.password?.message}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />

          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border"
              style={{ borderColor: 'rgba(197,155,69,0.25)', accentColor: '#C59B45' }}
              {...register('terms', {
                required: 'You must agree to the terms'
              })}
            />
            <span
              className="text-sm leading-tight"
              style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
            >
              I agree to the{' '}
              <Link to="/terms" className="transition-colors hover:opacity-80" style={{ color: '#C59B45' }}>
                Terms & Conditions
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="transition-colors hover:opacity-80" style={{ color: '#C59B45' }}>
                Privacy Policy
              </Link>
            </span>
          </label>
          {errors.terms && (
            <p className="text-xs" style={{ color: '#EF4444', fontFamily: '"Poppins", sans-serif' }}>
              {errors.terms.message}
            </p>
          )}

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
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        <SocialLogin text="OR" />
      </AuthCard>
    </AuthLayout>
  );
}
