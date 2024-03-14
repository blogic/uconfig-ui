import React, { HTMLAttributes } from 'react';
import { CaretRight } from '@phosphor-icons/react';
import clsx from 'clsx';

export type NavigationTileProps = {
  onClick: () => void;
  title: string | React.ReactNode;
  description: string;
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const NavigationTile = ({ onClick, title, description, className }: NavigationTileProps) => (
  <div
    className={clsx('relative cursor-pointer rounded-lg border px-2 py-4', className)}
    onClick={onClick}
    onKeyDown={onClick}
    role="button"
    tabIndex={0}
  >
    {typeof title === 'string' ? <h2 className="font-bold dark:text-white">{title}</h2> : title}
    <p className="pr-6 font-light dark:text-white">{description}</p>
    <CaretRight className=" absolute right-4 top-1/2 -translate-y-1/2 transform dark:text-white" />
  </div>
);
