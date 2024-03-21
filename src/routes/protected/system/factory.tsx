import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useFactory } from 'api/queries/useFactory';
import { Button } from 'components/Button';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');
  const factory = useFactory();

  const handleFactory = () => {
    factory.mutate();
  };

  return (
    <>
      <PageTitleBar title={t('factory')} />
      <Text variant="explanation">{t('factoryWarning')}</Text>
      <Button
        buttonType="button"
        colorScheme="primary"
        className="mt-4 w-full"
        onClick={handleFactory}
        isLoading={factory.isPending}
      >
        {t('factory')}
      </Button>
    </>
  );
};

export const Route = createFileRoute('/protected/system/factory')({
  component: Component,
});
