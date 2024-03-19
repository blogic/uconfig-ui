import { queryOptions } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

const QUERY_KEY = 'ports';

export const getPortsOptions = queryOptions({
  queryKey: [QUERY_KEY, 'current'],
  queryFn: () => useWebSocketStore.getState().getPorts(),
  staleTime: 1000 * 60,
});
