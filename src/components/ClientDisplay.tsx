import { HTMLAttributes } from 'react';
import {
  ArrowFatDown,
  ArrowFatUp,
  CaretRight,
  Globe,
  WifiHigh,
  WifiLow,
  WifiMedium,
  Printer,
  Laptop,
  SpeakerHifi,
  TelevisionSimple,
  Desktop,
  GameController,
  AndroidLogo,
  AppleLogo,
  WindowsLogo,
} from '@phosphor-icons/react';
import clsx from 'clsx';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { Heading } from './Heading';
import { Tooltip } from './Tooltip';
import { Client } from 'api/types/clients.types';
import { byteToString } from 'utils/strings';

const ICON_CLASSES =
  'absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 transform text-primary-500 dark:text-primary-200';
const SIGNAL_CLASSES = 'text-primary-500 dark:text-primary-200';

const signalToIcon = (signal: number) => {
  if (signal > -50) {
    return <WifiHigh weight="bold" className={SIGNAL_CLASSES} />;
  }

  if (signal > -90) return <WifiMedium className={ICON_CLASSES} />;

  return <WifiLow className={ICON_CLASSES} />;
};

const infoToIcon = (info: Client['info']) => {
  switch (info?.class?.toLowerCase()) {
    case 'speaker':
      return <SpeakerHifi weight="fill" className={ICON_CLASSES} />;
    case 'tv':
      return <TelevisionSimple weight="fill" className={ICON_CLASSES} />;
    case 'pc':
      return <Desktop weight="fill" className={ICON_CLASSES} />;
    case 'laptop':
      return <Laptop weight="fill" className={ICON_CLASSES} />;
    case 'printer':
      return <Printer weight="fill" className={ICON_CLASSES} />;
    case 'gaming':
      return <GameController weight="fill" className={ICON_CLASSES} />;
  }
  switch (info?.os?.toLowerCase()) {
    case 'android 10':
    case 'android 11':
    case 'android 12':
    case 'android 13':
    case 'android 14':
      return <AndroidLogo weight="fill" className={ICON_CLASSES} />;
    case 'windows 10':
      return <WindowsLogo weight="fill" className={ICON_CLASSES} />;
  }
  switch (info?.vendor?.toLowerCase()) {
    case 'apple':
      return <AppleLogo weight="fill" className={ICON_CLASSES} />;
  }
  return <Globe weight="fill" className={ICON_CLASSES} />;
};

const dataDisplay = (t: TFunction<'common'>, wifi: Client['wifi']) => {
  if (!wifi?.bytes) return null;

  return (
    <>
      <Tooltip label={t('signal')}>{signalToIcon(wifi.signal)}</Tooltip>
      <Tooltip label={t('download')}>
        <p className="flex items-center font-light dark:text-white">
          <ArrowFatDown weight="duotone" className=" mr-1 text-tertiary-400 dark:text-tertiary-500" />
          {byteToString(wifi.bytes.rx)}
        </p>
      </Tooltip>
      <Tooltip label={t('upload')}>
        <p className="flex items-center font-light dark:text-white">
          <ArrowFatUp weight="duotone" className="mr-1 text-secondary-400 dark:text-secondary-500" />
          {byteToString(wifi.bytes.tx)}
        </p>
      </Tooltip>
    </>
  );
};

export type ClientDisplayProps = {
  client: Client;
  onClick: () => void;
  className?: HTMLAttributes<HTMLDivElement>['className'];
  displayName?: string;
};

export const ClientDisplay = ({ client: { info, wifi }, className, displayName, onClick }: ClientDisplayProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx('relative cursor-pointer rounded-lg border px-2 py-4', className)}
      onClick={onClick}
      onKeyDown={onClick}
      role="button"
      tabIndex={0}
    >
      {infoToIcon(info)}
      <div className="ml-10">
        <Heading size="md">{displayName}</Heading>
        <div className="flex items-center space-x-3">{dataDisplay(t, wifi)}</div>
      </div>
      <CaretRight className=" absolute right-4 top-1/2 -translate-y-1/2 transform dark:text-white" />
    </div>
  );
};
