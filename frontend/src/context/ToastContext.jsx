import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

const ICONS = {
  success: (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

const STYLES = {
  success: { bg: '#10B981', border: '#059669' },
  error:   { bg: '#EF4444', border: '#DC2626' },
  warning: { bg: '#F59E0B', border: '#D97706' },
  info:    { bg: '#3B82F6', border: '#2563EB' },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error   = useCallback((message) => addToast(message, 'error'),   [addToast]);
  const info    = useCallback((message) => addToast(message, 'info'),    [addToast]);
  const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
      {children}

      {/* Toast Container */}
      <div
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3"
        style={{ maxWidth: '380px', width: 'calc(100vw - 48px)' }}
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map(toast => {
          const style = STYLES[toast.type] || STYLES.info;
          return (
            <div
              key={toast.id}
              role="alert"
              className="flex items-start gap-3 rounded-xl px-4 py-3 shadow-xl"
              style={{
                backgroundColor: style.bg,
                border: `1px solid ${style.border}`,
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                animation: 'slideInRight 0.25s ease-out',
              }}
            >
              {ICONS[toast.type]}
              <span className="flex-1 text-sm leading-snug">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="ml-1 flex-shrink-0 rounded-full p-0.5 opacity-70 transition-opacity hover:opacity-100"
                aria-label="Dismiss"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
