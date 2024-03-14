import { HTMLAttributes } from 'react';
import clsx from 'clsx';

export type InformationTileProps = {
  title: string | React.ReactNode;
  description: string | React.ReactNode;
  className?: HTMLAttributes<HTMLDivElement>['className'];
};

export const InformationTile = ({ title, description, className }: InformationTileProps) => (
  <div className={clsx('relative rounded-lg border px-2 py-4', className)}>
    {typeof title === 'string' ? <h2 className="font-bold dark:text-white">{title}</h2> : title}
    {typeof description === 'string' ? <p className="font-light dark:text-white">{description}</p> : description}
  </div>
);
