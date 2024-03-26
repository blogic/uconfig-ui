export type bandCapabilities = {
  channels: Array<string>;
  version: number;
};

export type Capabilities = {
  band: {
    [key: string]: bandCapabilities;
  }
};
