import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { UseAuthReturn } from 'contexts/AuthContext/AuthContext';

const RootComponent = () => (
  <div className="h-full">
    <Outlet />
  </div>
);

export const Route = createRootRouteWithContext<{
  auth: UseAuthReturn;
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});
