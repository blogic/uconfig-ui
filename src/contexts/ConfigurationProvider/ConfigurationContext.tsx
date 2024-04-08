import * as React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { Configuration } from 'api/types/configurations.types';

export type ConfigurationChange = {
  explanation: string;
  data: Partial<Configuration>;
};

export type UseConfigurationReturn = {
  /** Real configuration currently used on device */
  deviceConfiguration: Configuration;
  /** Temporary configuration, ready to be pushed to the device */
  temporaryConfiguration: Configuration;
  /** Tracking all changes made to the temporary configuration */
  changes: ConfigurationChange[];
  updateTemporaryConfiguration: (change: ConfigurationChange) => void;
  resetTemporaryConfiguration: () => void;
  pushConfigurationToDevice: () => Promise<void>;
};

export const ConfigurationContext = React.createContext<UseConfigurationReturn | null>(null);

export const ConfigurationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: deviceConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);
  const [temporaryConfiguration, setTemporaryConfiguration] = React.useState<Configuration>(deviceConfiguration);
  const [changes, setChanges] = React.useState<ConfigurationChange[]>([]);

  const updateTemporaryConfiguration: UseConfigurationReturn['updateTemporaryConfiguration'] = (change) => {
    setTemporaryConfiguration((prev) => ({ ...prev, ...change.data }));
    setChanges((prev) => [...prev, change]);
  };

  const resetTemporaryConfiguration = () => {
    setTemporaryConfiguration(deviceConfiguration);
    setChanges([]);
  };

  // TODO: implement this function
  const pushConfigurationToDevice = async () => {
    // ...
  };

  // TODO: decide how to handle updating the temporary configuration when deviceConfiguration changes
  React.useEffect(() => {
    setTemporaryConfiguration(deviceConfiguration);
  }, [deviceConfiguration]);

  const value: UseConfigurationReturn = React.useMemo(
    () => ({
      deviceConfiguration,
      temporaryConfiguration,
      updateTemporaryConfiguration,
      resetTemporaryConfiguration,
      pushConfigurationToDevice,
      changes,
    }),
    [deviceConfiguration, temporaryConfiguration],
  );

  return <ConfigurationContext.Provider value={value}>{children}</ConfigurationContext.Provider>;
};
