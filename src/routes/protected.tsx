import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { getBoardOptions } from 'api/queries/board';
import { getClientsOptions } from 'api/queries/clients';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { getSystemInfoOptions } from 'api/queries/systemInfo';
import { useWebSocketStore } from 'api/useWebSocketStore';
import { LanguageSelector } from 'components/LanguageSelector';
import { LogoutButton } from 'components/LogoutButton';
import { ThemeSelector } from 'components/ThemeSelector';
import { MainPageContainer } from 'layout/MainPageContainer';

const Component = () => (
  <>
    <div className="absolute left-4 top-4 z-50 flex">
      <img className="h-8 w-auto" src="/OpenWrt_Logo.png" alt="OpenWrt" />
    </div>
    <div className="absolute right-4 top-4 z-50 flex">
      <LanguageSelector />
      <ThemeSelector />
      <LogoutButton />
    </div>
    <MainPageContainer>
      <Outlet />
    </MainPageContainer>
  </>
);

export const Route = createFileRoute('/protected')({
  beforeLoad: async () => {
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
  },
  component: Component,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getCurrentConfigurationOptions),
      context.queryClient.ensureQueryData(getSystemInfoOptions),
      context.queryClient.ensureQueryData(getBoardOptions),
      context.queryClient.ensureQueryData(getClientsOptions),
    ]);
  },
});
