export type IPv4Configuration =
  | {
      addressing: 'dynamic';
    }
  | {
      addressing: 'static';
      subnet: string;
      dns: string;
      gateway: string;
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

export type DeviceConfiguration = {
  'leds-active'?: boolean;
  hostname?: string;
  timezone?: string;
};

export type WiFiConfiguration = {
  enable?: 'enable' | 'disable';
  ssid: string;
  security: 'max' | 'compat';
  password: string;
  band: Array<'2G' | '5G' | '6G'>;
};

export type Configuration = {
  /* old */
  uuid: string;
  interfaces: {
    [key: string]: InterfaceConfiguration;
  };
  services: {
    ssh?: {
      port: number;
    };
  };
  /* new */
  device: DeviceConfiguration;
  wan: {
    ipv4: IPv4Configuration;
  }
  wifi: {
    [key: string]: WiFiConfiguration;
  }
};
