import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { getClientsOptions } from 'api/queries/clients';
import { ClientDisplay } from 'components/ClientDisplay';

export const Clients = () => {
  const getClients = useSuspenseQuery(getClientsOptions);
  const navigate = useNavigate();

  const wifiClients = getClients.data.clientsArray.filter((client) => client.client.wifi);
  const lanClients = getClients.data.clientsArray.filter((client) => !client.client.wifi);
  const Clients = [...wifiClients, ...lanClients];

  return (
        <>
          <div className="flex items-center">
          </div>
          <div className="max-h-96 overflow-y-auto">
            {Clients.map(({ displayName, mac, client }, i) => (
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
                  i === Clients.length - 1 && 'rounded-t-none',
                  i !== 0 && i !== Clients.length - 1 && 'rounded-none',
                )}
              />
            ))}
          </div> 
        </>
  );
};
