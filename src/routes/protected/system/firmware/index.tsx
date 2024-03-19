import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { InformationTile } from 'components/InformationTile';
import { NavigationTile } from 'components/NavigationTile';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const navigate = useNavigate();
  const getInfo = useSuspenseQuery(getBoardOptions);

  return (
    <>
      <PageTitleBar title={t('firmware')} />
      <div className="space-y-4">
        <div>
          <InformationTile
            title={t('version')}
            description={getInfo.data.release.description}
            className="rounded-b-none"
          />
          <InformationTile title={t('target')} description={getInfo.data.release.target} className="rounded-t-none" />
        </div>
        <NavigationTile
          title={t('upgrade')}
          description=""
          onClick={() => {
            navigate({
              from: Route.fullPath,
              to: './upgrade',
            });
          }}
        />
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/system/firmware/')({
  component: Component,
});
