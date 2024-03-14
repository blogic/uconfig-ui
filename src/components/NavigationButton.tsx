import { Link, LinkProps } from '@tanstack/react-router';
import { Tooltip } from './Tooltip';

export type NavigationButtonProps = {
  label: string;
  navigateOptions: LinkProps & { preload?: 'intent' };
  icon: React.ReactNode;
};

export const NavigationButton = ({ label, navigateOptions, icon }: NavigationButtonProps) => (
  <Link
    key={label}
    className=" rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-white"
    activeProps={{
      className: 'rounded-md px-3 py-2 text-sm font-medium text-white bg-gray-600 dark:bg-gray-800',
    }}
    {...navigateOptions}
  >
    <Tooltip key={label} label={label}>
      {icon}
    </Tooltip>
  </Link>
);
