import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { Button } from 'components/Button';
import { StringFormField } from 'components/Form/StringField';
import { PageTitleBar } from 'layout/PageTitleBar';
import { isValidAlphanumeric } from 'utils/formTests';
import { TFunction } from 'i18next';

const formSchema = (t: TFunction<'common'>) =>
  z.object({
    hostname: z
      .string()
      .min(1)
      .refine((value) => isValidAlphanumeric(value), t('invalidAlphanumeric')),
  });

type FormState = z.infer<ReturnType<typeof formSchema>>;

const Component = () => {
  const { t } = useTranslation('system');
  const { t: tCommon } = useTranslation();
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);

  const defaultValues = React.useMemo(
    () => ({
      hostname: currentConfiguration.device?.hostname ?? 'OpenWrt',
    }),
    [currentConfiguration],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(tCommon)),
    defaultValues,
    mode: 'all',
  });
  const onSubmit = (data: FormState) => {
    // Map back form values to the configuration
    const newConfig = currentConfiguration;

    if (newConfig.device) {
      newConfig.device.hostname = data.hostname;
    } else {
      // Create a new interface?
      newConfig.device = {
        hostname: data.hostname,
      };
    }

    // TODO: Send the new configuration to the server
  };
  return (
    <>
      <PageTitleBar title={t('hostname')} />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
       <StringFormField<FormState>
          register={register}
          name="hostname"
          label={t('hostname')}
          placeholder="YourRouterName"
          errors={errors}
        />
        <div className={clsx('flex space-x-6',  isDirty ? 'visible' : 'invisible')}>
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

export const Route = createFileRoute('/protected/system/hostname')({
  component: Component,
});
