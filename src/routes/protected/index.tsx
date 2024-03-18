import { Gear, Globe, WifiHigh } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { HomeClients } from './-index/HomeClients';
import { HomeSystemInfo } from './-index/HomeSystemInfo';
import { NavigationButton, NavigationButtonProps } from 'components/NavigationButton';

const Component = () => {
  const { t } = useTranslation('wireless');
  const { t: tNetwork } = useTranslation('network');
  const { t: tSystem } = useTranslation('system');

  const routes: NavigationButtonProps[] = [
    {
      label: tNetwork('title'),
      navigateOptions: { to: '/protected/network/', search: {} },
      icon: <Globe className="block h-8 w-8" aria-hidden="true" />,
    },
    {
      label: t('wireless'),
      navigateOptions: { to: '/protected/wireless', search: {} },
      icon: <WifiHigh className="block h-8 w-8" aria-hidden="true" />,
    },
    {
      label: tSystem('title'),
      navigateOptions: { to: '/protected/system/', search: {} },
      icon: <Gear className="block h-8 w-8" aria-hidden="true" />,
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <HomeSystemInfo />
        <HomeClients />
      </div>
      <div className="mt-8 flex items-center justify-center space-x-8">
        {routes.map((route) => (
          <NavigationButton key={route.label} {...route} />
        ))}
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/')({
  component: Component,
});
