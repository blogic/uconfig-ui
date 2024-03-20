import { useMutation } from '@tanstack/react-query';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const useFinishWizard = () => {
  const finishWizard = useWebSocketStore((state) => state.finishWizard);

  return useMutation({
    mutationFn: (config: Record<string, unknown>) => finishWizard(config),
  });
};
