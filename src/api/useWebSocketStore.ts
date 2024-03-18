import { create } from 'zustand';
import { Board } from './types/board.types';
import { Clients, DUMMY_CLIENTS } from './types/clients.types';
import { Configuration } from './types/configurations.types';
import { Ports } from './types/ports.types';
import { SystemInfo } from './types/systemInfo.types';
import {
  WebSocketApiActions,
  WebSocketCallback,
  WebSocketConfigCallback,
  WebSocketEventCallback,
  WebSocketSystemCallback,
  WebSocketUserCallback,
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
      const response = WebSocketApiActions.config.handleResponse(parsedMessage);
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'config' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach((callback) => {
        (callback as WebSocketConfigCallback).callback(response);
      });

      return callbacksToFire;
    }
    case 'event': {
      const response = WebSocketApiActions.event.handleResponse(parsedMessage);
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'event' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach((callback) => {
        (callback as WebSocketEventCallback).callback(response);
      });

      return callbacksToFire;
    }
    case 'user': {
      const response = WebSocketApiActions.user.handleResponse(parsedMessage);
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'user' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach((callback) => {
        (callback as WebSocketUserCallback).callback(response);
      });

      return callbacksToFire;
    }
    case 'system': {
      const response = WebSocketApiActions.system.handleResponse(parsedMessage);
      const callbacksToFire = callbacks.filter(
        (callback) => callback.action === 'system' && callback.id === parsedMessage.id,
      );

      callbacksToFire.forEach((callback) => {
        (callback as WebSocketSystemCallback).callback(response);
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
                  reject(new Error('Not valid response'));
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
          payload: WebSocketApiActions.user.login.getPayload(req.username, req.password),
          extractFn: (response) => {
            if (response?.result === 'success') {
              storeLoginInfo(req);
            }
            return { result: response?.result };
          },
        });
      }
      const storedInformation = getStoredLoginInfo();
      if (storedInformation) {
        return get().request<{ result: 'success' | 'failure' }>({
          payload: WebSocketApiActions.user.login.getPayload(storedInformation.username, storedInformation.password),
          extractFn: (response) => ({ result: response?.result }),
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
        payload: WebSocketApiActions.system.restart.getPayload(),
        extractFn: (response) => response?.result || false,
      }),
    getConfigurationList: () =>
      get().request({
        payload: WebSocketApiActions.config.getListPayload(),
        extractFn: (response) => {
          if (response?.active && response.configs) {
            return {
              active: response.active,
              configs: response.configs,
            };
          }

          return undefined;
        },
      }) as Promise<{
        configs: string[];
        active: string;
      }>,
    getCurrentConfiguration: () =>
      get().request({
        payload: WebSocketApiActions.config.getCurrentPayload(),
        extractFn: (response) => response?.config,
      }),
    getSystemInfo: () =>
      get().request({
        payload: WebSocketApiActions.system.getSystemInfo.getPayload(),
        extractFn: (response) => response?.info,
      }),
    getBoard: () =>
      get().request({
        payload: WebSocketApiActions.system.getBoard.getPayload(),
        extractFn: (response) => response?.board,
      }),

    getPorts: () =>
      get().request({
        payload: WebSocketApiActions.system.getPorts.getPayload(),
        extractFn: (response) => response?.ports,
      }),
    getClients: () =>
      get().request({
        payload: WebSocketApiActions.system.getClients.getPayload(),
        extractFn: () =>
          // TODO: return real clients
          DUMMY_CLIENTS,
      }),
  } satisfies WebSocketStore;
});
