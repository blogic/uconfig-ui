import { create } from 'zustand';
import { Board } from './types/board.types';
import { Clients } from './types/clients.types';
import { Configuration } from './types/configurations.types';
import { Ports } from './types/ports.types';
import { SystemInfo } from './types/systemInfo.types';
import {
  WebSocketCallback,
  createApiPayload,
  getStoredLoginInfo,
  isValidWebSocketMessage,
  removeStoredLoginInfo,
  storeLoginInfo,
} from './webSocketUtils';
import ReconnectingWebSocket from 'api/ReconnectingWebSocket';

/** Handle raw WebSocket messages and call corresponding callback(s) */
const handleWebSocketMessage = (event: MessageEvent, _: ReconnectingWebSocket, callbacks: WebSocketCallback[]) => {
  const parsedMessage = JSON.parse(event.data);

  if (!isValidWebSocketMessage(parsedMessage)) {
    throw new Error('Invalid WebSocket message');
  }

  switch (parsedMessage.action) {
    case 'config': {
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'config' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach(({ callback }) => {
        callback(parsedMessage);
      });

      return callbacksToFire;
    }
    case 'user': {
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'user' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach(({ callback }) => {
        callback(parsedMessage);
      });

      return callbacksToFire;
    }
    case 'system': {
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'system' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach(({ callback }) => {
        callback(parsedMessage);
      });

      return callbacksToFire;
    }
    case 'get': {
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'get' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach(({ callback }) => {
        callback(parsedMessage);
      });

      return callbacksToFire;
    }
    default:
      throw new Error('Invalid WebSocket message');
  }
};

export type WebSocketApiStatus =
  | 'connecting'
  | 'connected'
  | 'login-required'
  | 'setup-required'
  | 'authorized'
  | 'error';

export type WebSocketStore = {
  ws: ReconnectingWebSocket;
  status: WebSocketApiStatus;
  configuration?: object;
  eventListeners: WebSocketCallback[];
  addEventListeners: (callback: WebSocketCallback[]) => void;
  request: <T>(request: {
    payload: {
      id: number;
      action: string | WebSocketCallback['action'];
    } & object;
    extractFn: (response: any) => T | undefined;
    timeout?: number;
  }) => Promise<T>;

  login: (req?: { username: string; password: string }) => Promise<{ result: 'success' | 'failure' }>;
  logout: () => void;
  restart: (timeout?: number) => Promise<true | false>;
  getConfigurationList: (timeout?: number) => Promise<{ configs: string[]; active: string }>;
  getCurrentConfiguration: (timeout?: number) => Promise<Configuration>;
  getSystemInfo: (timeout?: number) => Promise<SystemInfo>;
  getBoard: (timeout?: number) => Promise<Board>;
  getPorts: (timeout?: number) => Promise<Ports>;
  getClients: (timeout?: number) => Promise<Clients>;
};

export const useWebSocketStore = create<WebSocketStore>((set, get) => {
  const ws = new ReconnectingWebSocket({ url: import.meta.env.VITE_WS_URL });

  ws.onopen = () => {
    set({ status: 'connected' });
    const storedInformation = getStoredLoginInfo();

    if (storedInformation) get().login(storedInformation);
  };

  ws.onmessage = (event) => {
    try {
      const callbacksToRemove = handleWebSocketMessage(event, ws, get().eventListeners);

      set((state) => ({
        eventListeners: state.eventListeners.filter((callback) => !callbacksToRemove.includes(callback)),
      }));
    } catch (e) {
      // TODO: handle error? log?
    }
  };

  ws.onclose = () => {
    set({ status: 'error' });
  };

  ws.onerror = () => {
    set({ status: 'error' });
  };

  return {
    ws,
    status: 'connecting',
    eventListeners: [],
    addEventListeners: (events: WebSocketCallback[]) => {
      set((state) => ({
        eventListeners: [...state.eventListeners, ...events],
      }));
    },
    request: <T>({
      payload,
      extractFn,
      timeout = 5000,
    }: {
      payload: {
        id: number;
        action: string | WebSocketCallback['action'];
      } & object;
      extractFn: (response: any) => T | undefined;
      timeout?: number;
    }): Promise<T> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          get().addEventListeners([
            {
              id: payload.id,
              action: payload.action as WebSocketCallback['action'],
              callback: (msg: any) => {
                clearTimeout(timer);
                const extractedResponse = extractFn(msg);
                if (extractedResponse) {
                  resolve(extractedResponse);
                } else {
                  reject(new Error(`Not valid response (response: ${JSON.stringify(msg)})`));
                }
              },
            },
          ]);
          ws.send(payload);
        } else {
          clearTimeout(timer);
          reject(new Error('No websocket connection'));
        }
      }),
    login: (req) => {
      if (req) {
        return get().request<{ result: 'success' | 'failure' }>({
          payload: createApiPayload({
            action: 'user',
            method: 'authenticate',
            params: req,
          }),
          extractFn: (response) => {
            if (response.result === 0) {
              storeLoginInfo(req);
              set({ status: 'authorized' });
              return { result: 'success', id: response.id };
            }
            return { result: 'failure', id: response.id };
          },
        });
      }
      const storedInformation = getStoredLoginInfo();
      if (storedInformation) {
        return get().request<{ result: 'success' | 'failure' }>({
          payload: createApiPayload({
            action: 'user',
            method: 'authenticate',
            params: {
              username: storedInformation.username,
              password: storedInformation.password,
            },
          }),
          extractFn: (response) => {
            if (response.result === 0) {
              set({ status: 'authorized' });
              return { result: 'success', id: response.id };
            }
            return { result: 'failure', id: response.id };
          },
        });
      }

      return Promise.resolve({ result: 'failure' });
    },
    logout: () => {
      // TODO: is there a logout action?
      removeStoredLoginInfo();
      get().ws.disconnect();
      set({ status: 'login-required' });
    },
    restart: () =>
      get().request({
        payload: createApiPayload({ action: 'system', method: 'reboot' }),
        extractFn: (response) => response?.result === 0,
      }),
    getConfigurationList: () =>
      get().request({
        payload: createApiPayload({ action: 'config', method: 'list' }),
        extractFn: (response) => {
          if (response?.active && response.configs) {
            return {
              active: response.active,
              configs: response.configs,
            };
          }

          return undefined;
        },
      }),
    getCurrentConfiguration: () =>
      get().request({
        payload: createApiPayload({ action: 'config', method: 'get' }),
        extractFn: (response) => response?.params?.config,
      }),
    getSystemInfo: () =>
      get().request({
        payload: createApiPayload({ action: 'system', method: 'info' }),
        extractFn: (response) => response?.params,
      }),
    getBoard: () =>
      get().request({
        payload: createApiPayload({ action: 'system', method: 'board' }),
        extractFn: (response) => response?.params,
      }),
    getPorts: () =>
      get().request({
        payload: createApiPayload({ action: 'get', method: 'ports' }),
        extractFn: (response) => response?.params,
      }),
    getClients: () =>
      get().request({
        payload: createApiPayload({ action: 'get', method: 'clients' }),
        extractFn: (response) => response?.params,
      }),
  } satisfies WebSocketStore;
});
