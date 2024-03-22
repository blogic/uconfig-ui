import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import clsx from 'clsx';
import { getClientsOptions } from 'api/queries/clients';
import { ClientDisplay } from 'components/ClientDisplay';

export const Clients = () => {
  const getClients = useSuspenseQuery(getClientsOptions);
  const navigate = useNavigate();

  const Clients = getClients.data.clientsArray.sort((a, b) => {
    function score(a: any) {
      let ret = 0;
      if (a.client?.wifi) ret += 2;
      if (a.client?.info) ret += 1;
      return ret;
    }
    let compare = score(b) - score(a);
    if (compare) return compare;
    return a.displayName.localeCompare(b.displayName);
  });

  return (
    <>
      <div className="flex items-center"></div>
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
