import { /*Brain, , Cpu, */Clock, Power, Factory } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { getSystemInfoOptions } from 'api/queries/systemInfo';
import { Heading } from 'components/Heading';
import { NavigationTile } from 'components/NavigationTile';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const { t: tHome } = useTranslation('home');
  const navigate = useNavigate();
  const { data: systemInfo } = useSuspenseQuery(getSystemInfoOptions);
  const { data: boardInfo } = useSuspenseQuery(getBoardOptions);
  const getInfo = useSuspenseQuery(getBoardOptions);

  /*const memoryUsedPct =
    Math.round(((systemInfo.memory.total - systemInfo.memory.available) / systemInfo.memory.total) * 100 * 100) / 100;*/

  return (
    <>
      <PageTitleBar title={t('title')} />
      <div className="space-y-4">
        <div>
          <NavigationTile
            title={t('boardInfo')}
            description={boardInfo.model}
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './systemInfo',
              });
            }}
            className="rounded-b-none"
          />
          <NavigationTile
            title={t('hostname')}
            description={getInfo.data.hostname}
            onClick={() => {
              navigate({
                from: Route.fullPath,
                to: './hostname',
              });
            }}
            className="rounded-t-none"
          />
        </div>
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
        />
        <NavigationTile
          title={t('firmwareVersion')}
          description={boardInfo.release.description}
          onClick={() => {
            navigate({
              from: Route.fullPath,
              to: './firmware/',
            });
          }}
        />
        <div>
          <NavigationTile
            title={
              <div className="flex items-center">
                <Power className="ml-1 mt-0.5 h-6 w-6 text-danger-500 dark:text-danger-300" weight="fill" />
                <Heading size="md">{t('restart')}</Heading>
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
                <Factory className="ml-1 mt-0.5 h-6 w-6 text-danger-500 dark:text-danger-300" weight="fill" />
                <Heading size="md">{t('factory')}</Heading>
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
