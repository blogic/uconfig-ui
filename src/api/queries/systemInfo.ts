import { queryOptions } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

const SYSTEM_INFO_QUERY_KEY = 'systemInfo';

export const getSystemInfoOptions = queryOptions({
  queryKey: [SYSTEM_INFO_QUERY_KEY, 'current'],
  queryFn: () => useWebSocketStore.getState().getSystemInfo(),
  staleTime: 1000 * 60,
});
