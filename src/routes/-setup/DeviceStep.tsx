import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from 'components/Button';
import { StringFormField } from 'components/Form/StringField';
import { Heading } from 'components/Heading';
import { isValidAlphanumeric } from 'utils/formTests';

const formSchema = (t: TFunction<'common'>) =>
  z.object({
    hostname: z
      .string()
      .min(1)
      .refine((value) => isValidAlphanumeric(value), t('invalidAlphanumeric')),
    password: z.string().min(1),
    timezone: z.string(),
  });

type FormState = z.infer<ReturnType<typeof formSchema>>;

export type DeviceStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupDeviceStep = ({ submitForm }: DeviceStepProps) => {
  const { t } = useTranslation('setup');
  const { t: tCommon } = useTranslation('common');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(tCommon)),
    defaultValues: {
      hostname: '',
      password: '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    mode: 'all',
  });

  const onSubmit = (data: FormState) => {
    submitForm({ device: data });
  };

  return (
    <div className="w-full">
      <Heading size="lg">{t('deviceTitle')}</Heading>
      <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <StringFormField<FormState>
          register={register}
          name="hostname"
          label={t('hostname')}
          placeholder="YourRouterName"
          errors={errors}
        />
        <StringFormField<FormState>
          register={register}
          name="password"
          label={t('devicePassword')}
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
