import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useRestart } from 'api/queries/useRestart';
import { Button } from 'components/Button';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const restart = useRestart();

  const handleRestart = () => {
    restart.mutate();
  };

  return (
    <>
      <PageTitleBar title={t('restart')} />
      <Text variant="explanation">{t('restartWarning')}</Text>
      <Button
        buttonType="button"
        colorScheme="primary"
        className="mt-4 w-full"
        onClick={handleRestart}
        isLoading={restart.isPending}
      >
        {t('restart')}
      </Button>
    </>
  );
};

export const Route = createFileRoute('/protected/system/restart')({
  component: Component,
});
