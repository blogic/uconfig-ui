import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { getSystemInfoOptions } from 'api/queries/systemInfo';
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
  beforeLoad: async ({ context }) => {
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
  },
  component: Component,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(getCurrentConfigurationOptions()),
      context.queryClient.ensureQueryData(getSystemInfoOptions()),
    ]);
  },
});
