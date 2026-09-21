import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4">
        {toasts.map((t) => {
          const isError = t.type === 'error';
          const isInfo = t.type === 'info';
          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md transition-all animate-fade-in ${
                isError
                  ? 'bg-rose-50/95 border-rose-200 text-rose-900'
                  : isInfo
                  ? 'bg-blue-50/95 border-blue-200 text-blue-900'
                  : 'bg-emerald-50/95 border-emerald-200 text-emerald-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isError ? (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                ) : isInfo ? (
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                )}
                <span className="text-sm font-medium leading-snug">{t.message}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className={`p-1 rounded-lg transition-colors hover:bg-black/5 ${
                  isError ? 'text-rose-600' : isInfo ? 'text-blue-600' : 'text-emerald-600'
                }`}
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

export const useToast = () => useContext(ToastContext);
