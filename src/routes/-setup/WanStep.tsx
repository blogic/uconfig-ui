import { zodResolver } from '@hookform/resolvers/zod';
import { TFunction } from 'i18next';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from 'components/Button';
import { SelectFormField } from 'components/Form/SelectField';
import { StringFormField } from 'components/Form/StringField';
import { Heading } from 'components/Heading';
import { Text } from 'components/Text';
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

export type WanStepProps = {
  submitForm: (data: Record<string, unknown>) => void;
};

export const SetupWanStep = ({ submitForm }: WanStepProps) => {
  const { t } = useTranslation('network');
  const { t: tSetup } = useTranslation('setup');

  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitting, isValid, errors },
  } = useForm<FormState>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      addressing: 'dynamic',
    },
    mode: 'all',
  });

  const isStatic = watch('addressing') === 'static';

  const onSubmit = (data: FormState) => {
    submitForm({ wan: { ipv4 : data }});
  };

  return (
    <div>
      <Heading size="lg">{tSetup('wanTitle')}</Heading>
      <Heading size="md" className="mt-4">
        {t('ipv4')}
      </Heading>
      <Text variant="explanation">{t('ipv4Explanation')}</Text>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="flex space-x-6">
          <Button buttonType="submit" disabled={!isValid} isLoading={isSubmitting}>
            {tSetup('next')}
          </Button>
        </div>
      </form>
    </div>
  );
};
