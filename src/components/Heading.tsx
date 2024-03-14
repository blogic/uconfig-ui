import React from 'react';
import clsx from 'clsx';

const commonClasses = 'font-bold dark:text-white';

export type HeadingProps = {
  size: 'sm' | 'md' | 'lg';
  className?: React.HTMLAttributes<HTMLHeadingElement>['className'];
};

export const Heading = ({ children, size, className }: React.PropsWithChildren<HeadingProps>) => {
  if (size === 'sm') return <h3 className={clsx('text-sm', commonClasses, className)}>{children}</h3>;

  if (size === 'md') return <h2 className={clsx('text-md', commonClasses, className)}>{children}</h2>;

  return <h1 className={clsx('text-lg', commonClasses, className)}>{children}</h1>;
};
