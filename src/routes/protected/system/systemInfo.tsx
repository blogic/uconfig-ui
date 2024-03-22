import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { InformationTile } from 'components/InformationTile';
import { PageTitleBar } from 'layout/PageTitleBar';
import { Heading } from 'components/Heading';
import { Brain, Cpu } from '@phosphor-icons/react';
import { getSystemInfoOptions } from 'api/queries/systemInfo';

const Component = () => {
  const { t } = useTranslation('system');
  const getInfo = useSuspenseQuery(getBoardOptions);
  const { data: systemInfo } = useSuspenseQuery(getSystemInfoOptions);

const memoryUsedPct =
    Math.round(((systemInfo.memory.total - systemInfo.memory.available) / systemInfo.memory.total) * 100 * 100) / 100;
  return (
    <>
      <PageTitleBar title={t('boardInfo')} />
      <div className="space-y-4">
        <div>
          <InformationTile title={t('model')} description={getInfo.data.model} className="rounded-b-none" />
          <InformationTile title={t('processor')} description={getInfo.data.system} className="rounded-none" />
          <InformationTile title={t('kernel')} description={getInfo.data.kernel} className="rounded-none" />
          <InformationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{t('memoryUsed')}</Heading>
                <Brain className="ml-1  h-6 w-6 text-primary-500 dark:text-primary-300" />
              </div>
            }
            description={`${memoryUsedPct}%`}
            className="rounded-none"
          />
         <InformationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{t('load')}</Heading>
                <Cpu className="ml-1  h-6 w-6 text-secondary-500 dark:text-secondary-300" />
              </div>
            }
            // TODO: Temporary, remove once load can be used
            description={`${systemInfo.load[0]}%`}
            className="rounded-t-none"
          />
        </div>
      </div>
    </>
  );
};
export const Route = createFileRoute('/protected/system/systemInfo')({
  component: Component,
  beforeLoad: async ({ context }) => {
    await context.queryClient.ensureQueryData(getBoardOptions);
  },
});
