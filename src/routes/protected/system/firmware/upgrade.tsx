import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { FileInput } from 'components/FileInput';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const Component = () => {
  const { t } = useTranslation('system');

  return (
    <>
      <PageTitleBar title={t('firmwareUpgrade')} />
      <Text variant="explanation" className="mb-4">
        {t('firmwareUpgradeExplanation')}
      </Text>
      <FileInput accept=".bin" />
    </>
  );
};

export const Route = createFileRoute('/protected/system/firmware/upgrade')({
  component: Component,
});
