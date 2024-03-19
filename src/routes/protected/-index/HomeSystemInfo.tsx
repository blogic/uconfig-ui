import { Brain, Clock, Cpu, Devices, QrCode } from '@phosphor-icons/react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getBoardOptions } from 'api/queries/board';
import { getClientsOptions } from 'api/queries/clients';
import { getSystemInfoOptions } from 'api/queries/systemInfo';
import { StatDisplay } from 'components/StatDisplay';

export const HomeSystemInfo = () => {
  const { t } = useTranslation('home');
  const { t: tSystem } = useTranslation('system');
  const getClients = useSuspenseQuery(getClientsOptions);
  const { data: systemInfo } = useSuspenseQuery(getSystemInfoOptions);
  const { data: boardInfo } = useSuspenseQuery(getBoardOptions);

  const memoryUsedPct =
    Math.round(((systemInfo.memory.total - systemInfo.memory.available) / systemInfo.memory.total) * 100 * 100) / 100;
  const navigate = useNavigate();

  const navigateToSystem = () => navigate({ to: '/protected/system' });

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      <StatDisplay
        className="bg-success-300 dark:bg-success-500"
        title={`${memoryUsedPct}%`}
        description={tSystem('memoryUsed')}
        icon={<Brain className="h-6 w-6 text-black dark:text-white" />}
        onClick={navigateToSystem}
      />
      <StatDisplay
        title={`${systemInfo.load[0]}%`}
        description={tSystem('load')}
        className="bg-warning-300 dark:bg-warning-500"
        icon={<Cpu className="h-6 w-6 text-black dark:text-white" />}
        onClick={navigateToSystem}
      />
      <StatDisplay
        title={new Date(systemInfo.localtime * 1000).toLocaleTimeString()}
        description={t('localtime')}
        className="bg-tertiary-300 dark:bg-tertiary-500"
        icon={<Clock className="h-6 w-6 text-black dark:text-white" />}
        onClick={navigateToSystem}
      />
      <StatDisplay
        className="bg-primary-300 dark:bg-primary-500"
        title={`${getClients.data.clientsArray.length}`}
        description={t('connections')}
        icon={<Devices className="h-6 w-6 text-black dark:text-white" />}
        onClick={navigateToSystem}
      />
      <StatDisplay
        className="col-span-2 bg-secondary-300 dark:bg-secondary-500"
        title={boardInfo.model}
        description={tSystem('model')}
        icon={<QrCode className="h-6 w-6 text-black dark:text-white" />}
        onClick={navigateToSystem}
      />
    </div>
  );
};
