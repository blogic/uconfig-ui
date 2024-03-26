import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute } from '@tanstack/react-router';
import clsx from 'clsx';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { getCurrentConfigurationOptions } from 'api/queries/configurations';
import { getCapabilities } from 'api/queries/capabilities';
import { Button } from 'components/Button';
import { CheckboxesFormField } from 'components/Form/CheckboxesField';
import { SelectFormField, SelectFormFieldOption } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { ToggleFormField } from 'components/Form/ToggleField';
import { Text } from 'components/Text';
import { PageTitleBar } from 'layout/PageTitleBar';
import { useSuspenseQuery } from '@tanstack/react-query';

const formSchema = z.discriminatedUnion('mode', [
  z.object({
   mode: z.literal('automatic'),
  }),
  z.object({
    mode: z.literal('manual'),
    channel: z.string(),
  }),
]);

type FormState = z.infer<typeof formSchema>;

const Component = () => {
  const { t } = useTranslation('wireless');
  const { t: tCommon } = useTranslation();
  const { band } = Route.useParams();
  const currentBand = Route.useLoaderData();
  const { data: Capabilities } = useSuspenseQuery(getCapabilities);

  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isValid, isDirty, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: currentBand?.mode || 'manual',
      channel: currentBand?.channel,
    },
    mode: 'all',
  });

  const isEnabled = watch('mode') === 'manual';

  const onSubmit = (data: FormState) => {
    console.log(data);

    // TODO: if all the information changes -> logout user and tell them to reconnect to network
  };
/*
        */
  return (
    <>
      <PageTitleBar title={t(band)} />
      <Text variant="explanation">{t('bandExplanation')}</Text>
      <form className="mt-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <SelectFormField<FormState>
          register={register}
          name="mode"
          label=""
          errors={errors}
          options={[
            { label: t('manual'), value: 'manual' },
            { label: t('automatic'), value: 'automatic' },
          ]}
        />
        {isEnabled ? (
          <div>
            <SelectFormField<FormState>
              register={register}
              name="channel"
              label={t('channel')}
              errors={errors}
              options={Capabilities.band[band]?.channels || [ 'auto' ]}
            />
          </div>
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

export const Route = createFileRoute('/protected/wireless/band/$band/')({
  parseParams: (params) => ({
    band: z.enum(['2G', '5G', '6G']).parse(params.band),
  }),
  stringifyParams: ({ band }) => ({ band }),
  loader: async ({ context, params }) => {
    const configuration = await context.queryClient.ensureQueryData(getCurrentConfigurationOptions);
    const currentBand = configuration.band?.[params.band];
    if (!currentBand) {
      // TODO: Should be uncommented to prevent users from accessing non-existing bands
      // throw new Error('band not found in configuration');
    }

    return currentBand;
  },
  component: Component,
});
