import * as React from 'react';
import { ConfigurationContext } from './ConfigurationContext';

export const useConfiguration = () => {
  const context = React.useContext(ConfigurationContext);

  if (!context) {
    throw new Error('useConfiguration must be used within an ConfigurationProvider');
  }
  return context;
};
