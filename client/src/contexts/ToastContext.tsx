import {  createContext, useContext, useState,  useCallback  } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, Copy } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  requestId?: string;
}

interface ToastContextType {
  success: (msg: string) => void;
  error: (msg: string, opts?: { requestId?: string }) => void;
  info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((message: string, type: ToastType, requestId?: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type, requestId }]);
    
    // Auto dismiss after 5s
    setTimeout(() => {
      remove(id);
    }, 5000);
  }, [remove]);

  const success = useCallback((msg: string) => add(msg, 'success'), [add]);
  const error = useCallback((msg: string, opts?: { requestId?: string }) => 
    add(msg, 'error', opts?.requestId), [add]);
  const info = useCallback((msg: string) => add(msg, 'info'), [add]);

  // Copy helper for request ID
  const copyRequestId = (reqId: string) => {
    navigator.clipboard.writeText(reqId);
    success('Copied Reference ID!');
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      
      {/* Toast container */}
      <div 
        className="fixed z-50 flex flex-col gap-2 max-w-sm w-full bottom-4 right-4 max-sm:bottom-4 max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:px-4"
        role="status"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl transition-all duration-300 transform translate-y-0 opacity-100 dark:bg-zinc-900 bg-white dark:border-zinc-800 border-zinc-200`}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium dark:text-zinc-100 text-zinc-800">{t.message}</p>
              {t.requestId && (
                <div className="flex items-center gap-1.5 mt-2 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="truncate">Ref: {t.requestId}</span>
                  <button
                    onClick={() => copyRequestId(t.requestId!)}
                    className="p-0.5 hover:text-zinc-800 dark:hover:text-zinc-100"
                    title="Copy Request ID"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => remove(t.id)}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 shrink-0 p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
