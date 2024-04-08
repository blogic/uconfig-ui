import { ArrowCircleLeft } from '@phosphor-icons/react';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { IconButton } from './IconButton';

export const GoBackButton = () => {
  const { t } = useTranslation('navigation');
  const router = useRouter();

  const onClick = () => router.history.go(-1);

  return (
    <IconButton
      label={t('goBack')}
      onClick={onClick}
      icon={<ArrowCircleLeft weight="fill" size={48} className="text-primary-500 dark:text-primary-300" />}
      tooltipClassName="absolute left-0 top-0 w-max"
      tooltipPlacement="bottom"
      className=" h-max w-max"
    />
  );
};
