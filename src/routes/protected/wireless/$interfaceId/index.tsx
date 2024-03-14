import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

export const Route = createFileRoute('/protected/wireless/$interfaceId/')({
  parseParams: (params) => ({
    interfaceId: z.string().parse(params.interfaceId),
  }),
  stringifyParams: ({ interfaceId }) => ({ interfaceId }),
});
