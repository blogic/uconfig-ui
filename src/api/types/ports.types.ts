export type Port = {
  carrier: boolean;
  speed: string | null;
  tx_bytes: number;
  tx_packets: number;
  rx_bytes: number;
  rx_packets: number;
};

export type Ports = { [key: string]: Port };
