import * as React from 'react';
import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { WEBSOCKET_PENDING_ACTION_STATUSES, useWebSocketStore } from 'api/useWebSocketStore';

const Component = () => {
  const status = useWebSocketStore((state) => state.status);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!WEBSOCKET_PENDING_ACTION_STATUSES.includes(status)) {
      navigate({
        to: '/login',
        search: {
          redirect: '/protected/',
        },
      });
    }
  }, [status]);

  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:h-1/2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Outlet />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/actions')({
  component: Component,
});
