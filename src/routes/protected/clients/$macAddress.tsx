import * as React from 'react';
import { ArrowFatDown, ArrowFatUp, WifiHigh, WifiLow, WifiMedium, XCircle } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { extractDisplayName, getClientsOptions } from 'api/queries/clients';
import { Client } from 'api/types/clients.types';
import { Heading } from 'components/Heading';
import { InformationTile } from 'components/InformationTile';
import { NavigationTile } from 'components/NavigationTile';
import { Tooltip } from 'components/Tooltip';
import { PageTitleBar } from 'layout/PageTitleBar';
import { byteToString } from 'utils/strings';
import { ClientIcon } from 'components/ClientIcon';

const ICON_CLASSES = 'h-5 w-5 mr-2';

const dataDisplay = (t: TFunction<'common'>, wifi: Client['wifi']) => {
  if (!wifi?.bytes) return null;

  return (
    <>
      <Tooltip label={t('download')}>
        <p className="flex items-center font-light dark:text-white">
          <ArrowFatDown weight="duotone" className=" mr-1 text-tertiary-400 dark:text-tertiary-500" />
          {byteToString(wifi.bytes.rx)}
        </p>
      </Tooltip>
      <Tooltip label={t('upload')}>
        <p className="flex items-center font-light dark:text-white">
          <ArrowFatUp weight="duotone" className="mr-1 text-secondary-400 dark:text-secondary-500" />
          {byteToString(wifi.bytes.tx)}
        </p>
      </Tooltip>
    </>
  );
};

const signalToStrength = (signal: number, t: TFunction<'client'>) => {
  if (signal > -50) {
    return t('excellent');
  }

  if (signal > -90) return t('good');

  return t('weak');
};

const Component = () => {
  const { t } = useTranslation('client');
  const { t: tCommon } = useTranslation('common');
  const client = Route.useLoaderData();
  const { macAddress } = Route.useParams();
  const name = extractDisplayName(macAddress, client.info);

  const ipAddresses = [...(client.ipv4 || []), ...(client.ipv6 || [])];
  const deviceDetails = [];
  if (client.info?.device) {
    deviceDetails.push(client.info.device);
  }
  if (client.info?.vendor) {
    deviceDetails.push(client.info.vendor);
  }
  if (client.info?.class) {
    deviceDetails.push(client.info.class);
  }

  const wifiConnectionIcon = React.useMemo(() => {
    if (!client.wifi) return undefined;

    if (client.wifi.signal > -50) {
      return <WifiHigh weight="bold" className={clsx(ICON_CLASSES, 'text-success-500 dark:text-success-200')} />;
    }

    if (client.wifi.signal > -90)
      return <WifiMedium className={clsx(ICON_CLASSES, 'text-warning-500 dark:text-warning-200')} />;

    return <WifiLow className={clsx(ICON_CLASSES, 'text-danger-500 dark:text-danger-200')} />;
  }, [client.wifi]);

  return (
    <>
      <PageTitleBar
        title={
          <div className="flex items-center justify-center">
            {wifiConnectionIcon ?? (
              <ClientIcon
                info={client.info}
                className={clsx(ICON_CLASSES, 'text-primary-500 dark:text-primary-200')}
              />
            )}
            <Heading size="md">{name}</Heading>
          </div>
        }
      />
      <div className="space-y-4">
        {client.wifi ? (
          <div>
            <InformationTile
              title={tCommon('data')}
              description={<div className="flex space-x-4">{dataDisplay(tCommon, client.wifi)}</div>}
              className={client.wifi ? 'rounded-b-none' : ''}
            />
            <InformationTile
              title={
                <div className="flex items-center">
                  <h2 className="mr-1 font-bold dark:text-white">{t('signalStrength')}</h2>
                  {wifiConnectionIcon}
                </div>
              }
              description={`${client.wifi.signal} dBm (${signalToStrength(client.wifi.signal, t)})`}
              className="rounded-t-none"
            />
          </div>
        ) : null}

        {deviceDetails.length > 0 ? (
          <InformationTile
            title={t('deviceDetails')}
            description={deviceDetails.length > 0 ? deviceDetails.join(', ') : t('noDeviceDetails')}
          />
        ): null}
        <div>
          <InformationTile
            title={t('ip', { count: ipAddresses.length })}
            description={ipAddresses.join(', ')}
            className="rounded-b-none"
          />
          <InformationTile
            title={t('macAddress')}
            description={macAddress}
            className="rounded-t-none"
          />
        </div>
        <NavigationTile
          title={
            <div className="flex items-center">
              <Heading size="md">{t('blockClient')}</Heading>
              <XCircle className="ml-1 h-6 w-6 text-danger-500 dark:text-danger-300" weight="fill" />
            </div>
          }
          description={t('blockClientDescription')}
          // TODO: Implement action, either navigate to block page or show a modal
          onClick={() => {}}
        />
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/clients/$macAddress')({
  parseParams: (params) => ({
    macAddress: z.string().parse(params.macAddress),
  }),
  stringifyParams: ({ macAddress }) => ({ macAddress }),
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(getClientsOptions);
    const currentClient = data[params.macAddress];
    if (!currentClient) {
      throw new Error('Client not found');
    }

    return currentClient;
  },
  component: Component,
});
