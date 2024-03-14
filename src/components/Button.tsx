/* eslint-disable react/button-has-type */
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import { Spinner } from './Spinner';

const COLOR_SCHEMES = {
  primary:
    'bg-primary-600 hover:bg-primary-500 focus-visible:outline-primary-600 disabled:bg-primary-200 text-white dark:bg-primary-500 dark:hover:bg-primary-400 dark:focus-visible:outline-primary-500 dark:disabled:bg-primary-300 dark:text-white',
  gray: 'bg-gray-200 hover:bg-gray-300 text-block focus-visible:outline-gray-200 disabled:bg-gray-100 text-black ',
} as const;
// bg-gray-200 text-black hover:bg-gray-300
export type ButtonProps = React.PropsWithChildren<{
  buttonType: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  colorScheme?: 'primary' | 'gray';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
}>;

export const Button = ({
  children,
  buttonType,
  colorScheme,
  onClick,
  className,
  disabled,
  isLoading,
  icon,
}: ButtonProps) => (
  <button
    type={buttonType ?? 'button'}
    disabled={disabled}
    onClick={onClick}
    className={clsx(
      'flex w-full items-center justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  disabled:cursor-not-allowed',
      COLOR_SCHEMES[colorScheme ?? 'primary'],
      className,
    )}
  >
    {isLoading ? <Spinner className="mr-2" size="sm" /> : null}
    {icon ? <div className="mr-2">{icon}</div> : null}
    {children}
  </button>
);
