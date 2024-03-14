import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type TextProps = {
  variant: 'normal' | 'explanation';
  className?: HTMLAttributes<HTMLParagraphElement>['className'];
};

export const Text = ({ children, variant, className }: React.PropsWithChildren<TextProps>) => {
  if (variant === 'explanation')
    return <p className={clsx('text-sm font-light text-gray-500 dark:text-gray-200', className)}>{children}</p>;

  return <p className={className}>{children}</p>;
};
