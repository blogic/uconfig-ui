import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext, useNavigate } from '@tanstack/react-router';
import { useWebSocketStore } from 'api/useWebSocketStore';

const RootComponent = () => {
  const status = useWebSocketStore((state) => state.status);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (status === 're-configuring') {
      navigate({
        to: '/actions/configuring',
      });
    }
  }, [status]);

  return (
    <div className="h-full">
      <Outlet />
    </div>
  );
};

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});
