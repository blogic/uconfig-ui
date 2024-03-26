import { queryOptions } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

const QUERY_KEY = 'capabilities';

export const getCapabilities = queryOptions({
  queryKey: [QUERY_KEY, 'current'],
  queryFn: () => useWebSocketStore.getState().getCapabilities(),
  staleTime: 1000 * 60,
});
