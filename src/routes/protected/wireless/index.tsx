import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { NavigationTile } from 'components/NavigationTile';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('wireless');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);

  const ssids = Object.keys(currentConfiguration.interfaces.wan?.ssids ?? {});

  const navigate = useNavigate();

  return (
    <>
      <PageTitleBar title={t('wireless')} />
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-200">{t('description')}</p>
      <div className="space-y-6">
        <div>
          <NavigationTile
            title="AOW_Public"
            description="2G, 5G"
            onClick={() =>
              navigate({
                to: '/protected/wireless/$interfaceId/$ssid',
                params: {
                  interfaceId: 'wan',
                  ssid: 'AOW_Public',
                },
              })
            }
            className="rounded-b-none"
          />
          <NavigationTile
            title="AOW_Private"
            description="2G, 5G"
            onClick={() =>
              navigate({
                to: '/protected/wireless/$interfaceId/$ssid',
                params: {
                  interfaceId: 'wan',
                  ssid: 'AOW_Private',
                },
              })
            }
            className="rounded-none"
          />
          <NavigationTile
            title="CoolHouse (Guest)"
            description="2G"
            onClick={() => {
              navigate({
                to: '/protected/wireless/$interfaceId/$ssid',
                params: {
                  interfaceId: 'wan',
                  ssid: 'CoolHouse (Guest)',
                },
              });
            }}
            className="rounded-t-none"
          />
          {ssids.map((ssid, i) => {
            if (i === 0)
              return (
                <NavigationTile key={ssid} title={ssid} description="" onClick={() => {}} className="rounded-b-none" />
              );

            if (i === ssids.length - 1)
              return (
                <NavigationTile key={ssid} title={ssid} description="" onClick={() => {}} className="rounded-t-none" />
              );

            return (
              <NavigationTile key={ssid} title={ssid} description="" onClick={() => {}} className="rounded-none" />
            );
          })}
        </div>
        <div>
          <NavigationTile
            title={t('createNew')}
            description=""
            onClick={() =>
              navigate({
                to: '/protected/wireless/newSsid',
              })
            }
            className="rounded-b-none"
          />
          <NavigationTile title={t('createNewGuest')} description="" onClick={() => {}} className="rounded-t-none" />
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/wireless/')({
  component: Component,
});
