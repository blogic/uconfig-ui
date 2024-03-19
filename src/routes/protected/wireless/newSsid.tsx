import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { Button } from 'components/Button';
import { CheckboxesFormField } from 'components/Form/CheckboxesField';
import { SelectFormField } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const formSchema = (existingSsids: string[], t: TFunction<'wireless'>) =>
  z.object({
    ssid: z
      .string()
      .min(1)
      .max(32)
      .refine((ssid) => !existingSsids.includes(ssid), {
        message: t('ssidAlreadyExists'),
      }),
    security: z.enum(['max', 'compat']),
    password: z.string().min(8),
    'wifi-bands': z.array(z.enum(['2G', '5G', '6G'])).min(1),
  });

type FormState = z.infer<ReturnType<typeof formSchema>>;

const Component = () => {
  const { t } = useTranslation('wireless');
  const { t: tCommon } = useTranslation();
  const getConfiguration = useSuspenseQuery(getCurrentConfigurationOptions);

  const allCurrentSsids = Object.values(getConfiguration.data.interfaces?.wan?.ssids ?? {}).map(({ ssid }) => ssid);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(allCurrentSsids, t)),
    defaultValues: {
      ssid: '',
      security: 'max',
      password: '',
      'wifi-bands': ['2G', '5G'],
    },
    mode: 'all',
  });

  const onSubmit = (data: FormState) => {
    console.log(data);

    // TODO: if all the information changes -> logout user and tell them to reconnect to network
  };

  return (
    <>
      <PageTitleBar title={t('createNewSsid')} />
      <Text variant="explanation">{t('ssidExplanation')}</Text>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <StringFormField<FormState>
          register={register}
          name="ssid"
          label={t('ssid')}
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
        <Controller
          control={control}
          name="wifi-bands"
          render={({ field: { value, onChange } }) => (
            <CheckboxesFormField<FormState>
              name="wifi-bands"
              label={t('wifiBands')}
              value={value}
              setValue={onChange}
              errors={errors}
              options={[
                { label: '2G', value: '2G', explanation: t('twoGExplanation') },
                { label: '5G', value: '5G', explanation: t('fiveGExplanation') },
                { label: '6G', value: '6G', explanation: t('sixGExplanation') },
              ]}
            />
          )}
        />
        <StringFormField<FormState>
          register={register}
          name="password"
          label={t('wifiPassword')}
          placeholder="Secure Password"
          errors={errors}
          canHide
        />
        <div className={clsx('flex space-x-6', isDirty ? 'visible' : 'invisible')}>
          <Button buttonType="button" onClick={() => reset()} colorScheme="gray">
            {tCommon('reset')}
          </Button>
          <Button buttonType="submit" disabled={!isValid} isLoading={isSubmitting}>
            {tCommon('save')}
          </Button>
        </div>
      </form>
    </>
  );
};

export const Route = createFileRoute('/protected/wireless/newSsid')({
  component: Component,
});
