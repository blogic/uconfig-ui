import * as React from 'react';
import { Toast } from './Toast';
import { ToastOptions } from './ToastContext.utils';
import { randomIntId } from 'utils/randomIntId';

export type UseToastReturn = {
  pushToast: (message: string, options?: ToastOptions) => void;
  onRemoveToast: (id: number) => void;
};

export const ToastContext = React.createContext<UseToastReturn | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<
    {
      message: string;
      options: ToastOptions;
    }[]
  >([]);

  const onRemoveToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.options.id !== id));
  };

  const pushToast = (message: string, options?: ToastOptions) => {
    setToasts((prev) => [
      ...prev,
      {
        message,
        options: options || {
          id: randomIntId(),
        },
      },
    ]);
  };

  const value = React.useMemo(() => ({ pushToast, onRemoveToast }), [pushToast, onRemoveToast]);

  return (
    <ToastContext.Provider value={value}>
      <div className="absolute right-4 top-4 space-y-4">
        {toasts.map((toast) => (
          <Toast key={toast.options.id} onRemoveToast={onRemoveToast} {...toast} />
        ))}
      </div>
      {children}
    </ToastContext.Provider>
  );
};
