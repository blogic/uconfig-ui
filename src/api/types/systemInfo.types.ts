export type SystemInfo = {
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

export const DUMMY_SYSTEM_INFO: SystemInfo = {
  kernel: '6.1.77',
  hostname: 'c4411ef52d53',
  system: 'ARMv8 Processor rev 4',
  model: 'Linksys E8450 (UBI)',
  board_name: 'linksys,e8450-ubi',
  rootfs_type: 'squashfs',
  release: {
    distribution: 'OpenWrt',
    version: 'SNAPSHOT',
    revision: 'r25206+8-d5e2177a6b',
    target: 'mediatek/mt7622',
    description: 'OpenWrt SNAPSHOT r25206+8-d5e2177a6b',
  },
};
