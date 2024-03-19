import { queryOptions } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

const CONFIGURATIONS_QUERY_KEY = 'configurations';

export const getConfigurationsOptions = queryOptions({
  queryKey: [CONFIGURATIONS_QUERY_KEY, 'list'],
  queryFn: () => useWebSocketStore.getState().getConfigurationList(),
  staleTime: 1000 * 60,
});

export const getCurrentConfigurationOptions = queryOptions({
  queryKey: [CONFIGURATIONS_QUERY_KEY, 'current'],
  queryFn: () => useWebSocketStore.getState().getCurrentConfiguration(),
  staleTime: 1000 * 60,
});
