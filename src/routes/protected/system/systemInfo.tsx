import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { InformationTile } from 'components/InformationTile';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const getInfo = useSuspenseQuery(getBoardOptions());

  return (
    <>
      <PageTitleBar title={t('boardInfo')} />
      <div className="space-y-4">
        <InformationTile title={t('hostname')} description={getInfo.data.hostname} />
        <div>
          <InformationTile title={t('model')} description={getInfo.data.model} className="rounded-b-none" />
          <InformationTile title={t('processor')} description={getInfo.data.system} className="rounded-none" />
          <InformationTile title={t('kernel')} description={getInfo.data.kernel} className="rounded-t-none" />
        </div>
      </div>
    </>
  );
};
export const Route = createFileRoute('/protected/system/systemInfo')({
  component: Component,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(getBoardOptions());
  },
});
