import { useQueryClient } from '@tanstack/react-query';
import { ErrorComponent, RouterProvider, createRouter } from '@tanstack/react-router';
import { Spinner } from 'components/Spinner';
import { routeTree } from 'routeTree.gen.ts';

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className="flex h-full w-full content-center items-center justify-center text-center">
      <Spinner size="lg" />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App = () => {
  const queryClient = useQueryClient();

  return (
    <RouterProvider
      router={router}
      defaultPreload="intent"
      defaultPendingMs={1000}
      defaultPendingMinMs={500}
      context={{
        queryClient,
      }}
    />
  );
};

export default App;
