import * as React from 'react';
import { QueryClient } from '@tanstack/react-query';
import { NavigateOptions, Outlet, createRootRouteWithContext, useNavigate } from '@tanstack/react-router';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { Spinner } from 'components/Spinner';

const RootComponent = () => {
  const status = useWebSocketStore((state) => state.status);
  const navigate = useNavigate();
  const [loaded, setLoaded] = React.useState(false);

  const navigateTo = async (options: NavigateOptions) =>
    navigate(options).then(() => {
      setTimeout(() => {
        setLoaded(true);
      }, 1000);
    });

  React.useEffect(() => {
    switch (status) {
      case 'connected':
      case 'connecting':
        navigateTo({
          to: '/actions/connecting',
        });
        break;
      case 're-configuring':
        navigateTo({
          to: '/actions/configuring',
        });
        break;
      case 'login-required':
        navigateTo({
          to: '/login',
          search: {
            redirect: '/protected/',
          },
        });
        break;
      case 'setup-required':
        navigateTo({
          to: '/setup',
        });
        break;
      case 'authorized':
        navigateTo({
          to: '/protected/',
        });
        break;
      default:
        break;
    }
  }, [status]);

  if (!loaded)
    return (
      <div className="flex flex-1 flex-col justify-center px-6 py-12 text-center sm:h-1/2 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
        </div>
        <Spinner size="lg" className="mx-auto mt-4" />
      </div>
    );

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
  pendingComponent: () => (
    <div className="flex flex-1 flex-col justify-center px-6 py-12 text-center sm:h-1/2 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img className="mx-auto h-20 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
      </div>
      <Spinner size="lg" className="mx-auto mt-4" />
    </div>
  ),
});
