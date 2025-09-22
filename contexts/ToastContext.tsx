import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ToastType = 'success' | 'error';

interface ToastState {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: ToastState | null;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: () => void;
}

const AUTO_DISMISS_MS = 3000;

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const ToastContainer: React.FC<{ toast: ToastState | null; onDismiss: () => void }> = ({ toast, onDismiss }) => {
  if (!toast) {
    return null;
  }

  const baseClasses = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white text-sm z-50 animate-fade-in-down';
  const typeClasses: Record<ToastType, string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
  };

  return (
    <div className={`${baseClasses} ${typeClasses[toast.type]}`} role="status" onClick={onDismiss}>
      {toast.message}
    </div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastState | null>(null);

  const dismissToast = useCallback(() => {
    setToast(null);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  useEffect(() => {
    if (!toast || typeof window === 'undefined') {
      return;
    }

    const timer = window.setTimeout(dismissToast, AUTO_DISMISS_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [toast, dismissToast]);

  return (
    <ToastContext.Provider value={{ toast, showToast, dismissToast }}>
      {children}
      <ToastContainer toast={toast} onDismiss={dismissToast} />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
