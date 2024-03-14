import { queryOptions } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

const QUERY_KEY = 'board';

export const getBoardOptions = () =>
  queryOptions({
    queryKey: [QUERY_KEY, 'current'],
    queryFn: () => useWebSocketStore.getState().getBoard(),
    staleTime: 1000 * 60,
  });
