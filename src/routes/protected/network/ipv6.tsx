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
import { ControlledSelectFormField } from 'components/ControlledInputs/ControlledSelectField';
import { SelectFormField } from 'components/Form/SelectField';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';

const formSchema = z.discriminatedUnion('addressing', [
  z.object({
    addressing: z.literal('dynamic'),
  }),
  z.object({
    addressing: z.literal('static'),
    dhcpv6: z
      .object({
        mode: z.enum(['hybrid']),
      })
      .optional(),
  }),
]);

type FormState = z.infer<typeof formSchema>;

const Component = () => {
  const { t } = useTranslation('network');
  const { t: tCommon } = useTranslation('common');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions());

  const defaultValues: FormState = React.useMemo(() => {
    const { ipv6 } = currentConfiguration.interfaces.wan as unknown as InterfaceConfiguration;

    if (ipv6.addressing === 'dynamic') return { addressing: 'dynamic' };

    return {
      addressing: ipv6.addressing,
      dhcpv6: ipv6.dhcpv6?.mode
        ? {
            mode: ipv6.dhcpv6.mode,
          }
        : undefined,
    };
  }, [currentConfiguration]);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'all',
  });

  const isStatic = watch('addressing') === 'static';

  useBlocker(() => window.confirm(tCommon('unsaved_changes')), isDirty);

  const onSubmit = (data: FormState) => {
    // Map back form values to the configuration
    const newConfig = currentConfiguration;

    if (newConfig.interfaces.wan) {
      newConfig.interfaces.wan.ipv6 = {
        ...newConfig.interfaces.wan.ipv6,
        ...data,
      };
    } else {
      // Create a new interface?
    }

    console.log(newConfig);

    // TODO: Send the new configuration to the server
  };

  return (
    <>
      <PageTitleBar title={t('ipv6')} />
      <Text variant="explanation">{t('ipv6Explanation')}</Text>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SelectFormField<FormState>
          register={register}
          name="addressing"
          label=""
          errors={errors}
          options={[
            { label: t('dynamic'), value: 'dynamic' },
            { label: t('static'), value: 'static' },
          ]}
        />
        {isStatic ? (
          <Controller
            name="dhcpv6"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ControlledSelectFormField<FormState>
                name="dhcpv6"
                value={value === undefined ? '' : value.mode}
                onChange={(v) => (v === '' ? onChange(undefined) : onChange({ mode: v }))}
                label={t('dhcpv6')}
                options={[
                  { label: t('disabled'), value: '' },
                  { label: t('hybrid'), value: 'hybrid' },
                ]}
              />
            )}
          />
        ) : null}
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

export const Route = createFileRoute('/protected/network/ipv6')({
  component: Component,
});
