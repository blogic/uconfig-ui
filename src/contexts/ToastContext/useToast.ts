import * as React from 'react';
import { ToastContext } from './ToastContext';

export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error('usePreferences must be used within an PreferencesProvider');
  }
  return context;
};
