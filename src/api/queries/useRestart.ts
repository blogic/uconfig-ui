import { useMutation } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const useRestart = () => {
  const restart = useWebSocketStore((state) => state.restart);

  return useMutation({
    mutationFn: () => restart(),
  });
};
