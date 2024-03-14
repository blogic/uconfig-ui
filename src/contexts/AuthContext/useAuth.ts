import * as React from 'react';
import { AuthContext } from 'contexts/AuthContext/AuthContext';

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
