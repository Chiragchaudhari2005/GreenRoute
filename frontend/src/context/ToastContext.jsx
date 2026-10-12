import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      {/* Toast floating notifications stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => {
          let bg = 'bg-white border-brand-greyBlue text-brand-black';
          let icon = <Info className="w-5 h-5 text-brand-info flex-shrink-0" />;

          if (toast.type === 'success') {
            bg = 'bg-white border-green-500 text-brand-black';
            icon = <CheckCircle2 className="w-5 h-5 text-brand-primary flex-shrink-0" />;
          } else if (toast.type === 'error') {
            bg = 'bg-white border-red-500 text-brand-black';
            icon = <AlertCircle className="w-5 h-5 text-brand-error flex-shrink-0" />;
          } else if (toast.type === 'warning') {
            bg = 'bg-white border-yellow-500 text-brand-black';
            icon = <AlertTriangle className="w-5 h-5 text-brand-warning flex-shrink-0" />;
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-fade-in ${bg}`}
              role="alert"
            >
              {icon}
              <div className="flex-1 text-sm font-medium leading-5">{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded transition"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
