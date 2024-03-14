import * as React from 'react';
import { ApiStatusModal } from './ApiStatusModal';
import { WebSocketApiStatus, useWebSocketStore } from 'api/useWebSocketStore';

export type UseApiReturn = {
  wsStatus: WebSocketApiStatus;
};

export const ApiContext = React.createContext<UseApiReturn | null>(null);

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const wsStatus = useWebSocketStore.use.status();

  const value = React.useMemo(() => ({ wsStatus }), [wsStatus]);

  return (
    <ApiContext.Provider value={value}>
      <ApiStatusModal />
      {children}
    </ApiContext.Provider>
  );
};
