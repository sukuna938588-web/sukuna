import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastOptions {
  title?: string;
  message: string;
  type?: ToastType;
}

interface Toast {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
}

export type ToastInput = string | ToastOptions;

interface ToastCtx {
  notify: (input: ToastInput, type?: ToastType) => void;
  showToast: (input: ToastInput, type?: ToastType) => void;
}
const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = useCallback((input: ToastInput, defaultType: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2);
    let message = '';
    let title: string | undefined = undefined;
    let type: ToastType = defaultType;

    if (typeof input === 'object' && input !== null) {
      message = input.message;
      title = input.title;
      if (input.type) {
        type = input.type;
      }
    } else {
      message = String(input);
    }

    setToasts((t) => [...t, { id, type, title, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const showToast = notify;

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ notify, showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              className="glass-strong rounded-2xl px-4 py-3.5 flex items-start gap-3 shadow-glass border border-slate-200/80 dark:border-slate-700/80 pointer-events-auto bg-white/95 dark:bg-slate-900/95"
            >
              <div className="mt-0.5 shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-success-500" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-error-500" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-primary-500" />}
              </div>
              <div className="flex-1 min-w-0">
                {t.title && <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.title}</p>}
                <p className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${t.title ? 'mt-0.5' : 'font-medium'}`}>{t.message}</p>
              </div>
              <button
                onClick={() => remove(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
