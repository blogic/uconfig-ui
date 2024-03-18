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
  createSelectors,
  getStoredLoginInfo,
  isValidWebSocketMessage,
  storeLoginInfo,
} from './webSocketUtils';
import ReconnectingWebSocket from 'api/ReconnectingWebSocket';

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

export type WebSocketApiStatus = 'connecting' | 'connected' | 'login' | 'first-wizard' | 'authorized' | 'error';

export type WebSocketStore = {
  status: WebSocketApiStatus;
  configuration?: object;
  eventListeners: WebSocketCallback[];
  addEventListeners: (callback: WebSocketCallback[]) => void;
  get: <T>(
    payload: {
      id: number;
      action: string | WebSocketCallback['action'];
    } & object,
    extractFn: (response: any) => T | undefined,
    timeout?: number,
  ) => Promise<T>;

  login: (req: { username: string; password: string }) => Promise<{ result: 'success' | 'failure' }>;
  restart: (timeout?: number) => Promise<true | false>;

  getConfigurationList: (timeout?: number) => Promise<{ configs: string[]; active: string }>;
  getCurrentConfiguration: (timeout?: number) => Promise<Configuration>;
  getSystemInfo: (timeout?: number) => Promise<SystemInfo>;
  getBoard: (timeout?: number) => Promise<Board>;
  getPorts: (timeout?: number) => Promise<Ports>;
  getClients: (timeout?: number) => Promise<Clients>;
};

export const useWebSocketStoreBase = create<WebSocketStore>((set, get) => {
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
      // TODO: handle error
      // console.error(e);
    }
  };

  ws.onclose = () => {
    set({ status: 'error' });
  };

  ws.onerror = () => {
    set({ status: 'error' });
  };

  return {
    status: 'connecting',
    eventListeners: [],
    addEventListeners: (events: WebSocketCallback[]) => {
      set((state) => ({
        eventListeners: [...state.eventListeners, ...events],
      }));
    },
    get: async <T>(
      payload: {
        id: number;
        action: string | WebSocketCallback['action'];
      } & object,
      extractFn: (response: any) => T | undefined,
      timeout = 5 * 1000,
    ): Promise<T> =>
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
    login: async ({ username, password }) =>
      get().get<{ result: 'success' | 'failure' }>(
        WebSocketApiActions.user.login.getPayload(username, password),
        (response) => {
          if (response?.result === 'success') {
            storeLoginInfo({ username, password });
          }
          return { result: response?.result };
        },
      ),
    restart: async () =>
      get().get(WebSocketApiActions.system.restart.getPayload(), (response) => response?.result || false),
    getConfigurationList: async () =>
      get().get(WebSocketApiActions.config.getListPayload(), (response) => {
        if (response?.active && response.configs) {
          return {
            active: response.active,
            configs: response.configs,
          };
        }

        return undefined;
      }) as Promise<{
        configs: string[];
        active: string;
      }>,
    getCurrentConfiguration: async (timeout = 1000 * 5): Promise<Configuration> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.config.getCurrentPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'config',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.config) {
                  resolve(msg.config);
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

    getSystemInfo: async () =>
      get().get(
        WebSocketApiActions.system.getSystemInfo.getPayload(),
        (response) => response?.info,
      ) as Promise<SystemInfo>,

    getBoard: async () =>
      get().get(WebSocketApiActions.system.getBoard.getPayload(), (response) => response?.board) as Promise<Board>,

    getPorts: async () =>
      get().get(WebSocketApiActions.system.getPorts.getPayload(), (response) => response?.ports) as Promise<Ports>,

    getClients: async (timeout = 1000 * 5): Promise<Clients> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          resolve(DUMMY_CLIENTS);
          // const payload = WebSocketApiActions.system.getClients.getPayload();
          // get().addEventListeners([
          //   {
          //     id: payload.id,
          //     action: 'system',
          //     callback: (msg) => {
          //       clearTimeout(timer);
          //       if (msg?.clients) {
          //         resolve(msg.clients);
          //       } else {
          //         reject(new Error('Not valid response'));
          //       }
          //     },
          //   },
          // ]);
          // ws.send(payload);
        } else {
          clearTimeout(timer);
          reject(new Error('No websocket connection'));
        }
      }),
  } satisfies WebSocketStore;
});

export const useWebSocketStore = createSelectors(useWebSocketStoreBase);
