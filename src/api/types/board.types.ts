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
