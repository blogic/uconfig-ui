export type IPv4Configuration =
  | {
      addressing: 'dynamic';
    }
  | {
      addressing: 'static';
      subnet: string;
      dns: string;
      gateway: string;
      dhcp?: {
        'lease-first': number;
        'lease-count': number;
        'lease-time': string;
      };
    };

export type IPv6Configuration =
  | {
      addressing: 'dynamic';
    }
  | {
      addressing: 'static';
      dhcpv6?: {
        mode: 'hybrid';
      };
    };

export type SSIDConfiguration = {
  ssid: string;
  'isolate-hosts'?: boolean;
  'disallow-upstream-subnet'?: boolean;
  'wifi-bands': ('2G' | '5G' | '6G')[];
  'bss-mode': 'ap' | 'mesh';
};

export type InterfaceConfiguration = {
  role: 'upstream' | 'downstream';
  services: ('mdns' | 'web-ui' | 'ssh')[];
  ports: {
    [key: string]: string;
  };
  ipv4: IPv4Configuration;
  ipv6: IPv6Configuration;
  ssids?: {
    [key: string]: SSIDConfiguration;
  };
};

export type UnitConfiguration = {
  'leds-active'?: boolean;
  location?: string;
  name?: string;
  timezone?: string;
};

export type Configuration = {
  uuid: string;
  interfaces: {
    [key: string]: InterfaceConfiguration;
  };
  services: {
    ssh?: {
      port: number;
    };
  };
  unit?: UnitConfiguration;
};