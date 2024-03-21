import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { PageTitleBar } from 'layout/PageTitleBar';
import { Clients } from '../-index/Clients';

const Component = () => {
  const { t } = useTranslation('clients');


  return (
    <>
      <PageTitleBar title={t('title')} />
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-200">{t('description')}</p>
      <div className="space-y-4">
        <Clients />
      </div>
    </>
  );
};

export const Route = createFileRoute('/protected/clients/')({
  component: Component,
});
