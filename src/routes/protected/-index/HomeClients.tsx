import { Globe, WifiHigh } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { getClientsOptions } from 'api/queries/clients';
import { Accordion } from 'components/Accordion';
import { ClientDisplay } from 'components/ClientDisplay';
import { InformationTile } from 'components/InformationTile';
import { Text } from 'components/Text';

const ICON_CLASSES = 'h-5 w-5 - text-primary-500 dark:text-primary-200 ml-2 mr-1';

export const HomeClients = () => {
  const { t } = useTranslation('home');
  const getClients = useSuspenseQuery(getClientsOptions);
  const navigate = useNavigate();

  const wifiClients = getClients.data.clientsArray.filter((client) => client.client.wifi);
  const lanClients = getClients.data.clientsArray.filter((client) => !client.client.wifi);

  return (
    <InformationTile
      title={`${t('connections')} (${getClients.data.clientsArray.length})`}
      description={
        <Accordion
          defaultIndex={0}
          className="mt-2"
          entries={[
            {
              title: (
                <div className="flex items-center">
                  <span>CoolSSID</span>
                  <WifiHigh weight="bold" className={ICON_CLASSES} />
                  <Text variant="explanation">{wifiClients.length}</Text>
                </div>
              ),
              content: (
                <div className="max-h-96 overflow-y-auto">
                  {wifiClients.map(({ displayName, mac, client }, i) => (
                    <ClientDisplay
                      key={mac}
                      client={client}
                      displayName={displayName}
                      onClick={() =>
                        navigate({
                          to: '/protected/clients/$macAddress',
                          params: { macAddress: mac },
                        })
                      }
                      className={clsx(
                        i === 0 && 'rounded-b-none',
                        i === wifiClients.length - 1 && 'rounded-t-none',
                        i !== 0 && i !== wifiClients.length - 1 && 'rounded-none',
                      )}
                    />
                  ))}
                </div>
              ),
            },
            {
              title: (
                <div className="flex items-center">
                  <span>LAN</span>
                  <Globe weight="fill" className={ICON_CLASSES} />
                  <Text variant="explanation">{lanClients.length}</Text>
                </div>
              ),
              content: (
                <div className="max-h-96 overflow-y-auto">
                  {lanClients.map(({ displayName, mac, client }, i) => (
                    <ClientDisplay
                      key={mac}
                      client={client}
                      displayName={displayName}
                      onClick={() =>
                        navigate({
                          to: '/protected/clients/$macAddress',
                          params: { macAddress: mac },
                        })
                      }
                      className={clsx(
                        i === 0 && 'rounded-b-none',
                        i === lanClients.length - 1 && 'rounded-t-none',
                        i !== 0 && i !== lanClients.length - 1 && 'rounded-none',
                      )}
                    />
                  ))}
                </div>
              ),
            },
          ]}
        />
      }
    />
  );
};
