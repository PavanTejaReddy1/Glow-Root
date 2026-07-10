import { forwardRef } from 'react';

const AuthInput = forwardRef(
  ({ label, type = 'text', placeholder, error, icon, ...props }, ref) => {
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
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#C59B45' }}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className={`w-full rounded-lg border px-4 py-3 text-base outline-none transition-all ${
              icon ? 'pl-12' : 'px-4'
            } ${error ? 'border-red-500' : ''}`}
            style={{
              fontFamily: '"Poppins", sans-serif',
              backgroundColor: '#FFFFFF',
              borderColor: error ? '#EF4444' : 'rgba(197,155,69,0.25)',
              color: '#4B2F1F',
            }}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs" style={{ color: '#EF4444', fontFamily: '"Poppins", sans-serif' }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = 'AuthInput';

export default AuthInput;
