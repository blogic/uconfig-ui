import { createFileRoute, redirect } from '@tanstack/react-router';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const Route = createFileRoute('/logout')({
  beforeLoad: async () => {
    await useWebSocketStore.getState().logout();

    throw redirect({
      to: '/login',
      search: {
        redirect: '/protected/',
      },
    });
  },
});
