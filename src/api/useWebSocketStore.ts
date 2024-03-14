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
  login: (req: { username: string; password: string; timeout?: number }) => Promise<{ result: 'success' | 'failure' }>;
  addEventListeners: (callback: WebSocketCallback[]) => void;
  getConfigurationList: (timeout?: number) => Promise<{ configs: string[]; active: string }>;
  getCurrentConfiguration: (timeout?: number) => Promise<Configuration>;
  getSystemInfo: (timeout?: number) => Promise<SystemInfo>;
  getBoard: (timeout?: number) => Promise<Board>;
  getPorts: (timeout?: number) => Promise<Ports>;
  getClients: (timeout?: number) => Promise<Clients>;
  restart: (timeout?: number) => Promise<'success' | 'failure'>;
};

export const useWebSocketStoreBase = create<WebSocketStore>((set, get) => {
  const ws = new ReconnectingWebSocket({ url: import.meta.env.VITE_WS_URL });

  ws.onopen = () => {
    set({
      status: 'connected',
    });

    const storedInformation = getStoredLoginInfo();

    if (storedInformation) {
      get().login(storedInformation);
    }
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
    set({
      status: 'error',
    });
  };
  ws.onerror = () => {
    set({
      status: 'error',
    });
  };

  return {
    status: 'connecting',
    eventListeners: [],
    addEventListeners: (events: WebSocketCallback[]) => {
      set((state) => ({
        eventListeners: [...state.eventListeners, ...events],
      }));
    },
    login: async ({ username, password, timeout = 1000 * 5 }) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.user.login.getPayload(username, password);
          get().addEventListeners([
            {
              id: payload.id,
              action: 'user',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.result === 'success') {
                  resolve({ result: 'success' });
                  storeLoginInfo({ username, password });
                } else if (msg?.result === 'failure') {
                  resolve({ result: 'failure' });
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
    getConfigurationList: async (
      timeout = 1000 * 5,
    ): Promise<{
      configs: string[];
      active: string;
    }> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.config.getListPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'config',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.active && msg.configs) {
                  resolve({
                    active: msg.active,
                    configs: msg.configs,
                  });
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
    getSystemInfo: async (timeout = 1000 * 5): Promise<SystemInfo> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.system.getSystemInfo.getPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'system',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.info) {
                  resolve(msg.info);
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
    getBoard: async (timeout = 1000 * 5): Promise<Board> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.system.getBoard.getPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'system',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.board) {
                  resolve(msg.board);
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
    getPorts: async (timeout = 1000 * 5): Promise<Ports> =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.system.getPorts.getPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'system',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.ports) {
                  resolve(msg.ports);
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
    restart: async (timeout = 1000 * 5) =>
      new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          reject(new Error(`Promise timed out after ${timeout} ms`));
        }, timeout);
        if (ws) {
          const payload = WebSocketApiActions.system.restart.getPayload();
          get().addEventListeners([
            {
              id: payload.id,
              action: 'system',
              callback: (msg) => {
                clearTimeout(timer);
                if (msg?.result) {
                  resolve(msg.result);
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
  };
});

export const useWebSocketStore = createSelectors(useWebSocketStoreBase);
