import { HTMLAttributes } from 'react';
import {
  WifiHigh,
  WifiLow,
  WifiMedium,
} from '@phosphor-icons/react';
import { Client } from 'api/types/clients.types';

export type WiFiIconProps = {
  wifi: Client['wifi'];
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const WiFiIcon = ({ wifi, className }: WiFiIconProps) => {
  if (wifi) {
    if (wifi?.signal > -50) return <WifiHigh weight="bold" className={className} />;
    if (wifi?.signal > -90) return <WifiMedium className={className} />;
  }
  return <WifiLow className={className} />;
};