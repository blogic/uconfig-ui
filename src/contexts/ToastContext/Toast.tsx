import { ToastOptions } from './ToastContext.utils';
import { useTimeoutCallback } from 'hooks/useTimeoutCallback';

export type ToastProps = {
  message: string;
  options: ToastOptions;
  onRemoveToast: (id: number) => void;
};

export const Toast = ({ message, options, onRemoveToast }: ToastProps) => {
  useTimeoutCallback({
    callback: () => {
      onRemoveToast(options.id);
    },
    delay: 5000,
  });
  return (
    <div key={options.id} className="w-80 rounded-md bg-white p-4 shadow-md dark:bg-gray-800">
      {message}
    </div>
  );
};
