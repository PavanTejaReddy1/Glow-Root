import { useState } from 'react';
import { forwardRef } from 'react';

const PasswordInput = forwardRef(({ label, placeholder, error, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {label && (
        <label
          className="mb-2 block text-sm font-medium"
          style={{ fontFamily: '"Poppins", sans-serif', color: '#4B2F1F' }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder}
          className={`w-full rounded-lg border px-4 py-3 pr-12 text-base outline-none transition-all ${
            error ? 'border-red-500' : ''
          }`}
          style={{
            fontFamily: '"Poppins", sans-serif',
            backgroundColor: '#FFFFFF',
            borderColor: error ? '#EF4444' : 'rgba(197,155,69,0.25)',
            color: '#4B2F1F',
          }}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:opacity-80"
          style={{ color: '#C59B45' }}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#EF4444', fontFamily: '"Poppins", sans-serif' }}>
          {error}
        </p>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
