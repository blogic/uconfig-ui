import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'i18n/i18n';
import './index.css';
import { ApiProvider } from 'contexts/ApiContext/ApiContext';
import { PreferencesProvider } from 'contexts/PreferencesContext/PreferencesContext';
import { ToastProvider } from 'contexts/ToastContext/ToastContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PreferencesProvider>
        <ApiProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ApiProvider>
      </PreferencesProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
