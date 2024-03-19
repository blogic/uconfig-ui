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
