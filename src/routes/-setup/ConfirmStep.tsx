import { useTranslation } from 'react-i18next';
import { useFinishWizard } from 'api/queries/useFinishWizard';
import { Button } from 'components/Button';
import { Heading } from 'components/Heading';

export type ConfirmStepProps = {
  state: Record<string, unknown>;
};

export const SetupConfirmStep = ({ state }: ConfirmStepProps) => {
  const { t } = useTranslation('setup');
  const finishWizard = useFinishWizard();

  const handleSubmit = () => {
    finishWizard.mutate(state);
  };

  return (
    <div className="w-full">
      <Heading size="lg">{t('confirmTitle')}</Heading>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      {finishWizard.isError ? <div className="text-red-500 dark:text-red-400">{t('errorSubmitting')}</div> : null}
      {finishWizard.isSuccess ? (
        <div className="text-green-500 dark:text-green-400">{t('successSubmitting')}</div>
      ) : null}
      <Button buttonType="button" onClick={handleSubmit} className="mt-4" isLoading={finishWizard.isPending}>
        {t('save')}
      </Button>
    </div>
  );
};
