import { useTranslation } from 'react-i18next';
import { Button } from 'components/Button';
import { Heading } from 'components/Heading';

export type ConfirmStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
  state: Record<string, unknown>;
};

export const SetupConfirmStep = ({ submitForm, state }: ConfirmStepProps) => {
  const { t } = useTranslation('setup');

  return (
    <div className="w-full">
      <Heading size="lg">{t('confirmTitle')}</Heading>
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <Button buttonType="button" onClick={() => submitForm(state)} className="mt-4">
        {t('save')}
      </Button>
    </div>
  );
};
