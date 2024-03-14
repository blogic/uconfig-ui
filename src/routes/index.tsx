import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    // If the user is logged out, redirect them to the login page
    if (!context.auth.isAuthenticated) {
      const res = await context.auth.loginWithStoredInformation();

      if (res === 'failure')
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
