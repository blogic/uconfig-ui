export type Board = {
  kernel: string;
  /** Serial Number */
  hostname: string;
  /** CPU */
  system: string;
  model: string;
  board_name: string;
  rootfs_type: string;
  release: {
    distribution: string;
    version: string;
    revision: string;
    target: string;
    description: string;
  };
};

/*export const DUMMY_BOARD: Board = {
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
};*/
