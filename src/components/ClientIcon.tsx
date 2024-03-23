import { HTMLAttributes } from 'react';
import {
  Globe,
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
import { Client } from 'api/types/clients.types';

export type ClientIconProps = {
  info: Client['info'];
  className: HTMLAttributes<HTMLDivElement>['className'];
};

export const ClientIcon = ( { info, className }: ClientIconProps ) => {
  switch (info?.class?.toLowerCase()) {
    case 'speaker':
      return <SpeakerHifi weight="fill" className={className} />;
    case 'tv':
      return <TelevisionSimple weight="fill" className={className} />;
    case 'pc':
      return <Desktop weight="fill" className={className} />;
    case 'laptop':
      return <Laptop weight="fill" className={className} />;
    case 'printer':
      return <Printer weight="fill" className={className} />;
    case 'gaming':
      return <GameController weight="fill" className={className} />;
  }
  switch (info?.os?.toLowerCase()) {
    case 'android 10':
    case 'android 11':
    case 'android 12':
    case 'android 13':
    case 'android 14':
      return <AndroidLogo weight="fill" className={className} />;
    case 'windows 10':
      return <WindowsLogo weight="fill" className={className} />;
  }
  switch (info?.vendor?.toLowerCase()) {
    case 'apple':
      return <AppleLogo weight="fill" className={className} />;
  }
  return <Globe weight="fill" className={className} />;
};