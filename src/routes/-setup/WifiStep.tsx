import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from 'components/Button';
import { SelectFormField } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';

const formSchema = z.object({
  ssid: z.string().min(1).max(32),
  security: z.enum(['max', 'compat']),
  password: z.string().min(8),
});

type FormState = z.infer<typeof formSchema>;

export type WifiStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupWifiStep = ({ submitForm }: WifiStepProps) => {
  const { t } = useTranslation('setup');

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ssid: '',
      security: 'max',
      password: '',
    },
    mode: 'all',
  });

  const onSubmit = (data: FormState) => {
    submitForm({ wifi: data });
  };

  return (
    <div className="w-full">
      <Heading size="lg">{t('wifiTitle')}</Heading>
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <StringFormField<FormState>
          register={register}
          name="ssid"
          label="SSID"
          placeholder="YourNetworkName"
          errors={errors}
        />
        <div>
          <SelectFormField<FormState>
            register={register}
            name="security"
            label={t('security')}
            options={[
              { value: 'max', label: t('maxSecurity') },
              { value: 'compat', label: t('compatibilitySecurity') },
            ]}
            errors={errors}
          />
          <Text variant="explanation">
            {watch('security') === 'compat' ? t('compatibilitySecurityExplanation') : t('maxSecurityExplanation')}
          </Text>
        </div>
        <StringFormField<FormState>
          register={register}
          name="password"
          label={t('wifiPassword')}
          placeholder="Secure Password"
          errors={errors}
          canHide
        />
        <Button buttonType="submit" disabled={!isValid} isLoading={isSubmitting}>
          {t('next')}
        </Button>
      </form>
    </div>
  );
};
