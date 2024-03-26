import { Gear, Globe, WifiHigh, UserList } from '@phosphor-icons/react';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { HomeSystemInfo } from './-index/HomeSystemInfo';
import { NavigationButton, NavigationButtonProps } from 'components/NavigationButton';
import { PinPadKey } from 'components/PinPadKey';
import { PinPad } from 'components/PinPad';

const Component = () => {
  const { t } = useTranslation('wireless');
  const { t: tNetwork } = useTranslation('network');
  const { t: tSystem } = useTranslation('system');
  const { t: tClients } = useTranslation('clients');

  const routes = [
    {
      label: tClients('title'),
      navigateOptions: { to: '/protected/clients/' },
      icon: <UserList className="block h-8 w-8" aria-hidden="true" />,
    },
    {
      label: tNetwork('title'),
      navigateOptions: { to: '/protected/network/' },
      icon: <Globe className="block h-8 w-8" aria-hidden="true" />,
    },
    {
      label: t('wireless'),
      navigateOptions: { to: '/protected/wireless/' },
      icon: <WifiHigh className="block h-8 w-8" aria-hidden="true" />,
    },
    {
      label: tSystem('title'),
      navigateOptions: { to: '/protected/system/' },
      icon: <Gear className="block h-8 w-8" aria-hidden="true" />,
    },
  ] as NavigationButtonProps[];

  /*<PinPadKey value={1} onClick={(value:number) => alert(value)}/>
      <PinPad/>*/
  return (
    <>
      <div className="space-y-4">
        <HomeSystemInfo />
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
