import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from 'components/Button';
import { StringFormField } from 'components/Form/StringField';
import { ToggleFormField } from 'components/Form/ToggleField';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';
import { isValidIpv4Cidr } from 'utils/formTests';

const formSchema = (t: TFunction<'network'>) =>
  z.object({
    subnet: z.string().refine(isValidIpv4Cidr, {
      message: t('subnet_error'),
    }),
    dhcp: z.boolean(),
  });

type FormState = z.infer<ReturnType<typeof formSchema>>;

export type LanStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupLanStep = ({ submitForm }: LanStepProps) => {
  const { t } = useTranslation('network');
  const { t: tSetup } = useTranslation('setup');

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      subnet: '',
      dhcp: true,
    },
    mode: 'all',
  });

  const onSubmit = (data: FormState) => {
    submitForm({ wan: data });
  };

  return (
    <div>
      <Heading size="lg">LAN</Heading>
      <Text variant="explanation">{tSetup('lanExplanation')}</Text>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <StringFormField<FormState>
          register={register}
          name="subnet"
          label={t('subnet')}
          placeholder="192.168.1.100/24"
          errors={errors}
        />
        <ToggleFormField<FormState> register={register} name="dhcp" label="DHCP" errors={errors} />
        <div className="flex space-x-6">
          <Button buttonType="submit" disabled={!isValid} isLoading={isSubmitting}>
            {tSetup('next')}
          </Button>
        </div>
      </form>
    </div>
  );
};
