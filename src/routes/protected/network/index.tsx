import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { NavigationTile } from 'components/NavigationTile';
import { PageTitleBar } from 'layout/PageTitleBar';
import { capitalizeFirstLetter } from 'utils/strings';

const Component = () => {
  const { t } = useTranslation('network');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions());
  const navigate = useNavigate();

  return (
    <>
      <PageTitleBar title={t('title')} />
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-200">{t('description')}</p>
      <div className="space-y-6">
        <NavigationTile
          title={t('services')}
          description={
            currentConfiguration.interfaces.wan?.services.length
              ? currentConfiguration.interfaces.wan.services.join(', ')
              : t('noServices')
          }
          onClick={() =>
            navigate({
              to: '/protected/network/services',
            })
          }
        />
        <div>
          <NavigationTile
            title={t('ipv4')}
            description={
              currentConfiguration.interfaces.wan?.ipv4.addressing
                ? capitalizeFirstLetter(t('dynamic'))
                : capitalizeFirstLetter(t('static'))
            }
            onClick={() => {
              navigate({
                to: '/protected/network/ipv4',
              });
            }}
            className="rounded-b-none"
          />
          <NavigationTile
            title={t('ipv6')}
            description={
              currentConfiguration.interfaces.wan?.ipv4.addressing
                ? capitalizeFirstLetter(t('dynamic'))
                : capitalizeFirstLetter(t('static'))
            }
            onClick={() => {
              navigate({
                to: '/protected/network/ipv6',
              });
            }}
            className="rounded-t-none"
          />
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/network/')({
  component: Component,
});
