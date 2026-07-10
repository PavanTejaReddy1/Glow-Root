import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import navbar_logo from '../../assets/navbar_logo.png';

export default function AuthCard({ children, title, subtitle, footerLink, footerText }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl p-8 shadow-lg"
      style={{ backgroundColor: '#F8F2E8' }}
    >
      {/* Logo with golden glow */}
      <div className="mb-8 flex justify-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{
              background: 'radial-gradient(circle, #C59B45 0%, transparent 70%)'
            }}
          />
          <Link to="/" className="relative block">
            <img
              src={navbar_logo}
              alt="GlowRoot"
              className="w-[160px] md:w-[220px]"
            />
          </Link>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8 text-center">
        <h1
          className="mb-3 text-3xl font-medium md:text-4xl"
          style={{ fontFamily: '"Cormorant Garamond", serif', color: '#4B2F1F' }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="text-base"
            style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {/* Form Content */}
      {children}

      {/* Footer Link */}
      {footerText && footerLink && (
        <p
          className="mt-6 text-center text-sm"
          style={{ fontFamily: '"Poppins", sans-serif', color: '#6E4B2A' }}
        >
          {footerText}{' '}
          <Link
            to={footerLink.to}
            className="font-medium transition-colors hover:opacity-80"
            style={{ color: '#C59B45' }}
          >
            {footerLink.text}
          </Link>
        </p>
      )}
    </motion.div>
  );
}
