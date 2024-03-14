import * as React from 'react';
import { PreferencesContext } from './PreferencesContext';

export const usePreferences = () => {
  const context = React.useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences must be used within an PreferencesProvider');
  }
  return context;
};
