import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { NavigationTile } from 'components/NavigationTile';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('wireless');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);

  const ssids = Object.keys(currentConfiguration.wifi ?? {});

  const navigate = useNavigate();

  return (
    <>
      <PageTitleBar title={t('wireless')} />
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-200">{t('description')}</p>
      <div className="space-y-6">
        <div>
          {ssids.map((ssid, i) => {
            let className = 'rounded-none';
            if (i === 0)
              className = 'rounded-b-none';  
            else if (i === ssids.length - 1)
              className = 'rounded-t-none';

            return (
              <NavigationTile
                key={ssid}
                title={t(ssid)}
                description={currentConfiguration.wifi?.[ssid]?.ssid || ''}
                onClick={() => {
                  navigate({
                    to: '/protected/wireless/$ssid',
                    params: {
                      //ssid: {ssid},
                      ssid,
                    },
                  });
                }}
                className={className} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/wireless/')({
  component: Component,
});
