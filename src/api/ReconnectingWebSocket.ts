import { WebSocketApiActions } from './webSocketUtils';

const CONNECTION_TIMEOUT = 10 * 1000;
const PING_INTERVAL = 10 * 1000;
const RECONNECT_INTERVAL = 1000 * 5;
const QUEUE_MAX_SIZE = 100;

export type ReconnectingWebSocketOptions = {
  url: string;
};

export default class ReconnectingWebSocket {
  private _webSocket?: WebSocket;

  private readonly _url: string;

  private _reconnectInterval: NodeJS.Timeout | undefined = undefined;

  private _pingInterval: NodeJS.Timeout | undefined = undefined;

  private _totalTries: number = 0;

  private _lockReconnect = false;

  private _lockConnect: boolean = false;

  private _queue: { timestamp: number; data: object }[] = [];

  constructor(options: ReconnectingWebSocketOptions) {
    this._url = options.url;

    this._connect();
  }

  public onopen: ((event: Event) => void) | null = null;

  public onmessage: ((event: MessageEvent) => void) | null = null;

  public onclose: ((event: CloseEvent) => void) | null = null;

  public onerror: ((event: ErrorEvent) => void) | null = null;

  get client() {
    return this._webSocket;
  }

  get readyState(): number | undefined {
    return this._webSocket?.readyState;
  }

  public send(data: object) {
    if (this._webSocket && this._webSocket.readyState === 1) {
      this._webSocket.send(JSON.stringify(data));
    } else {
      if (this._queue.length >= QUEUE_MAX_SIZE) {
        this._queue.shift();
      }
      this._queue.push({ timestamp: Date.now(), data });
    }
  }

  public disconnect = () => {
    this._disconnect();
  };

  private _connect = () => {
    if (!this._lockConnect) {
      this._totalTries += 1;
      this._lockConnect = true;

      this._webSocket = new WebSocket(this._url, 'config');

      this._addEventListeners();

      setTimeout(() => {
        if (this._webSocket?.readyState === 0 && !this._lockReconnect) {
          clearInterval(this._reconnectInterval);
          clearInterval(this._pingInterval);
        }
      }, CONNECTION_TIMEOUT);

      this._pingInterval = setInterval(() => {
        if (this._webSocket?.readyState === 1) {
          this._webSocket?.send(JSON.stringify(WebSocketApiActions.event.ping.getPayload()));
        }
      }, PING_INTERVAL);
    }
  };

  private _reconnect = () => {
    this._lockConnect = false;
    this._reconnectInterval = setInterval(() => {
      this._connect();
    }, RECONNECT_INTERVAL);
  };

  private _disconnect(code = 1000, reason?: string) {
    if (!this._webSocket) {
      return;
    }
    this._webSocket.close(code, reason);
    this._onclose(new CloseEvent(code.toString()));
  }

  private _onopen = (event: Event) => {
    this._lockConnect = false;
    this._lockReconnect = false;
    this._totalTries = 0;

    clearInterval(this._reconnectInterval);

    if (this._queue.length) {
      const queue = this._queue.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
      queue.forEach((m) => {
        this.send(m.data);
      });
      this._queue = [];
    }

    if (this.onopen) {
      this.onopen(event);
    }
  };

  private _onclose = (event: CloseEvent) => {
    this._lockConnect = false;
    if (this.onclose) {
      this.onclose(event);
    }
    if (!this._lockReconnect && this._webSocket?.readyState === 3) {
      this._lockReconnect = true;
      this._reconnect();
    }
  };

  private _onmessage = (event: MessageEvent) => {
    if (this.onmessage) {
      this.onmessage(event);
    }
  };

  private _onerror = (event: Event) => {
    this._lockConnect = false;
    this._disconnect(undefined, (event as ErrorEvent).message);

    if (!this._lockReconnect && this._webSocket?.readyState === 3) {
      this._lockReconnect = true;
      this._reconnect();
    }
    if (this.onerror) {
      this.onerror(event as ErrorEvent);
    }
  };

  private _addEventListeners() {
    if (!this._webSocket) {
      return;
    }
    this._webSocket.addEventListener('open', this._onopen);
    this._webSocket.addEventListener('close', this._onclose);
    this._webSocket.addEventListener('message', this._onmessage);
    this._webSocket.addEventListener('error', this._onerror);
  }
}
