import * as React from 'react';
import { flushSync } from 'react-dom';
import { useWebSocketStore } from 'api/useWebSocketStore';

const SESSION_STORAGE_KEY = 'auth';

export type User = {
  username: string;
};

export type UseAuthReturn = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<'success' | 'failure'>;
  logout: () => void;
  user?: User;
  loginWithStoredInformation: () => Promise<'success' | 'failure'>;
};

export const AuthContext = React.createContext<UseAuthReturn | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const login = useWebSocketStore((state) => state.login);
  const [user, setUser] = React.useState<User>();
  const isAuthenticated = !!user;

  const handleLogin = (username: string, password: string) =>
    login({ username, password }).then((res) => {
      if (res.result === 'success') {
        // TODO: verify how to make more secure, cookies?
        sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ username, password }));
        flushSync(() => setUser({ username }));
      }

      return res.result;
    });

  const loginWithStoredInformation = async () => {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (stored) {
      const { username, password } = JSON.parse(stored);
      const res = await handleLogin(username, password);

      return res;
    }

    return 'failure' as const;
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    setUser(undefined);
  };

  const value = React.useMemo(
    () => ({ isAuthenticated, user, login: handleLogin, logout, loginWithStoredInformation }),
    [isAuthenticated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
