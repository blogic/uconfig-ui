import * as React from 'react';

export type UseTimeoutCallbackProps = {
  callback: () => void;
  delay: number;
};

export const useTimeoutCallback = ({ callback, delay }: UseTimeoutCallbackProps) => {
  React.useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;

    timeout = setTimeout(() => {
      callback();
    }, delay);

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [delay, callback]);
};
