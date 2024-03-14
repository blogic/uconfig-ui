export type Port = {
  carrier: boolean;
  speed: string | null;
  tx_bytes: number;
  tx_packets: number;
  rx_bytes: number;
  rx_packets: number;
};

export type Ports = { [key: string]: Port };

export const DUMMY_PORTS: Ports = {
  lan1: {
    carrier: false,
    speed: null,
    tx_bytes: 0,
    tx_packets: 0,
    rx_bytes: 0,
    rx_packets: 0,
  },
  lan2: {
    carrier: false,
    speed: null,
    tx_bytes: 0,
    tx_packets: 0,
    rx_bytes: 0,
    rx_packets: 0,
  },
  lan3: {
    carrier: false,
    speed: null,
    tx_bytes: 0,
    tx_packets: 0,
    rx_bytes: 0,
    rx_packets: 0,
  },
  lan4: {
    carrier: true,
    speed: '1000F',
    tx_bytes: 156279,
    tx_packets: 1049,
    rx_bytes: 1732951,
    rx_packets: 18919,
  },
  wan: {
    carrier: true,
    speed: '1000F',
    tx_bytes: 3675869,
    tx_packets: 27039,
    rx_bytes: 71684397,
    rx_packets: 216025,
  },
};
