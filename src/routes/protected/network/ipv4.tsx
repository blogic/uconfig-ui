import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useBlocker } from '@tanstack/react-router';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { InterfaceConfiguration } from 'api/types/configurations.types';
import { Button } from 'components/Button';
import { SelectFormField } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';
import { isValidIpv4, isValidIpv4Cidr } from 'utils/formTests';

const formSchema = (t: TFunction<'network'>) =>
  z.discriminatedUnion('addressing', [
    z.object({
      addressing: z.literal('dynamic'),
    }),
    z.object({
      addressing: z.literal('static'),
      subnet: z.string().refine(isValidIpv4Cidr, {
        message: t('subnet_error'),
      }),
      gateway: z.string().refine(isValidIpv4, {
        message: t('ipv4_error'),
      }),
      dns: z.string().refine(isValidIpv4, {
        message: t('ipv4_error'),
      }),
    }),
  ]);

type FormState = z.infer<ReturnType<typeof formSchema>>;

const Component = () => {
  const { t } = useTranslation('network');
  const { t: tCommon } = useTranslation('common');
  const { data: currentConfiguration } = useSuspenseQuery(getCurrentConfigurationOptions());

  const defaultValues: FormState = React.useMemo(() => {
    const wan = currentConfiguration.interfaces.wan as unknown as InterfaceConfiguration;

    if (wan.ipv4.addressing === 'dynamic') return { addressing: 'dynamic' };

    return {
      addressing: wan.ipv4.addressing,
      subnet: wan.ipv4.subnet,
      gateway: wan.ipv4.gateway,
      dns: wan.ipv4.dns,
    };
  }, [currentConfiguration]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, isDirty, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(t)),
    defaultValues,
    mode: 'all',
  });

  const isStatic = watch('addressing') === 'static';

  useBlocker(() => window.confirm(tCommon('unsaved_changes')), isDirty);

  const onSubmit = (data: FormState) => {
    // Map back form values to the configuration
    const newConfig = currentConfiguration;

    if (newConfig.interfaces.wan) {
      newConfig.interfaces.wan.ipv4 = {
        ...newConfig.interfaces.wan.ipv4,
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
      <PageTitleBar title={t('ipv4')} />
      <Text variant="explanation">{t('ipv4Explanation')}</Text>
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
          <>
            <StringFormField<FormState>
              register={register}
              name="subnet"
              label={t('subnet')}
              placeholder="192.168.1.100/24"
              errors={errors}
            />
            <StringFormField<FormState>
              register={register}
              name="gateway"
              label={t('gateway')}
              placeholder="192.168.1.1"
              errors={errors}
            />
            <StringFormField<FormState>
              register={register}
              name="dns"
              label={t('dns')}
              placeholder="192.168.1.1"
              errors={errors}
            />
          </>
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

export const Route = createFileRoute('/protected/network/ipv4')({
  component: Component,
});
