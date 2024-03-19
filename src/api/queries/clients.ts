import { queryOptions } from '@tanstack/react-query';
import { Client } from 'api/types/clients.types';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const extractDisplayName = (mac: string, info: Client['info']) => {
  if (!info) return mac;
  if (info.device_name) return info.device_name;
  if (info?.device) return `${mac} - ${info.device}`;

  return `${mac}${info.vendor ? ` - ${info.vendor}` : ''}`;
};

const QUERY_KEY = 'clients';

export const getClientsOptions = queryOptions({
  queryKey: [QUERY_KEY, 'current'],
  queryFn: () => useWebSocketStore.getState().getClients(),
  select: (data) => ({
    clients: data,
    clientsArray: Object.entries(data)
      .map(([key, client]) => ({
        mac: key,
        client,
        displayName: extractDisplayName(key, client.info),
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName)),
  }),
  staleTime: 1000 * 60,
});
