import * as React from 'react';
import { ApiContext } from './ApiContext';

export const useApi = () => {
  const context = React.useContext(ApiContext);

  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};
