export type Board = {
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

export const DUMMY_BOARD: Board = {
  localtime: 1709221055,
  uptime: 17321,
  load: [5760, 6080, 5312],
  memory: {
    total: 513511424,
    free: 417607680,
    shared: 409600,
    buffered: 4096,
    available: 413192192,
    cached: 33972224,
  },
};
