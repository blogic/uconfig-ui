import { StoreApi, UseBoundStore } from 'zustand';
//import { DUMMY_BOARD } from './types/board.types';
import { DUMMY_CLIENTS } from './types/clients.types';
import { Configuration } from './types/configurations.types';
import { DUMMY_PORTS } from './types/ports.types';
import { SystemInfo } from './types/systemInfo.types';
import { randomIntId } from 'utils/randomIntId';

type GenericMessage = {
  id?: number;
  action: 'user' | 'event' | 'config' | 'system';
  method: string;
  params?: Partial<{
    configs: string[];
    active: string;
    config: Configuration;
    info: SystemInfo;
  }>;
  result?: number;
};

export const WebSocketApiActions = {
  system: {
    getSystemInfo: {
      getPayload: () => ({ id: randomIntId(), action: 'system', method: 'info' }),
    },
    getBoard: {
      getPayload: () => ({ id: randomIntId(), action: 'system', method: 'board' }),
    },
    getPorts: {
      getPayload: () => ({ id: randomIntId(), action: 'system', method: 'ports' }),
    },
    getClients: {
      getPayload: () => ({ id: randomIntId(), action: 'system', method: 'clients' }),
    },
    restart: {
      getPayload: () => ({ id: randomIntId(), action: 'system', method: 'reboot' }),
    },
    handleResponse: (message: GenericMessage) => {
      if (message.method === 'reboot') {
        return {
          method: 'reboot',
          id: message.id,
          result: message.result === 0 ? ('success' as const) : ('failure' as const),
        };
      }
      if (message.method === 'info') {
        return {
          method: 'info',
          id: message.id,
          info: message.params
        };
      }
      if (message.method === 'board') {
        return {
          method: 'board',
          id: message.id,
          board: message.params,
        };
      }
      if (message.method === 'ports') {
        return {
          method: 'ports',
          id: message.id,
          ports: DUMMY_PORTS,
        };
      }
      if (message.method === 'clients') {
        return {
          method: 'clients',
          id: message.id,
          clients: DUMMY_CLIENTS,
        };
      }

      return null;
    },
  },
  user: {
    login: {
      getPayload: (username: string, password: string) => ({
        id: randomIntId(),
        action: 'user',
        method: 'authenticate',
        params: { username, password },
      }),
    },
    handleResponse: (message: GenericMessage) => {
      if (message.method === 'login-required') {
        return { result: 'login-required', id: message.id };
      }
      if (message.method === 'authenticate') {
        if (message.result === 0) {
          return { result: 'success', id: message.id };
        }
        return { result: 'failure', id: message.id };
      }

      return null;
    },
  },
  event: {
    ping: {
      getPayload: () => ({ id: randomIntId(), action: 'event', method: 'ping' }),
    },
    handleResponse: (message: GenericMessage) => {
      if (message.method === 'pong') {
        return { method: 'ping', id: message.id };
      }

      return null;
    },
  },
  config: {
    getListPayload: () => ({ id: randomIntId(), action: 'config', method: 'list' }),
    getCurrentPayload: () => ({
      id: randomIntId(),
      action: 'config',
      method: 'get',
    }),
    updateConfigPayload: (config: Configuration) => ({
      id: randomIntId(),
      action: 'config',
      method: 'upload',
      params: { config },
    }),
    handleResponse: (message: GenericMessage) => {
      // Example: { "configs": [ "0000000001" ], "active": "cfg" }
      if (message.method === 'list' && Array.isArray(message.params?.configs as unknown[]) && message.params?.active) {
        return {
          id: message.id,
          configs: message.params.configs ?? [],
          active: message.params.active,
        };
      }
      if (message.method === 'get' && message.params?.config) {
        return { id: message.id, config: message.params.config };
      }

      return null;
    },
  },
} as const;

const VALID_WebSocketApiActions = Object.keys(WebSocketApiActions);

export type WebSocketConfigCallback = {
  /** The id given with the request message */
  id: number;
  action: 'config';

  /** Will be called once the corresponding response is received */
  callback: (response: ReturnType<(typeof WebSocketApiActions)['config']['handleResponse']>) => void;
};

export type WebSocketEventCallback = {
  /** The id given with the request message */
  id: number;
  action: 'event';

  /** Will be called once the corresponding response is received */
  callback: (response: ReturnType<(typeof WebSocketApiActions)['event']['handleResponse']>) => void;
};

export type WebSocketSystemCallback = {
  /** The id given with the request message */
  id: number;
  action: 'system';

  /** Will be called once the corresponding response is received */
  callback: (response: ReturnType<(typeof WebSocketApiActions)['system']['handleResponse']>) => void;
};

export type WebSocketUserCallback = {
  /** The id given with the request message */
  id: number;
  action: 'user';

  /** Will be called once the corresponding response is received */
  callback: (response: ReturnType<(typeof WebSocketApiActions)['user']['handleResponse']>) => void;
};

export type WebSocketCallback =
  | WebSocketConfigCallback
  | WebSocketEventCallback
  | WebSocketUserCallback
  | WebSocketSystemCallback;

export const isValidWebSocketMessage = (message: object): message is GenericMessage => {
  const msg = message as GenericMessage;

  if (msg.method && VALID_WebSocketApiActions.includes(msg.action)) {
    return true;
  }

  return false;
};
/**
 * This is a workaround for the lack of TypeScript support for recursive types. Used in conjunction with
 * zustand hooks, it allows to create a store with selectors that are automatically typed.
 */
type WithSelectors<S> = S extends { getState: () => infer T } ? S & { use: { [K in keyof T]: () => T[K] } } : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const k of Object.keys(store.getState())) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

const STORAGE_LOGIN_INFO_KEY = 'loginInfo';

export const storeLoginInfo = (loginInfo: { username: string; password: string }) => {
  localStorage.setItem(STORAGE_LOGIN_INFO_KEY, JSON.stringify(loginInfo));
};

export const getStoredLoginInfo = () => {
  const loginInfo = localStorage.getItem(STORAGE_LOGIN_INFO_KEY);
  if (loginInfo) {
    return JSON.parse(loginInfo);
  }
  return null;
};
