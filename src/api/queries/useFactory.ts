import { useMutation } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const useFactory = () => {
  const factory = useWebSocketStore((state) => state.factory);

  return useMutation({
    mutationFn: () => factory(),
  });
};
