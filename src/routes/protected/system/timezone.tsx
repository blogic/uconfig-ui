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
import { SelectFormField } from 'components/Form/SelectField';
import { TIMEZONES_ARRAY_WITH_VALUE } from 'data/tz';
import { PageTitleBar } from 'layout/PageTitleBar';

const formSchema = z.object({
  timezone: z.string(),
});

type FormState = z.infer<typeof formSchema>;

const Component = () => {
  const { t } = useTranslation('system');
  const { t: tCommon } = useTranslation();
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);

  const defaultValues = React.useMemo(
    () => ({
      timezone: currentConfiguration.unit?.timezone ?? TIMEZONES_ARRAY_WITH_VALUE[0]?.value,
    }),
    [currentConfiguration],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'all',
  });
  const onSubmit = (data: FormState) => {
    console.log(data);
    // Map back form values to the configuration
    const newConfig = currentConfiguration;

    if (newConfig.unit) {
      newConfig.unit.timezone = data.timezone;
    } else {
      // Create a new interface?
      newConfig.unit = {
        timezone: data.timezone,
      };
    }

    console.log(newConfig);

    // TODO: Send the new configuration to the server
  };
  return (
    <>
      <PageTitleBar title={t('timezone')} />
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SelectFormField<FormState>
          register={register}
          name="timezone"
          label={t('timezone')}
          errors={errors}
          options={TIMEZONES_ARRAY_WITH_VALUE}
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

export const Route = createFileRoute('/protected/system/timezone')({
  component: Component,
});
