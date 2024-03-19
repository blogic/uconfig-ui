import { Configuration } from './types/configurations.types';
import { SystemInfo } from './types/systemInfo.types';
import { randomIntId } from 'utils/randomIntId';
import { AtLeast } from 'utils/types';

export const createApiPayload = (payload: AtLeast<{ action: string } & Record<string, unknown>, 'action'>) => ({
  ...payload,
  id: randomIntId(),
});

const WebSocketApiActions = [
  'user',
  'event',
  'config',
  'system',
  'login-required',
  'setup-required',
  'authenticated',
  'get',
] as const;

type GenericMessage = {
  id?: number;
  action: (typeof WebSocketApiActions)[number];
  method: string;
  params?: Partial<{
    configs: string[];
    active: string;
    config: Configuration;
    info: SystemInfo;
  }>;
  result?: number;
};

export type WebSocketCallback = {
  /** The id given with the request message */
  id: number;
  action: string;

  /** Will be called once the corresponding response is received */
  callback: (response: any) => void;
};

export const isValidWebSocketMessage = (message: object): message is GenericMessage => {
  const msg = message as GenericMessage;

  if (msg.method && WebSocketApiActions.includes(msg.action)) {
    return true;
  }

  return false;
};

const STORAGE_LOGIN_INFO_KEY = 'loginInfo';

export const storeLoginInfo = (loginInfo: { username: string; password: string }) => {
  localStorage.setItem(STORAGE_LOGIN_INFO_KEY, JSON.stringify(loginInfo));
};

export const getStoredLoginInfo = () => {
  const loginInfo = localStorage.getItem(STORAGE_LOGIN_INFO_KEY);
  if (loginInfo) {
    return JSON.parse(loginInfo) as { username: string; password: string };
  }
  return null;
};

export const removeStoredLoginInfo = () => {
  localStorage.removeItem(STORAGE_LOGIN_INFO_KEY);
};
