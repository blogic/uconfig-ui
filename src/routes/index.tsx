import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { useWebSocketStore } from 'api/useWebSocketStore';

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    // If the user is logged out, redirect them to the login page
    const { status, login } = useWebSocketStore.getState();

    if (status === 'setup-required') {
      throw redirect({
        to: '/setup',
      });
    }
    if (status !== 'authorized') {
      const res = await login();

      if (res.result === 'failure')
        throw redirect({
          to: '/login',
          search: {
            redirect: '/protected/',
          },
        });
    }

    throw redirect({
      to: '/protected/',
    });
  },
  component: Outlet,
});
