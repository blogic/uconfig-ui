import clsx from 'clsx';
import { Heading } from './Heading';
import { Text } from './Text';

export type StatDisplayProps = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
  onClick?: () => void;
};

export const StatDisplay = ({
  title,
  description,
  icon,
  className,
  onClick,
}: React.PropsWithChildren<StatDisplayProps>) => (
  <div
    className={clsx('relative h-full w-full rounded-lg border p-6', className, onClick && 'cursor-pointer')}
    {...(onClick && { onClick, onKeyDown: onClick, role: 'button', tabIndex: 0 })}
  >
    {typeof title === 'string' ? <Heading size="md">{title}</Heading> : title}
    <div className="absolute right-4 top-4">{icon}</div>
    {typeof description === 'string' ? <Text variant="explanation">{description}</Text> : description}
  </div>
);
