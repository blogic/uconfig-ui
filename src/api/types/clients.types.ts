export type Client = {
  dev: string;
  info?: {
    device_name?: string;
    vendor?: string;
    device?: string;
    class?: string;
  };
  ipv4?: string[];
  ipv6?: string[];
  wifi?: {
    bytes: {
      rx: number;
      tx: number;
    };
    packets: {
      rx: number;
      tx: number;
    };
    signal: number;
  };
};

export type Clients = { [key: string]: Client };

export const DUMMY_CLIENTS: Clients = {
  '90:3c:b3:bb:1e:ef': {
    ipv4: ['192.168.178.6'],
    dev: 'wan',
  },
  'a0:ce:c8:e6:21:7d': {
    ipv4: ['192.168.178.126'],
    dev: 'wan',
    info: {
      device_name: 'Mac Studio',
    },
  },
  'ec:b5:fa:21:e9:6b': {
    ipv4: ['192.168.178.23'],
    dev: 'wan',
    info: {
      device_name: 'Hue Bridge - 21E96B',
      vendor: 'Philips',
      device: 'Hue',
    },
  },
  '90:3c:b3:bb:1f:3f': {
    ipv4: ['192.168.178.8'],
    dev: 'wan',
  },
  '3c:37:12:1d:ba:f4': {
    ipv4: ['192.168.178.1'],
    ipv6: ['2a04:4540:1402:c200:3e37:12ff:fe1d:baf4', 'fe80::3e37:12ff:fe1d:baf4'],
    dev: 'wan',
  },
  '90:3c:b3:bb:25:e3': {
    ipv4: ['192.168.178.7'],
    dev: 'wan',
  },
  'd4:57:63:d6:63:b7': {
    ipv4: ['192.168.178.42'],
    dev: 'wan',
    info: {
      device_name: 'blogic’s MacBook Air (2)',
      vendor: 'Apple',
      device: 'MacBook Air M1',
      class: 'laptop',
    },
  },
  '66:e9:21:84:04:49': {
    ipv4: ['192.168.178.112'],
    dev: 'wl1-ap0',
    wifi: {
      bytes: {
        rx: 70346,
        tx: 85266,
      },
      packets: {
        rx: 70346,
        tx: 85266,
      },
      signal: -34,
    },
    info: {
      vendor: 'Apple',
      device: 'iOS device',
    },
  },
  '1c:b3:c9:24:fd:01': {
    ipv4: ['192.168.178.59'],
    ipv6: ['fe80::ce7:d59b:1a69:6f7'],
    dev: 'wan',
    info: {
      device_name: 'Wohnzimmer (3)',
      vendor: 'Apple',
      device: 'Apple TV',
      class: 'tv',
    },
  },
  'c4:65:16:cd:61:44': {
    ipv4: ['192.168.178.136'],
    dev: 'wan',
  },
  'f4:34:f0:74:7c:53': {
    ipv6: ['fe80::45f:e096:3f7c:3aac'],
    dev: 'wan',
  },
  'c0:95:6d:61:be:62': {
    ipv6: ['fe80::14a1:9cf9:4e65:8027'],
    dev: 'wan',
  },
  '04:99:b9:94:06:9a': {
    ipv6: ['fe80::cc9:e31a:ee07:27d'],
    dev: 'wan',
    info: {
      device_name: 'Kitchen',
      vendor: 'Apple',
      device: 'HomePod mini',
      class: 'speaker',
    },
  },
};
