import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from 'components/Button';
import { SelectFormField } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';

const formSchema = z.discriminatedUnion('enable', [
  z.object({
    enable: z.literal('disable'),
  }),
  z.object({
    enable: z.literal('enable'),
    password: z.string().min(8),
  }),
]);

type FormState = z.infer<typeof formSchema>;

export type GuestStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupGuestStep = ({ submitForm }: GuestStepProps) => {
  const { t } = useTranslation('common');
  const { t: tSetup } = useTranslation('setup');

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enable: 'disable',
    },
    mode: 'all',
  });

  const isEnabled = watch('enable') === 'enable';

  const onSubmit = (data: FormState) => {
    submitForm({ guest: data });
  };

  return (
    <div>
      <Heading size="lg">{tSetup('guestTitle')}</Heading>
      <Text variant="explanation">{tSetup('guestExplanation')}</Text>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <SelectFormField<FormState>
          register={register}
          name="enable"
          label=""
          errors={errors}
          options={[
            { label: t('disable'), value: 'disable' },
            { label: t('enable'), value: 'enable' },
          ]}
        />
        {isEnabled ? (
          <StringFormField<FormState>
            register={register}
            name="password"
            label={tSetup('guestPassword')}
            placeholder="Secure Password"
            errors={errors}
            canHide
          />
        ) : null}
        <div className="flex space-x-6">
          <Button buttonType="submit" disabled={!isValid} isLoading={isSubmitting}>
            {tSetup('next')}
          </Button>
        </div>
      </form>
    </div>
  );
};
