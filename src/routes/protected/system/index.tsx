import { Brain, Clock, Cpu, Power } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { getSystemInfoOptions } from 'api/queries/systemInfo';
import { Heading } from 'components/Heading';
import { InformationTile } from 'components/InformationTile';
import { NavigationTile } from 'components/NavigationTile';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const { t: tHome } = useTranslation('home');
  const navigate = useNavigate();
  const { data: systemInfo } = useSuspenseQuery(getSystemInfoOptions);
  const { data: boardInfo } = useSuspenseQuery(getBoardOptions);

  const memoryUsedPct =
    Math.round(((systemInfo.memory.total - systemInfo.memory.available) / systemInfo.memory.total) * 100 * 100) / 100;

  return (
    <>
      <PageTitleBar title={t('title')} />
      <div className="space-y-4">
        <div>
          <InformationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{t('memoryUsed')}</Heading>
                <Brain className="ml-1  h-6 w-6 text-primary-500 dark:text-primary-300" />
              </div>
            }
            description={`${memoryUsedPct}%`}
            className="rounded-b-none"
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
            className="rounded-none"
          />
          <NavigationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{tHome('localtime')}</Heading>
                <Clock className="ml-1  h-6 w-6 text-tertiary-500 dark:text-tertiary-300" />
              </div>
            }
            description={new Date(systemInfo.localtime * 1000).toLocaleString()}
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './timezone',
              });
            }}
            className="rounded-t-none"
          />
        </div>
        <div>
          <NavigationTile
            title={t('firmwareVersion')}
            description={boardInfo.release.description}
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './firmware/',
              });
            }}
            className="rounded-b-none"
          />
          <NavigationTile
            title={t('boardInfo')}
            description={boardInfo.model}
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './systemInfo',
              });
            }}
            className="rounded-t-none"
          />
        </div>
        <div>
          <NavigationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{t('restart')}</Heading>
                <Power className="ml-1 mt-0.5 h-6 w-6 text-success-500 dark:text-success-300" weight="fill" />
              </div>
            }
            description=""
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './restart',
              });
            }}
            className="rounded-b-none"
          />
          <NavigationTile
            title={
              <div className="flex items-center">
                <Heading size="md">{t('factory')}</Heading>
                <Power className="ml-1 mt-0.5 h-6 w-6 text-success-500 dark:text-success-300" weight="fill" />
              </div>
            }
            description=""
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './factory',
              });
            }}
            className="rounded-t-none"
          />
        </div>
        <div className="text-center">
          <Text variant="explanation">
            {t('appVersion')}: {__APP_VERSION__}
          </Text>
        </div>
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/system/')({
  component: Component,
});
