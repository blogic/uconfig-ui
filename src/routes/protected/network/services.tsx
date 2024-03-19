import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useBlocker } from '@tanstack/react-router';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { InterfaceConfiguration } from 'api/types/configurations.types';
import { Button } from 'components/Button';
import { CheckboxesFormField } from 'components/Form/CheckboxesField';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const formSchema = z.object({
  services: z.array(z.enum(['mdns', 'ssh', 'web-ui'])),
});

type FormState = z.infer<typeof formSchema>;

const Component = () => {
  const { t } = useTranslation('network');
  const { t: tCommon } = useTranslation('common');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions);

  const defaultValues: FormState = React.useMemo(() => {
    const wan = currentConfiguration.interfaces.wan as unknown as InterfaceConfiguration;

    return {
      services: wan.services,
    };
  }, [currentConfiguration]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'all',
  });

  useBlocker(() => window.confirm(tCommon('unsaved_changes')), isDirty);

  const onSubmit = (data: FormState) => {
    // Map back form values to the configuration
    const newConfig = currentConfiguration;

    if (newConfig.interfaces.wan) {
      newConfig.interfaces.wan.services = data.services;
    } else {
      // Create a new interface?
    }

    console.log(newConfig);

    // TODO: Send the new configuration to the server
  };

  return (
    <>
      <PageTitleBar title={t('services')} />
      <Text variant="explanation">{t('servicesExplanation')}</Text>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="services"
          render={({ field: { value, onChange } }) => (
            <CheckboxesFormField<FormState>
              name="services"
              label=""
              value={value}
              setValue={onChange}
              errors={errors}
              options={[
                { label: t('mdns'), value: 'mdns', explanation: t('mdnsExplanation') },
                { label: t('ssh'), value: 'ssh', explanation: t('sshExplanation') },
                { label: t('webUi'), value: 'web-ui', explanation: t('webUiExplanation') },
              ]}
            />
          )}
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

export const Route = createFileRoute('/protected/network/services')({
  component: Component,
});
