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
  const bands = Object.keys(currentConfiguration.band ?? {});

  const navigate = useNavigate();

  return (
    <>
      <PageTitleBar title={t('wireless')} />
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-200">{t('description')}</p>
      <div className="space-y-6">
        <div>
          {ssids.map((_ssid, i) => {
            let ssid = _ssid as 'main' | 'guest' | 'iot';
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
                    to: '/protected/wireless/ssid/$ssid',
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
        <div>
          {bands.map((_band, i) => {
            let band = _band as '2G' | '5G' | '6G';
            let className = 'rounded-none';
            if (i === 0)
              className = 'rounded-b-none';  
            else if (i === ssids.length - 1)
              className = 'rounded-t-none';

            return (
              <NavigationTile
                key={band}
                title={t(band)}
                description=''
                onClick={() => {
                  navigate({
                    to: '/protected/wireless/band/$band',
                    params: {
                      //ssid: {ssid},
                      band,
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
