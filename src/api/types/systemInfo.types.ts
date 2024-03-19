export type SystemInfo = {
  /** UNIX timestamp */
  localtime: number;
  /** Uptime in seconds */
  uptime: number;
  load: [number, number, number];
  memory: {
    total: number;
    free: number;
    shared: number;
    buffered: number;
    available: number;
    cached: number;
  };
};
