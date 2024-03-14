import { useTranslation } from 'react-i18next';
import { Button } from 'components/Button';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';

export type WelcomeStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupWelcomeStep = ({ submitForm }: WelcomeStepProps) => {
  const { t } = useTranslation('setup');

  return (
    <div>
      <Heading size="lg">{t('welcomeTitle')}</Heading>
      <Text variant="explanation">{t('welcomeExplanation')}</Text>
      <Text variant="explanation" className="mt-4">
        {t('welcomeExplanation2')}
      </Text>
      <Button buttonType="button" onClick={() => submitForm({})} className="mt-4">
        {t('start')}
      </Button>
    </div>
  );
};
